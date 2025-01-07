import type { NodeSDK } from '@opentelemetry/sdk-node';
import { assert, describe, expect, test, vi } from 'vitest';

import { instrumentNode } from '../index.js';
import buildNodeInstrumentation from '../lib/instrumentation.node.js';

describe('validation config: should return without breaking the execution', () => {
  test('should call buildNodeInstrumentation without config and skip instrumentation', async () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(vi.fn());

    instrumentNode();

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'observability config not set. Skipping NodeJS OpenTelemetry instrumentation.',
    );
  });

  test('node instrumentation: url undefined', async () => {
    let sdk: NodeSDK | undefined = undefined;

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(vi.fn());
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());

    assert.doesNotThrow(() => {
      sdk = buildNodeInstrumentation({
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        collectorUrl: undefined!,
      });
    });

    assert.equal(sdk, undefined);

    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'collectorUrl not set. Skipping NodeJS OpenTelemetry instrumentation.',
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  test('node instrumentation: invalid url', () => {
    let sdk: NodeSDK | undefined = undefined;

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(vi.fn());
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());

    assert.doesNotThrow(() => {
      sdk = buildNodeInstrumentation({
        collectorUrl: 'notavalidURL',
      });
    });

    assert.equal(sdk, undefined);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'collectorUrl does not use a valid format. Skipping NodeJS OpenTelemetry instrumentation.',
    );
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
