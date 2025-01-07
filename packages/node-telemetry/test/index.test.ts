import { describe, expect, test, vi } from 'vitest';
import type { NodeSDKConfig } from '../index';
import { instrumentNode } from '../index';

vi.mock('../lib/instrumentation.node', () => ({
  default: vi.fn(),
}));

describe('instrumentNode', () => {
  test('should call buildNodeInstrumentation with the provided config', async () => {
    const config: NodeSDKConfig = {
      serviceName: 'custom-service',
      collectorUrl: 'http://custom-collector.com',
      protocol: 'grpc',
    };

    const buildNodeInstrumentation = await import(
      '../lib/instrumentation.node'
    );

    instrumentNode(config);

    expect(buildNodeInstrumentation.default).toHaveBeenCalledWith(config);
  });

  test('should not throw when called without arguments', () => {
    expect(() => instrumentNode()).not.toThrow();
  });
});
