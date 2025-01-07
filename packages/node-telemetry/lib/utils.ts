import { logs } from '@opentelemetry/sdk-node';
import type { SDKCollectorMode } from './index.js';

export const LogRecordProcessorMap: Record<
  SDKCollectorMode,
  typeof logs.SimpleLogRecordProcessor | typeof logs.BatchLogRecordProcessor
> = {
  single: logs.SimpleLogRecordProcessor,
  batch: logs.BatchLogRecordProcessor,
};
