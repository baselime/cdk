import { awscdk, DependencyType } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
import { WorkflowNoDockerPatch } from './projenrc/workflow-no-docker-patch';

// the version of proxy-agent that this branch supports
const SPEC_VERSION = '5';
const releaseWorkflowName = `release-node-proxy-agent-v${SPEC_VERSION}`;

const project = new awscdk.AwsCdkConstructLibrary({
  projenrcTs: true,
  author: 'Amazon Web Services',
  authorAddress: 'aws-cdk-dev@amazon.com',
  cdkVersion: '2.0.0',
  defaultReleaseBranch: 'main',
  name: `@aws-cdk/asset-node-proxy-agent-v${SPEC_VERSION}`,
  repositoryUrl: 'https://github.com/cdklabs/awscdk-asset-node-proxy-agent.git',
  homepage: 'https://github.com/cdklabs/awscdk-asset-node-proxy-agent#readme',
  autoApproveOptions: {
    allowedUsernames: ['aws-cdk-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  majorVersion: 2,
  npmAccess: NpmAccess.PUBLIC,
  releaseTagPrefix: `node-proxy-agent-v${SPEC_VERSION}`,
  releaseWorkflowName: releaseWorkflowName,
  publishToPypi: {
    distName: `aws-cdk.asset-node-proxy-agent-v${SPEC_VERSION}`,
    module: `aws_cdk.asset_node_proxy_agent_v${SPEC_VERSION}`,
  },
  publishToMaven: {
    javaPackage: `software.amazon.awscdk.cdk.asset.node.proxy.agent.v${SPEC_VERSION}`,
    mavenGroupId: 'software.amazon.awscdk',
    mavenArtifactId: `cdk-asset-node-proxy-agent-v${SPEC_VERSION}`,
    mavenEndpoint: 'https://aws.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: `Amazon.CDK.Asset.NodeProxyAgentV${SPEC_VERSION}`,
    packageId: `Amazon.CDK.Asset.NodeProxyAgentV${SPEC_VERSION}`,
  },
  publishToGo: {
    moduleName: 'github.com/cdklabs/awscdk-asset-node-proxy-agent-go',
    packageName: `nodeproxyagentv${SPEC_VERSION}`,
    gitUserName: 'AWS CDK Team',
    gitUserEmail: 'aws-cdk@amazon.com',
    githubTokenSecret: 'PROJEN_GITHUB_TOKEN',
  },
});

// We only need aws-cdk-lib and constructs for testing. Neither library is used
// in the public API.
project.deps.removeDependency('constructs', DependencyType.PEER);
project.deps.addDependency('constructs@^10.0.5', DependencyType.DEVENV);
project.deps.removeDependency('aws-cdk-lib', DependencyType.PEER);
project.deps.addDependency('aws-cdk-lib@^2.0.0', DependencyType.DEVENV);
project.deps.addDependency('@aws-cdk/integ-runner@^2.45.0', DependencyType.DEVENV);
project.deps.addDependency('@aws-cdk/integ-tests-alpha@^2.45.0-alpha.0', DependencyType.DEVENV);

// Fix Docker on GitHub
new WorkflowNoDockerPatch(project, { workflow: 'build' });
new WorkflowNoDockerPatch(project, { workflow: 'release', workflowName: 'release-node-proxy-agent-v5' });

project.preCompileTask.exec('layer/build.sh');

const integSnapshotTask = project.addTask('integ', {
  description: 'Run integration snapshot tests',
  exec: 'yarn integ-runner --language typescript',
});

project.addTask('integ:update', {
  description: 'Run and update integration snapshot tests',
  exec: 'yarn integ-runner --language typescript --update-on-failed',
  receiveArgs: true,
});

const rosettaTask = project.addTask('rosetta:extract', {
  description: 'Test rosetta extract',
  exec: 'yarn --silent jsii-rosetta extract',
});

project.testTask.spawn(integSnapshotTask);
project.postCompileTask.spawn(rosettaTask);
project.addGitIgnore('.jsii.tabl.json');
project.synth();
