interface SDKConfig {
  /**
   * The opentelemetry collector entrypoint GRPC url.
   * If the collectoUrl is null or undefined, the instrumentation will not be activated.
   * @example http://alloy:4317
   */
  collectorUrl: string;
  /**
   * Name of your application used for the collector to group logs
   */
  serviceName?: string;
  /**
   * Diagnostic log level for the internal runtime instrumentation
   *
   * @type string
   * @default INFO
   */
  diagLogLevel?: SDKLogLevel;
  /**
   * Collector signals processing mode.
   * signle: makes an http/grpc request for each signal and it is immediately processed inside grafana
   * batch: sends multiple signals within a time window, optimized to reduce http/grpc calls in production
   *
   * @type string
   * @default batch
   */
  collectorMode?: SDKCollectorMode;
}

export interface NodeSDKConfig extends SDKConfig {
  /**
   * Flag to enable or disable the tracing for node:fs module
   *
   * @default false disabling `instrumentation-fs` because it bloating the traces
   */
  enableFS?: boolean;

  /**
   * http based connection protocol used to send signals.
   *
   * @default grpc
   */
  protocol?: SDKProtocol;
}

export type SDKCollectorMode = 'single' | 'batch';

export type SDKProtocol = 'grpc' | 'http';

export type SDKLogLevel =
  | 'NONE'
  | 'ERROR'
  | 'WARN'
  | 'INFO'
  | 'DEBUG'
  | 'VERBOSE'
  | 'ALL';
