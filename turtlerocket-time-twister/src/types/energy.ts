export type TimeSlot = {
  hour: number;
  label: string;
};

export const ENERGY_HOURS: TimeSlot[] = Array.from({ length: 12 }, (_, i) => ({
  hour: 8 + i,
  label: `${8 + i}:00`,
}));
