import { CfnResource } from "aws-cdk-lib";
import { QueryProps, Filter } from "../types/Query";
export declare function stringifyFilter(filter: Filter): string;
export declare class Query<TKey extends string> extends CfnResource {
    constructor(id: string, props: QueryProps<TKey>);
}
