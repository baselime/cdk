# Baselime CDK

Baselime CDK
## Installation

```
npm i @baselime/cdk
```
## Usage

Get your baselime api key from the dashboard or run `baselime iam` 

```typescript
// Initialize ConfigStore, you must do this in a construct before adding querys, alerts and dashboards
baselime.ConfigStore.init(stack, {
  apiKey: 'xxxxxx',
});

// Create Query
const query = new baselime.Query('MyQuery', {
  description: 'This query is awesome',
  parameters: {
    datasets: ['lambda-logs'],
    calculations: ['COUNT as ErrorsHere'],
    filters: ['LogLevel = ERROR'],
  },
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
