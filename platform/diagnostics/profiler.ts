import { addMetric } from "./metrics";

export async function profile<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {

  const start = performance.now();

  const result = await fn();

  const end = performance.now();

  addMetric({
    name,
    value: Number((end - start).toFixed(2)),
    unit: "ms",
    category: "performance",
  });

  return result;
}