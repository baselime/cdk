import { Stack } from "aws-cdk-lib";


export function getServiceName(stack: Stack): string {
    const tags = stack.tags.tagValues();

    const isSST = Object.keys(tags).some((el) => el.includes("sst"));
  
    if (isSST) {
      return `${tags['sst:stage']}-${tags['sst:app']}`;
    }
    return stack.stackName;
  }
  