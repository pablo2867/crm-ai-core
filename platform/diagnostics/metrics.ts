import { Metric } from "./types";

const metrics: Metric[] = [];

export function addMetric(metric: Metric) {
  metrics.push(metric);
}

export function getMetrics() {
  return metrics;
}

export function clearMetrics() {
  metrics.length = 0;
}