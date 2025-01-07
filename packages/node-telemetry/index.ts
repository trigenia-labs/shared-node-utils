import type { NodeSDK } from '@opentelemetry/sdk-node';
import type { NodeSDKConfig } from './lib/index.js';
import buildNodeInstrumentation from './lib/instrumentation.node.js';

export type * from './lib/index.js';
export type { NodeSDKConfig, NodeSDK };
export { buildNodeInstrumentation as instrumentNode };
