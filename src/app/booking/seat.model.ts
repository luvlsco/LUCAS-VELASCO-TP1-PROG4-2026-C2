export type SeatKind = 'standard' | 'accessible' | 'vip';

export interface Seat {
  row: string;
  number: number;
  block: 0 | 1 | 2;
  kind: SeatKind;
}

const ROWS = 'ABCDEFGHIJKLMNOPQRST'.split('');
const ACCESSIBLE_ROWS = ['J', 'K'];
const VIP_ROWS = ['R', 'S', 'T'];
const STANDARD_BLOCKS = [4, 20, 4];
const ACCESSIBLE_BLOCKS = [2, 10, 2];

export const VIP_MULTIPLIER = 1.5;

export function buildRoomSeats(): Seat[] {
  const seats: Seat[] = [];
  for (const row of ROWS) {
    const kind: SeatKind = ACCESSIBLE_ROWS.includes(row)
      ? 'accessible'
      : VIP_ROWS.includes(row)
        ? 'vip'
        : 'standard';
    const blocks = kind === 'accessible' ? ACCESSIBLE_BLOCKS : STANDARD_BLOCKS;
    let number = 0;
    blocks.forEach((count, block) => {
      for (let i = 0; i < count; i++) {
        number++;
        seats.push({ row, number, block: block as 0 | 1 | 2, kind });
      }
    });
  }
  return seats;
}

export function seatId(seat: Pick<Seat, 'row' | 'number'>): string {
  return `${seat.row}${seat.number}`;
}

export function seatPrice(seat: Seat, basePrice: number): number {
  return seat.kind === 'vip' ? Math.round(basePrice * VIP_MULTIPLIER) : basePrice;
}
