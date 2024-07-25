#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { VpcStack } from './stacks/common/vpc';
import { BalpumEcsClusterStack } from './stacks/common/ecs-cluster';

import { ApiEcsStack } from './stacks/api/api-ecs';

const app = new cdk.App();

// 공통 스택
const vpcStack = new VpcStack(app, 'VpcStack');
const ecsClusterStack = new BalpumEcsClusterStack(app, 'BalpumEcsClusterStack', { vpc: vpcStack.vpc });

// API 서비스 스택
new ApiEcsStack(app, 'BalpumApiEcaStack', { vpc: vpcStack.vpc, cluster: ecsClusterStack.cluster });
