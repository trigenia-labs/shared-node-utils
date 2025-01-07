import type { MetricReader } from '@opentelemetry/sdk-metrics';
import type { logs, tracing } from '@opentelemetry/sdk-node';

export type Exporters = {
  traces: tracing.SpanExporter;
  metrics: MetricReader;
  logs: logs.LogRecordProcessor[];
};
