#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { VpcStack } from './stacks/network/vpc';

const app = new cdk.App();

new VpcStack(app, 'VpcStack');