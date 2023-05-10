import { Stack } from "aws-cdk-lib";
import { Baselime as Config } from "../config";

export function getServiceName(stack: Stack): string {
    if(Config.serviceName) {
      return Config.serviceName;
    }
    const tags = stack.tags.tagValues();

    const isSST = Object.keys(tags).some((el) => el.includes("sst"));
  
    if (isSST) {
      return `${tags['sst:stage']}-${tags['sst:app']}`;
    }

    return stack.stackName;
  }
  