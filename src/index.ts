
export interface QueryProps {
	Description?: string;
	Parameters: {
		datasets: string[];
		calculations?: string[];
		filters?: string[];
		groupBys?: Array<{
			type: "string" | "number" | "boolean";
			value: string;
		}>;
		orderBy?: {
			value: string;
			order?: "ASC" | "DESC";
		};
		limit?: number;
		needle?: {
			value: string;
			isRegex?: boolean;
			matchCase?: boolean;
		}
	};
}

export * from "./resources/query";
export * from "./resources/alert";
export * from "./resources/dashboard";
export * from "./config";

export * as filter from "./utils/filter";
export * as threshold from './utils/threshold';
export * as calc from './utils/calc';