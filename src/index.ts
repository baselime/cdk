
export interface QueryProps {
	Description?: string;
	Service?: string;
	Parameters: {
		datasets: string[];
		calculations: string[];
		filters: string[];
		groupBy: {
			value: string;
			type: string;
			orderBy: string;
			limit: number;
		};
	};
}

export * from "./resources/query";
export * from "./resources/alert";
export * from "./resources/dashboard";
export * from "./config";

export * as filter from "./utils/filter";
export * as threshold from './utils/threshold';
export * as calc from './utils/calc';