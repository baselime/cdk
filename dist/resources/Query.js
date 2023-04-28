"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.stringifyFilter = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const Config_1 = require("../Config");
const cdk = require("aws-cdk-lib/core");
function buildCalculation(cal) {
    const short = buildShortCalculation(cal);
    return `${short}${cal.alias ? ` as ${cal.alias}` : ""}`;
}
function buildShortCalculation(cal) {
    if (cal.operation === "COUNT") {
        return cal.operation;
    }
    return `${cal.operation}(${cal.key})`;
}
function stringifyFilter(filter) {
    const { key, operation, value } = filter;
    if (["EXISTS", "DOES_NOT_EXIST"].includes(operation)) {
        return `${key} ${operation}`;
    }
    if (["IN", "NOT_IN"].some(o => o === operation)) {
        return `${key} ${operation} (${value})`;
    }
    return `${key} ${operation} ${value}`;
}
exports.stringifyFilter = stringifyFilter;
class Query extends aws_cdk_lib_1.CfnResource {
    constructor(id, props) {
        const stack = cdk.Stack.of(Config_1.ConfigStore.construct);
        const Parameters = Object.assign(Object.assign({}, props.parameters), { calculations: props.parameters.calculations ? props.parameters.calculations.map(buildCalculation) : [], filters: props.parameters.filters.map(stringifyFilter) });
        super(Config_1.ConfigStore.construct, id, {
            type: "Custom::BaselimeQuery",
            properties: {
                serviceToken: Config_1.ConfigStore.serviceToken,
                BaselimeApiKey: Config_1.ConfigStore.baselimeSecret,
                Description: props.description,
                Service: stack.stackName,
                Parameters,
            },
        });
    }
}
exports.Query = Query;
new Query('tttt', {
    parameters: {
        datasets: ['lambda-logs'],
        filters: [{
                key: 'blah', operation: '=', value: ''
            }],
        calculations: [{
                key: 'woop',
                alias: "aaa",
                operation: 'AVG'
            }, {
                operation: "COUNT"
            }],
        groupBy: {
            value: "woop",
            type: "string"
        }
    }
});
//# sourceMappingURL=Query.js.map