import { OTLPLogExporter as GRPC_OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { OTLPMetricExporter as GRPC_OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter as GRPC_OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { type NodeSDK, logs } from '@opentelemetry/sdk-node';
import { assert, describe, expect, test } from 'vitest';
import buildNodeInstrumentation from '../lib/instrumentation.node.js';

import { OTLPLogExporter as HTTP_OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter as HTTP_OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter as HTTP_OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import buildHttpExporters from '../lib/http.js';
import type { NodeSDKConfig } from '../lib/index.js';

describe('verify config settings', () => {
  const commonConfig = {
    collectorUrl: 'https://testurl.com',
    serviceName: 'test',
  };

  test('grpc config', () => {
    const config: NodeSDKConfig = {
      ...commonConfig,
      protocol: 'grpc',
      diagLogLevel: 'NONE',
    };

    const sdk: NodeSDK | undefined = buildNodeInstrumentation(config);

    assert.ok(sdk);

    if (!sdk) {
      throw new Error('SDK initialization failed');
    }
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const _configuration = sdk['_configuration'];
    assert.equal(_configuration.serviceName, commonConfig.serviceName);

    const traceExporter = _configuration.traceExporter;
    assert.equal(
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      traceExporter['_transport']['_parameters']['compression'],
      'gzip',
    );
    assert.ok(traceExporter instanceof GRPC_OTLPTraceExporter);

    const logRecordProcessors = _configuration.logRecordProcessors;
    assert.equal(logRecordProcessors.length, 1);
    // assert default signals sending mode
    assert.ok(logRecordProcessors[0] instanceof logs.BatchLogRecordProcessor);
    assert.ok(
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      logRecordProcessors[0]['_exporter'] instanceof GRPC_OTLPLogExporter,
    );

    const metricReader = _configuration.metricReader;
    assert.ok(metricReader._exporter instanceof GRPC_OTLPMetricExporter);
  });

  test('http config', () => {
    const config: NodeSDKConfig = {
      ...commonConfig,
      protocol: 'http',
      diagLogLevel: 'NONE',
    };

    const sdk: NodeSDK | undefined = buildNodeInstrumentation(config);
    assert.ok(sdk);

    if (!sdk) {
      throw new Error('SDK initialization failed');
    }
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const _configuration = sdk['_configuration'];
    assert.equal(_configuration.serviceName, commonConfig.serviceName);

    const traceExporter = _configuration.traceExporter;
    assert.equal(
      traceExporter._transport._transport._parameters.compression,
      'gzip',
    );
    assert.ok(traceExporter instanceof HTTP_OTLPTraceExporter);

    const logRecordProcessors = _configuration.logRecordProcessors;
    assert.equal(logRecordProcessors.length, 1);
    // assert default signals sending mode
    assert.ok(logRecordProcessors[0] instanceof logs.BatchLogRecordProcessor);
    assert.ok(
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      logRecordProcessors[0]['_exporter'] instanceof HTTP_OTLPLogExporter,
    );

    const metricReader = _configuration.metricReader;
    assert.ok(metricReader._exporter instanceof HTTP_OTLPMetricExporter);
  });

  test('single log sending config', () => {
    const config: NodeSDKConfig = {
      ...commonConfig,
      protocol: 'grpc',
      diagLogLevel: 'NONE',
      collectorMode: 'single',
    };

    const sdk: NodeSDK | undefined = buildNodeInstrumentation(config);

    assert.ok(sdk);

    if (!sdk) {
      throw new Error('SDK initialization failed');
    }
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const _configuration = sdk['_configuration'];

    const logRecordProcessors = _configuration.logRecordProcessors;
    assert.equal(logRecordProcessors.length, 1);
    assert.ok(logRecordProcessors[0] instanceof logs.SimpleLogRecordProcessor);
  });

  test('check if clear base endpoint final slash', () => {
    const config: NodeSDKConfig = {
      collectorUrl: 'http://example.com/',
    };

    buildHttpExporters(config);

    expect(config.collectorUrl).toBe('http://example.com');
  });
});
