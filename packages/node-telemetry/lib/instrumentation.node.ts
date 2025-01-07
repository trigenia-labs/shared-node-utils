import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { NodeSDK } from '@opentelemetry/sdk-node';
import isUrl from 'is-url';
import buildGrpcExporters from './grpc.js';
import buildHttpExporters from './http.js';
import type { NodeSDKConfig } from './index.js';
import type { Exporters } from './options.js';

export default function buildNodeInstrumentation(
  config?: NodeSDKConfig,
): NodeSDK | undefined {
  if (!config) {
    console.warn(
      'observability config not set. Skipping NodeJS OpenTelemetry instrumentation.',
    );
    return;
  }

  if (!config.collectorUrl) {
    console.warn(
      'collectorUrl not set. Skipping NodeJS OpenTelemetry instrumentation.',
    );
    return;
  }

  if (!isUrl(config.collectorUrl)) {
    console.error(
      'collectorUrl does not use a valid format. Skipping NodeJS OpenTelemetry instrumentation.',
    );
    return;
  }

  let exporter: Exporters;

  if (config.protocol === 'http') {
    exporter = buildHttpExporters(config);
  } else {
    exporter = buildGrpcExporters(config);
  }

  try {
    diag.setLogger(
      new DiagConsoleLogger(),
      config.diagLogLevel
        ? DiagLogLevel[config.diagLogLevel]
        : DiagLogLevel.INFO,
    );

    const sdk = new NodeSDK({
      serviceName: config.serviceName,
      traceExporter: exporter.traces,
      metricReader: exporter.metrics,
      logRecordProcessors: exporter.logs,
      textMapPropagator: new W3CTraceContextPropagator(),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': {
            enabled: config.enableFS ?? false,
          },
        }),
      ],
    });

    sdk.start();
    console.log('NodeJS OpenTelemetry instrumentation started successfully.');
    return sdk;
  } catch (error) {
    console.error(
      'Error starting NodeJS OpenTelemetry instrumentation:',
      error,
    );
  }
}
