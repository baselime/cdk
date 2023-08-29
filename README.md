# Baselime CDK
[![Documentation][docs_badge]][docs]
[![Latest Release][release_badge]][release]
[![License][license_badge]][license]

Baselime CDK offers the most effective approach to adding observability to a serverless CDK application.


```typescript
baselime.Config.init(stack, {
  apiKey: 'xxxxxx',
});

new Alert("service-errors", {
  parameters: {
    query: {
      filters: [
        filter.inArray("LogLevel", ["ERROR", "WARN"]),
      ],
    },
    channels: [{ type: "slack", targets: ["baselime-alerts"] }]
  },
});
```

## Installation

```
npm i @baselime/cdk
```
## Usage

Get your baselime api key from the [Baselime console](https://console.baselime.io) or using the [Baselime CLI](https://baselime.io/docs/cli/install) with the command `baselime iam`. 

```typescript
// Initialize Config, you must do this in a construct before adding querys, alerts and dashboards.
baselime.Config.init(stack, {
  apiKey: 'xxxxxx',
});

// Create Query
const query = new baselime.Query("ColdStarts", {
  description: "optional",
  parameters: {
    datasets: [
      "lambda-logs",
    ],
    calculations: [
      max("@initDuration"),
      p90("@initDuration"),
      min("@initDuration"),
    ],
    filters: [
      eq("@type", "REPORT"),
    ],
  }
});

// Add an alert
query.addAlert({
  enabled: true,
  parameters: {
    frequency: '30mins',
    threshold: gt(500),
    window: '1 hour',
  },
  channels: [{ targets: ['baselime-alerts'], type: 'slack' }],
});

// Create Dashboard
new baselime.Dashboard('ServiceHealth', {
  parameters: {
    widgets: [{ query, type: WidgetType.TIMESERIES}],
  },
});
```

## License

&copy; Baselime Limited, 2023

Distributed under MIT License (`The MIT License`).

See [LICENSE](LICENSE) for more information.

<!-- Badges -->

[docs]: https://baselime.io/docs/
[docs_badge]: https://img.shields.io/badge/docs-reference-blue.svg?style=flat-square
[release]: https://github.com/baselime/cdk/releases/latest
[release_badge]: https://img.shields.io/github/release/baselime/cdk.svg?style=flat-square&ghcache=unused
[license]: https://opensource.org/licenses/MIT
[license_badge]: https://img.shields.io/github/license/baselime/cdk.svg?color=blue&style=flat-square&ghcache=unused

