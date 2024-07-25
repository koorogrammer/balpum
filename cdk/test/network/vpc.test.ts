import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { VpcStack } from '../../stacks/common/vpc';

describe('Vpc Test', () => {
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new VpcStack(app, 'vpcStack');
    template = Template.fromStack(stack);
  });

  it('has Vpc resource', () => {
    template.hasResourceProperties('AWS::EC2::VPC', {});
  });
});
