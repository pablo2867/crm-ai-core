interface SkillMetric {

  executions: number;

  success: number;

  errors: number;

}

const metrics =
  new Map<string, SkillMetric>();

export function registerSkillSuccess(
  id: string
) {

  const metric =
    metrics.get(id) ?? {
      executions: 0,
      success: 0,
      errors: 0,
    };

  metric.executions++;
  metric.success++;

  metrics.set(id, metric);

}

export function registerSkillError(
  id: string
) {

  const metric =
    metrics.get(id) ?? {
      executions: 0,
      success: 0,
      errors: 0,
    };

  metric.executions++;
  metric.errors++;

  metrics.set(id, metric);

}

export function getSkillMetrics(
  id: string
) {

  return (
    metrics.get(id) ?? {
      executions: 0,
      success: 0,
      errors: 0,
    }
  );

}