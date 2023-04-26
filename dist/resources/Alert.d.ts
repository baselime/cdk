import { CfnResource } from "aws-cdk-lib";
import { AlertProps } from "../types/Alert";
export declare class Alert extends CfnResource {
    constructor(id: string, props: AlertProps);
}
