import { awscdk, DependencyType } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
import { WorkflowNoDockerPatch } from './projenrc/workflow-no-docker-patch';

const MAJOR_VERSION = 1;
const releaseWorkflowName = `release-awscli-v${MAJOR_VERSION}`;
const defaultReleaseBranchName = `awscli-v${MAJOR_VERSION}/main`;

const project = new awscdk.AwsCdkConstructLibrary({
  projenrcTs: true,
  author: 'Amazon Web Services, Inc.',
  authorAddress: 'aws-cdk-dev@amazon.com',
  cdkVersion: '2.0.0',
  name: `@aws-cdk/asset-awscli-v${MAJOR_VERSION}`,
  description: 'A library that contains the AWS CLI for use in Lambda Layers',
  repositoryUrl: 'https://github.com/cdklabs/awscdk-asset-awscli.git',
  homepage: 'https://github.com/cdklabs/awscdk-asset-awscli#readme',
  autoApproveOptions: {
    allowedUsernames: ['aws-cdk-automation', 'dependabot[bot]', 'mergify[bot]'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: [
        // support all awscli branches from the default branch
        'awscli-v1/main',
        'awscli-v2/main',
      ],
    },
  },
  majorVersion: 2,
  npmAccess: NpmAccess.PUBLIC,
  releaseTagPrefix: `awscli-v${MAJOR_VERSION}`,
  releaseWorkflowName: releaseWorkflowName,
  defaultReleaseBranch: defaultReleaseBranchName,
  publishToPypi: {
    distName: `aws-cdk.asset-awscli-v${MAJOR_VERSION}`,
    module: `aws_cdk.asset_awscli_v${MAJOR_VERSION}`,
  },
  publishToMaven: {
    javaPackage: `software.amazon.awscdk.cdk.asset.awscli.v${MAJOR_VERSION}`,
    mavenGroupId: 'software.amazon.awscdk',
    mavenArtifactId: `cdk-asset-awscli-v${MAJOR_VERSION}`,
    mavenEndpoint: 'https://aws.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: `Amazon.CDK.Asset.AwsCliV${MAJOR_VERSION}`,
    packageId: `Amazon.CDK.Asset.AwsCliV${MAJOR_VERSION}`,
  },
  publishToGo: {
    moduleName: 'github.com/cdklabs/awscdk-asset-awscli-go',
    packageName: `awscliv${MAJOR_VERSION}`,
    gitBranch: `awscli.${MAJOR_VERSION}`,
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
new WorkflowNoDockerPatch(project, { workflow: 'release', workflowName: 'release-awscli-v1' });

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
