export function round(value: number): number {
  if (value === 0) return 0;
  const digits = 2;
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, digits - 1 - exponent);
  return Math.round(value * factor) / factor;
}
