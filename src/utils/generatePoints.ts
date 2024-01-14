export default function generatePoints(
  num: number,
  max_X: number,
  max_Y: number
) {
  if (num < 1) return [];

  const data: [number, number][] = [];
  for (let i = 0; i < num; i++) {
    const x = Math.round(Math.random() * max_X + 1);
    const y = Math.round(Math.random() * max_Y + 1);

    data.push([x, y]);
  }

  return data;
}
