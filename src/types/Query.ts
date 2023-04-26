export type QueryProps = {
	description?: string;
	parameters: QueryParameters;
};

type QueryParameters = {
	datasets: string[];
	calculations?: string[];
	filterCombination?: "AND" | "OR";
	filters?: string[];
	groupBy?: {
		type: "string" | "number" | "boolean";
		value: string;
		orderBy?: string;
		limit?: number;
		order?: "ASC" | "DESC";
	};
	needle?: {
		value: string;
		isRegex?: boolean;
		matchCase?: boolean;
	};
}
