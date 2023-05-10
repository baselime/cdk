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
		view: WidgetView;
	}>;
}

type WidgetView = "calculations" | "events" | "traces";