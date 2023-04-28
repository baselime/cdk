"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const Config_1 = require("../Config");
const cdk = require("aws-cdk-lib/core");
class Alert extends aws_cdk_lib_1.CfnResource {
    constructor(id, props) {
        const stack = cdk.Stack.of(Config_1.ConfigStore.construct);
        super(Config_1.ConfigStore.construct, id, {
            type: "Custom::BaselimeAlert",
            properties: {
                serviceToken: Config_1.ConfigStore.serviceToken,
                BaselimeApiKey: Config_1.ConfigStore.baselimeSecret,
                Description: props.description,
                Service: stack.stackName,
                Parameters: props.parameters
            },
        });
    }
}
exports.Alert = Alert;
//# sourceMappingURL=Alert.js.map