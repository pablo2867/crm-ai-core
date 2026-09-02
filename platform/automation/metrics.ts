export interface AutomationMetrics {
  executed: number;
  success: number;
  errors: number;
  totalDuration: number;
}

const metrics: AutomationMetrics = {
  executed: 0,
  success: 0,
  errors: 0,
  totalDuration: 0,
};

export function registerSuccess(
  duration: number
) {
  metrics.executed++;
  metrics.success++;
  metrics.totalDuration += duration;
}

export function registerError(
  duration: number
) {
  metrics.executed++;
  metrics.errors++;
  metrics.totalDuration += duration;
}

export function getMetrics() {
  return {
    ...metrics,
    averageDuration:
      metrics.executed === 0
        ? 0
        : Math.round(
            metrics.totalDuration /
              metrics.executed
          ),
  };
}

export function resetMetrics() {
  metrics.executed = 0;
  metrics.success = 0;
  metrics.errors = 0;
  metrics.totalDuration = 0;
}