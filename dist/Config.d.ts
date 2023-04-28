import { Construct } from "constructs";
interface BaselimeConfiguration {
    apiKey: string;
}
export declare namespace ConfigStore {
    let construct: Construct;
    let baselimeSecret: string;
    const serviceToken: string;
    function init(target: Construct, { apiKey }: BaselimeConfiguration): void;
}
export {};
