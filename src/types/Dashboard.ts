export type DashboardProps = {
	name?: string;
	description?: string;
	parameters: DeploymentDashboardParameters;
};

interface DeploymentDashboardParameters {
	widgets: Array<{
		name?: string;
		description?: string;
		query: string;
		view: WidgetView;
	}>;
}

type WidgetView = "calculations" | "events" | "traces";