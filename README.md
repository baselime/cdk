# Baselime CDK

Baselime CDK is the best way to instrument a CDK application. It lets you define complicated Baselime queries as part of a CDK stack with a few lines of Typescript that can be deployed and checked into git with your application. 


```typescript
baselime.ConfigStore.init(stack, {
  apiKey: 'xxxxxx',
});

const query = new baselime.Query('MyQuery', {
  description: 'This query is awesome',
  parameters: {
    datasets: ['lambda-logs'],
    filters: [{ key "data.count", operation: ">", value: 50 }],
  },
});

```
## Installation

```
npm i @baselime/cdk
```
## Usage

Get your baselime api key from the dashboard or run `baselime iam` 

```typescript
// Initialize ConfigStore, you must do this in a construct before adding querys, alerts and dashboards.
baselime.ConfigStore.init(stack, {
  apiKey: 'xxxxxx',
});

// Create Query
const query = new baselime.Query("my-super-duper-query", {
  description: "optional",
  parameters: {
    datasets: [
      "lambda-logs",
    ],
    calculations: [
      { operation: "MAX", key: "oeurhg", alias: "test" } // for COUNT, there's no key
    ],
    filters: [
      { key: "userId", operation: "INCLUDES", value: ["yo", "12"] },
      { key: "userId", operation: "EQUALS", value: "TEST" }, // the value depends on the operation
    ],
    groupBy: {
      type: "string",
      value: "test",
      limit: 10
      orderBy: "test",
      order: "DESC",
    },
    needle: {
      value: "yototo"
      isRegex: false,
      matchCase: false
    }
  }
});

// Create Alert
new baselime.Alert('MyAlert', {
  enabled: true,
  parameters: {
    frequency: '30mins',
    query: query.ref,
    threshold: '> 10',
    window: '1 hour',
  },
  channels: [{ targets: ['baselime-alerts'], type: 'slack' }],
});

// Create Dashboard
new baselime.Dashboard('MyDashboard', {
  parameters: {
    widgets: [
      {
        query: query.ref,
        view: 'events',
      },
    ],
  },
});
```
