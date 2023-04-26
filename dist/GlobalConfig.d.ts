import { Construct } from "constructs";
interface BaselimeConfiguration {
    baselimeApiKey: string;
}
export declare namespace ConfigStore {
    let construct: Construct;
    let baselimeSecret: string;
    const serviceToken: string;
    function init(target: Construct, { baselimeApiKey }: BaselimeConfiguration): void;
}
export {};
