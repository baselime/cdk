export type AlertProps = {
	description?: string;
	enabled: boolean;
	parameters: DeploymentAlertParameters;
	channels: { type: ChannelTypes; targets: string[] }[];
};

type ChannelTypes = "slack" | "webhook";

type DeploymentAlertParameters = {
	query: string;
	threshold: string;
	frequency: string;
	window: string;
};
