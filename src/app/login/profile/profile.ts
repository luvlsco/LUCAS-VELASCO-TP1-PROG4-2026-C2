import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase.client';
import { AuthService } from '../../services/auth.service';
import { Reward } from '../../candy/candy.model';

interface ProfileData {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  points: number | null;
  credit: number | null;
}

interface Redemption {
  id: number;
  reward_label: string;
  cost_points: number;
}

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
})
export class Profile {
  protected readonly auth = inject(AuthService);
  protected profile = signal<ProfileData | null>(null);
  protected rewards = signal<Reward[]>([]);
  protected redemptions = signal<Redemption[]>([]);
  protected error = signal<string | null>(null);

  constructor() {
    const userId = this.auth.session()?.user.id;
    if (!userId) return;
    void this.load(userId);
  }

  protected points(): number {
    return this.profile()?.points ?? 0;
  }

  protected async redeem(reward: Reward): Promise<void> {
    const userId = this.auth.session()?.user.id;
    if (!userId || this.points() < reward.cost_points) return;
    this.error.set(null);
    const { error: redemptionError } = await supabase.from('redemptions').insert({
      user_id: userId,
      reward_label: reward.label,
      cost_points: reward.cost_points,
    });
    if (redemptionError) {
      this.error.set(redemptionError.message);
      return;
    }
    const { error: pointsError } = await supabase
      .from('profiles')
      .update({ points: this.points() - reward.cost_points })
      .eq('id', userId);
    if (pointsError) this.error.set(pointsError.message);
    else await this.load(userId);
  }

  private async load(userId: string): Promise<void> {
    const [{ data: profile }, { data: rewards }, { data: redemptions }] = await Promise.all([
      supabase.from('profiles').select('email, first_name, last_name, points, credit').eq('id', userId).single(),
      supabase.from('rewards').select('id, label, cost_points').order('cost_points'),
      supabase
        .from('redemptions')
        .select('id, reward_label, cost_points')
        .eq('user_id', userId)
        .order('id', { ascending: false }),
    ]);
    this.profile.set((profile as ProfileData) ?? null);
    this.rewards.set((rewards as Reward[]) ?? []);
    this.redemptions.set((redemptions as Redemption[]) ?? []);
  }
}
