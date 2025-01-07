import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { NodeSDKConfig } from './index.js';
import type { Exporters } from './options.js';
import { LogRecordProcessorMap } from './utils.js';

export default function buildGrpcExporters(config: NodeSDKConfig): Exporters {
  return {
    traces: new OTLPTraceExporter({
      url: `${config.collectorUrl}`,
      compression: CompressionAlgorithm.GZIP,
    }),
    metrics: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${config.collectorUrl}`,
        compression: CompressionAlgorithm.GZIP,
      }),
    }),
    logs: [
      new LogRecordProcessorMap[config.collectorMode ?? 'batch'](
        new OTLPLogExporter({
          url: `${config.collectorUrl}`,
          compression: CompressionAlgorithm.GZIP,
        }),
      ),
    ],
  };
}
