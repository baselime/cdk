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
export * from "./resources/Query";
export * from "./resources/Alert";
export * from "./resources/Dashboard";
export * from "./Config";
