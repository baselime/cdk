import { test, expect, describe } from 'vitest'
import { Capture, Match, Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import * as baselime from "../src/index";
import { gt } from '../src/utils/filter';


describe('stack id', () => {
    test('stackId is added by default', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');

        baselime.Baselime.init(stack, {
            apiKey: 'xxxx',
        });

        const query = new baselime.Query('abc', {
            parameters: {
                filters: [
                    gt('timestamp', 1234)
                ]
            }
        })
        const template = Template.fromStack(stack);
        template.hasResourceProperties("Custom::BaselimeQuery", {
            Parameters: {
                filters: [
                    {
                        "key": "timestamp",
                        "operation": ">",
                        "value": 1234
                    },
                    {
                        "key": "$baselime.stackId",
                        "operation": "=",
                        "value": "TestStack"
                    }
                ]
            }
        })
    });


    test('stackId is not added if parameter is set on init', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');

        baselime.Baselime.init(stack, {
            apiKey: 'xxxx',
            disableStackFilter: true,
        });

        const query = new baselime.Query('abc', {
            parameters: {
                filters: [
                    gt('timestamp', 1234)
                ]
            }
        })
        const template = Template.fromStack(stack);
        template.hasResourceProperties("Custom::BaselimeQuery", {
            Parameters: {
                filters: [
                    {
                        "key": "timestamp",
                        "operation": ">",
                        "value": 1234
                    }
                ]
            }
        })
    })

    test('stackId is not added if parameter is set on query', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'TestStack');

        baselime.Baselime.init(stack, {
            apiKey: 'xxxx',
        });

        const query = new baselime.Query('abc', {
            disableStackFilter: true,
            parameters: {
                filters: [
                    gt('timestamp', 1234)
                ]
            }
        })
        const template = Template.fromStack(stack);
        template.hasResourceProperties("Custom::BaselimeQuery", {
            Parameters: {
                filters: [
                    {
                        "key": "timestamp",
                        "operation": ">",
                        "value": 1234
                    }
                ]
            }
        })
    })
});
