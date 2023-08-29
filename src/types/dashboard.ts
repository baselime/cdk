import { CfnResource } from "aws-cdk-lib";

export type DashboardProps = {
	description?: string;
	parameters: DeploymentDashboardParameters;
};

interface DeploymentDashboardParameters {
	widgets: Array<{
		name?: string;
		description?: string;
		query: CfnResource;
		type: WidgetType;
	}>;
}

export enum WidgetType {
  TIMESERIES = "timeseries",
  STATISTIC = "statistic",
  TABLE = "table",
  TIMESERIES_BAR = "timeseries_bar",
}
