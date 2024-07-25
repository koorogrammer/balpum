import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecrAsset from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancer, ApplicationTargetGroup, ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as path from 'path';

interface VpcStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    cluster: ecs.Cluster;
}

export class ApiEcsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: VpcStackProps) {
        super(scope, id, props);

        // Docker Image 등록
        const currentDir = __dirname;
        const image = new ecrAsset.DockerImageAsset(this, 'ApiImage', {
            directory: path.resolve(currentDir, '../../../api'),
        });

        // ECS Task Definition
        const taskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
            memoryLimitMiB: 512,
            cpu: 256,
        });
        const containerImage = ecs.ContainerImage.fromDockerImageAsset(image);
        const container = taskDefinition.addContainer('ApiContainer', {
            image: containerImage,
        });
        container.addPortMappings({
            containerPort: 80,
            protocol: ecs.Protocol.TCP,
        });

        // ECS Service 생성
        const service = new ecs.FargateService(this, 'ApiService', {
            cluster: props.cluster,
            taskDefinition: taskDefinition,
            desiredCount: 1,
            assignPublicIp: false,
            vpcSubnets: {
                subnets: props.vpc.privateSubnets,
            },
        });

        // ALB 생성
        const lb = new ApplicationLoadBalancer(this, 'ApiLB', {
            vpc: props.vpc,
            internetFacing: true,
        });
        const targetGroup = new ApplicationTargetGroup(this, 'ApiTargetGroup', {
            vpc: props.vpc,
            port: 8000,
            protocol: ApplicationProtocol.HTTP,
            targets: [service],
            healthCheck: {
                path: "/",
            }
        });
        lb.addListener('Listener', {
            port: 80,
            open: true,
            defaultTargetGroups: [targetGroup]
        });

        // Serverless를 위한 Auto Scaling 
        const scalableTarget = service.autoScaleTaskCount({
            minCapacity: 0,
            maxCapacity: 2,
        });
        scalableTarget.scaleOnRequestCount('RequestScaling', {
            requestsPerTarget: 1000,
            targetGroup: targetGroup,
            scaleOutCooldown: cdk.Duration.seconds(60),
        });
    }
}
