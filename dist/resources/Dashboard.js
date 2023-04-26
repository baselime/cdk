"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const GlobalConfig_1 = require("../GlobalConfig");
const cdk = require("aws-cdk-lib/core");
class Dashboard extends aws_cdk_lib_1.CfnResource {
    constructor(id, props) {
        const stack = cdk.Stack.of(GlobalConfig_1.ConfigStore.construct);
        super(GlobalConfig_1.ConfigStore.construct, id, {
            type: "Custom::BaselimeDashboard",
            properties: {
                serviceToken: GlobalConfig_1.ConfigStore.serviceToken,
                BaselimeApiKey: GlobalConfig_1.ConfigStore.baselimeSecret,
                Description: props.description,
                Service: stack.stackName,
                Parameters: props.parameters
            },
        });
    }
}
exports.Dashboard = Dashboard;
//# sourceMappingURL=Dashboard.js.map