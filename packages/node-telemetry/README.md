# Observability NodeJS SDK

The NodeJS observability sdk is a npm package used to setup and implement opentelemetry instrumentation.

## Installation

pnpm

```bash
  pnpm i --save @ogcio/o11y-sdk-node
```

npm

```bash
  npm i @ogcio/o11y-sdk-node
```

## Usage

Setup using constructor function

```javascript
// instrumentation.ts

import("@ogcio/o11y-sdk-node/lib/index").then((sdk) =>
  sdk.instrumentNode({
    serviceName: "node-microservice",
    collectorUrl: "http://localhost:4317",
    collectorMode: "single",
    enableFS: true,
    diagLogLevel: "DEBUG",
  }),
);
```

Run your node script with instrumentation

`node --import instrumentation.js server.js`

Or setup inside your package.json

```json
{
 "main": "dist/index.js",
 "type": "module",
 "scripts": {
    "start": "node --env-file=.env --import ./dist/instrumentation.js dist/index.js",
  },
 ....
}
```

## API Reference

### Shared Types

```ts
export type SDKLogLevel =
  | "NONE"
  | "ERROR"
  | "WARN"
  | "INFO"
  | "DEBUG"
  | "VERBOSE"
  | "ALL";
```

### Config

| Parameter       | Type              | Description                                                                                              |
| :-------------- | :---------------- | :------------------------------------------------------------------------------------------------------- |
| `collectorUrl`  | `string`          | **Required**. The opentelemetry collector entrypoint url, if null, instrumentation will not be activated |
| `serviceName`   | `string`          | Name of your application used for the collector to group logs                                            |
| `diagLogLevel`  | `SDKLogLevel`     | Diagnostic log level for the internal runtime instrumentation                                            |
| `collectorMode` | `single \| batch` | Signals sending mode, default is batch for performance                                                   |
| `enableFS`      | `boolean`         | Flag to enable or disable the tracing for node:fs module                                                 |
