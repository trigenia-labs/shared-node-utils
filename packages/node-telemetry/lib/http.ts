import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { NodeSDKConfig } from './index.js';
import type { Exporters } from './options.js';
import { LogRecordProcessorMap } from './utils.js';

export default function buildHttpExporters(config: NodeSDKConfig): Exporters {
  if (config.collectorUrl.endsWith('/')) {
    config.collectorUrl = config.collectorUrl.slice(0, -1);
  }

  return {
    traces: new OTLPTraceExporter({
      url: `${config.collectorUrl}/v1/traces`,
      compression: CompressionAlgorithm.GZIP,
    }),
    metrics: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${config.collectorUrl}/v1/metrics`,
        compression: CompressionAlgorithm.GZIP,
      }),
    }),
    logs: [
      new LogRecordProcessorMap[config.collectorMode ?? 'batch'](
        new OTLPLogExporter({
          url: `${config.collectorUrl}/v1/logs`,
          compression: CompressionAlgorithm.GZIP,
        }),
      ),
    ],
  };
}
