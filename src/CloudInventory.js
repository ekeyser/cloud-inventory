/**
 * @author ekeyser
 */
'use strict';


let CloudInventory = () => {

    const axios = require('axios');
    const POLL_INTERVAL = 2000;
    let MAX_WAIT = 5000;
    let objGlobal = {};
    let bStopPoller = null;


    const {
        ACMClient,
        ListCertificatesCommand,
        DescribeCertificateCommand,
    } = require('@aws-sdk/client-acm');
    const {
        ElasticLoadBalancingV2Client,
        DescribeLoadBalancersCommand,
        DescribeLoadBalancerAttributesCommand,
    } = require('@aws-sdk/client-elastic-load-balancing-v2');

    const {
        LambdaClient,
        ListFunctionsCommand,
    } = require('@aws-sdk/client-lambda');

    const {
        CloudFrontClient,
        ListDistributionsCommand,
        ListCachePoliciesCommand,
    } = require('@aws-sdk/client-cloudfront');

    const {
        IAMClient,
        ListPoliciesCommand,
        ListRolesCommand,
    } = require('@aws-sdk/client-iam');

    const {
        ElastiCacheClient,
        DescribeCacheClustersCommand
    } = require('@aws-sdk/client-elasticache');

    const {
        AutoScalingClient,
        DescribeLaunchConfigurationsCommand,
        DescribeAutoScalingGroupsCommand,
    } = require('@aws-sdk/client-auto-scaling');

    const {
        Route53Client,
        ListHostedZonesCommand
    } = require('@aws-sdk/client-route-53');

    const {
        DynamoDBClient,
        DescribeTableCommand,
        ListTablesCommand
    } = require('@aws-sdk/client-dynamodb');

    const {
        CloudWatchClient,
        DescribeAlarmsCommand,
    } = require('@aws-sdk/client-cloudwatch');

    const {
        ECSClient,
        DescribeClustersCommand,
        ListServicesCommand,
        ListClustersCommand,
        DescribeServicesCommand,
        ListTaskDefinitionsCommand,
        DescribeTaskDefinitionCommand,
    } = require('@aws-sdk/client-ecs');

    const {
        ECRClient,
        DescribeRepositoriesCommand,
    } = require('@aws-sdk/client-ecr');

    const {
        RDSClient,
        DescribeDBInstancesCommand,
        DescribeDBSubnetGroupsCommand,
        DescribeDBParameterGroupsCommand,
        DescribeOptionGroupsCommand,
        DescribeDBClustersCommand,
    } = require('@aws-sdk/client-rds');

    const {
        S3Client,
        ListBucketsCommand
    } = require('@aws-sdk/client-s3');

    const {
        APIGatewayClient,
        GetRestApisCommand,
        GetRestApiCommand,
        GetMethodCommand,
        GetUsagePlansCommand,
        GetResourcesCommand,
    } = require('@aws-sdk/client-api-gateway');

    const {
        EC2Client,
        DescribeInstancesCommand,
        DescribeVpcsCommand,
        DescribeSubnetsCommand,
        DescribeRouteTablesCommand,
        DescribeVolumesCommand,
        DescribeSecurityGroupsCommand
    } = require('@aws-sdk/client-ec2');

    const run = (region, services, credentials) => {
        return new Promise((resolve) => {

            const agwclient = new APIGatewayClient(
                {
                    region,
                    credentials,
                }
            );

            const acmclient = new ACMClient(
                {
                    region,
                    credentials,
                }
            );

            const elbv2client = new ElasticLoadBalancingV2Client(
                {
                    region,
                    credentials,
                }
            );

            const s3client = new S3Client(
                {
                    region,
                    credentials
                }
            );

            const lambdaclient = new LambdaClient(
                {
                    region,
                    credentials
                }
            );

            const cfclient = new CloudFrontClient(
                {
                    region,
                    credentials
                }
            );

            const iamclient = new IAMClient(
                {
                    region,
                    credentials
                }
            );

            const asgclient = new AutoScalingClient(
                {
                    region,
                    credentials
                }
            );

            const elcclient = new ElastiCacheClient(
                {
                    region,
                    credentials
                }
            );

            const r53client = new Route53Client(
                {
                    region,
                    credentials
                }
            );

            const ec2client = new EC2Client(
                {
                    region,
                    credentials
                }
            );

            const rdsclient = new RDSClient(
                {
                    region,
                    credentials
                }
            );

            const ddbclient = new DynamoDBClient(
                {
                    region,
                    credentials
                }
            );

            const cwclient = new CloudWatchClient(
                {
                    region,
                    credentials
                }
            );

            const ecrclient = new ECRClient(
                {
                    region,
                    credentials
                }
            );

            const ecsclient = new ECSClient(
                {
                    region,
                    credentials
                }
            );


            /*
            ONLY US-EAST-1
             */
            let rCfLCP = () => {
                return new Promise((resolve, reject) => {

                    cfclient.send(new ListCachePoliciesCommand({}))
                        .then((data) => {
                            data.CachePolicyList.Items.forEach((cachePolicy) => {

                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].CachePolicies === undefined) {
                                    objGlobal[region].CachePolicies = [];
                                }

                                objGlobal[region].CachePolicies.push(cachePolicy);
                            });
                            resolve(`rCfLCP`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rCfLD = () => {
                return new Promise((resolve, reject) => {

                        cfclient.send(new ListDistributionsCommand({}))
                            .then((data) => {
                                data.DistributionList.Items.forEach((distribution) => {
                                    if (objGlobal[region] === undefined) {
                                        objGlobal[region] = {};
                                    }

                                    if (objGlobal[region].Distributions === undefined) {
                                        objGlobal[region].Distributions = [];
                                    }

                                    objGlobal[region].Distributions.push(distribution);
                                });
                                resolve(`rCfLD`);
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    }
                );
            };


            let rIamLP = () => {
                return new Promise((resolve, reject) => {

                    iamclient.send(new ListPoliciesCommand({}))
                        .then((data) => {
                            data.Policies.forEach((policy) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Policies === undefined) {
                                    objGlobal[region].Policies = [];
                                }

                                objGlobal[region].Policies.push(policy);
                            });
                            resolve(`rIamLP`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rIamLR = () => {
                return new Promise((resolve, reject) => {

                    iamclient.send(new ListRolesCommand({}))
                        .then((data) => {
                            data.Roles.forEach((role) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Roles === undefined) {
                                    objGlobal[region].Roles = [];
                                }

                                objGlobal[region].Roles.push(role);
                            });
                            resolve(`rIamLR`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rR53LHZ = () => {
                return new Promise((resolve, reject) => {

                    r53client.send(new ListHostedZonesCommand({}))
                        .then((data) => {
                            data.HostedZones.forEach((hostedZone) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].HostedZones === undefined) {
                                    objGlobal[region].HostedZones = [];
                                }

                                objGlobal[region].HostedZones.push(hostedZone);
                            });
                            resolve(`rR53LHZ`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            /*
            ALL REGIONS
             */
            let rLamLF = () => {
                return new Promise((resolve, reject) => {

                    lambdaclient.send(new ListFunctionsCommand({}))
                        .then((data) => {
                            data.Functions.forEach((lambdaFunction) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Functions === undefined) {
                                    objGlobal[region].Functions = [];
                                }

                                objGlobal[region].Functions.push(lambdaFunction);
                            });
                            resolve(`rLamLF`);
                        })
                        .catch((e) => {
                            reject(e);
                        });

                });
            };


            let rElcDCC = () => {
                return new Promise((resolve, reject) => {

                    elcclient.send(new DescribeCacheClustersCommand({}))
                        .then((data) => {
                            data.CacheClusters.forEach((cacheCluster) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].CacheClusters === undefined) {
                                    objGlobal[region].CacheClusters = [];
                                }

                                objGlobal[region].CacheClusters.push(cacheCluster);
                            });
                            resolve(`rElcDCC`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rAsgDASG = () => {
                return new Promise((resolve, reject) => {

                    asgclient.send(new DescribeAutoScalingGroupsCommand({}))
                        .then((data) => {
                            data.AutoScalingGroups.forEach((asg) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].AutoScalingGroups === undefined) {
                                    objGlobal[region].AutoScalingGroups = [];
                                }

                                objGlobal[region].AutoScalingGroups.push(asg);
                            });
                            resolve(`rAsgDASG`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rAsgDLC = () => {
                return new Promise((resolve, reject) => {

                    asgclient.send(new DescribeLaunchConfigurationsCommand({}))
                        .then((data) => {
                            data.LaunchConfigurations.forEach((launchConfiguration) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].LaunchConfigurations === undefined) {
                                    objGlobal[region].LaunchConfigurations = [];
                                }

                                objGlobal[region].LaunchConfigurations.push(launchConfiguration);
                            });
                            resolve(`rAsgDLC`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rDdbDT = (TableName) => {
                return new Promise((resolve, reject) => {

                    ddbclient.send(new DescribeTableCommand(
                        {
                            TableName
                        }
                    ))
                        .then((data) => {
                            resolve(data.Table);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rDdbLT = () => {
                return new Promise((resolve, reject) => {

                    ddbclient.send(new ListTablesCommand({}))
                        .then((data) => {

                            let arrP = [];
                            data.TableNames.forEach((TableName) => {
                                arrP.push(rDdbDT(TableName)
                                    .then((Table) => {
                                        return new Promise((resolve) => {

                                            if (objGlobal[region] === undefined) {
                                                objGlobal[region] = {};
                                            }

                                            if (objGlobal[region].Tables === undefined) {
                                                objGlobal[region].Tables = [];
                                            }

                                            objGlobal[region].Tables.push(Table);
                                            resolve(`Table described for ${TableName}`);
                                        });
                                    }));
                            });
                            Promise.all(arrP)
                                .then(() => {
                                    resolve(`rDdbLT`);
                                });
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rRdsDSG = () => {
                return new Promise((resolve, reject) => {

                    rdsclient.send(new DescribeDBSubnetGroupsCommand({}))
                        .then((data) => {
                            data.DBSubnetGroups.forEach((subnetGroup) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].SubnetGroups === undefined) {
                                    objGlobal[region].SubnetGroups = [];
                                }

                                objGlobal[region].SubnetGroups.push(subnetGroup);
                            });
                            resolve(`rRdsDSG`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rRdsDPG = () => {
                return new Promise((resolve, reject) => {

                    rdsclient.send(new DescribeDBParameterGroupsCommand({}))
                        .then((data) => {
                            data.DBParameterGroups.forEach((paramGroup) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].ParameterGroups === undefined) {
                                    objGlobal[region].ParameterGroups = [];
                                }

                                objGlobal[region].ParameterGroups.push(paramGroup);
                            });
                            resolve(`rRdsDPG`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rRdsDOG = () => {
                return new Promise((resolve, reject) => {

                    rdsclient.send(new DescribeOptionGroupsCommand({}))
                        .then((data) => {
                            data.OptionGroupsList.forEach((optionGroup) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].OptionGroups === undefined) {
                                    objGlobal[region].OptionGroups = [];
                                }

                                objGlobal[region].OptionGroups.push(optionGroup);
                            });
                            resolve(`rRdsDOG`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rRdsDC = () => {
                return new Promise((resolve, reject) => {

                    rdsclient.send(new DescribeDBClustersCommand({}))
                        .then((data) => {
                            data.DBClusters.forEach((cluster) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].DBClusters === undefined) {
                                    objGlobal[region].DBClusters = [];
                                }

                                objGlobal[region].DBClusters.push(cluster);
                            });
                            resolve(`rRdsDC`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rRdsDI = () => {
                return new Promise((resolve, reject) => {

                    rdsclient.send(new DescribeDBInstancesCommand({}))
                        .then((data) => {
                            data.DBInstances.forEach((dbInstance) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].DBInstances === undefined) {
                                    objGlobal[region].DBInstances = [];
                                }

                                objGlobal[region].DBInstances.push(dbInstance);
                            });
                            resolve(`rRdsDI`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsDS = (cluster, services) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new DescribeServicesCommand({
                        cluster,
                        services
                    }))
                        .then((data) => {
                            data.services.forEach((service) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].ECSServices === undefined) {
                                    objGlobal[region].ECSServices = [];
                                }

                                objGlobal[region].ECSServices.push(service);
                            });
                            resolve(`rEcsDS`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsLS = (cluster) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new ListServicesCommand({
                        cluster: cluster.clusterArn,
                    }))
                        .then((data) => {
                            if (data.serviceArns.length > 0) {
                                rEcsDS(cluster.clusterArn, data.serviceArns)
                                    .then(() => {
                                        resolve(`rEcsLS`);
                                    });
                            } else {
                                resolve(`rEcsLS`);
                            }
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsDC = (clusters) => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new DescribeClustersCommand({
                        clusters
                    }))
                        .then((data) => {
                            data.clusters.forEach((cluster) => {
                                rEcsLS(cluster);
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].ECSClusters === undefined) {
                                    objGlobal[region].ECSClusters = [];
                                }

                                objGlobal[region].ECSClusters.push(cluster);
                            });
                            resolve(`rEcsDC`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsLC = () => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new ListClustersCommand({}))
                        .then((data) => {
                            if (data.clusterArns.length > 0) {
                                rEcsDC(data.clusterArns)
                                    .then(() => {
                                        resolve(`rEcsLC`);
                                    });
                            } else {
                                resolve(`rEcsLC`);
                            }
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcrDR = () => {
                return new Promise((resolve, reject) => {

                    ecrclient.send(new DescribeRepositoriesCommand({}))
                        .then((data) => {
                            data.repositories.forEach((repo) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].ECRRepositories === undefined) {
                                    objGlobal[region].ECRRepositories = [];
                                }

                                objGlobal[region].ECRRepositories.push(repo);
                            });
                            resolve(`rEcrDR`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rCwDA = () => {
                return new Promise((resolve, reject) => {

                    cwclient.send(new DescribeAlarmsCommand({}))
                        .then((data) => {
                            data.MetricAlarms.forEach((alarm) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].MetricAlarms === undefined) {
                                    objGlobal[region].MetricAlarms = [];
                                }

                                objGlobal[region].MetricAlarms.push(alarm);
                            });
                            resolve(`rCwDA`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DRT = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeRouteTablesCommand({}))
                        .then((data) => {
                            data.RouteTables.forEach((routeTable) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].RouteTables === undefined) {
                                    objGlobal[region].RouteTables = [];
                                }

                                objGlobal[region].RouteTables.push(routeTable);
                            });
                            resolve(`rEc2DRT`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DVo = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeVolumesCommand({}))
                        .then((data) => {
                            data.Volumes.forEach((volume) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Volumes === undefined) {
                                    objGlobal[region].Volumes = [];
                                }

                                objGlobal[region].Volumes.push(volume);
                            });
                            resolve(`rEc2DVo`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DV = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeVpcsCommand({}))
                        .then((data) => {
                            data.Vpcs.forEach((vpc) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Vpcs === undefined) {
                                    objGlobal[region].Vpcs = [];
                                }

                                objGlobal[region].Vpcs.push(vpc);
                            });
                            resolve(`rEc2DV`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DS = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeSubnetsCommand({}))
                        .then((data) => {
                            data.Subnets.forEach((subnet) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Subnets === undefined) {
                                    objGlobal[region].Subnets = [];
                                }

                                objGlobal[region].Subnets.push(subnet);
                            });
                            resolve(`rEc2DS`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DI = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeInstancesCommand({}))
                        .then((data) => {
                            data.Reservations.forEach((reservation) => {
                                reservation.Instances.forEach((instance) => {
                                    if (objGlobal[region] === undefined) {
                                        objGlobal[region] = {};
                                    }

                                    if (objGlobal[region].Ec2Instances === undefined) {
                                        objGlobal[region].Ec2Instances = [];
                                    }

                                    objGlobal[region].Ec2Instances.push(instance);
                                });
                            });
                            resolve(`rEc2DI`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEcsDTD = (taskDefinitionArn) => {
                return new Promise((resolve, reject) => {

                    console.log(taskDefinitionArn);
                    ecsclient.send(new DescribeTaskDefinitionCommand(
                        {
                            taskDefinition: taskDefinitionArn,
                        }
                    ))
                        .then((data) => {
                            console.log(data);
                            resolve(data.taskDefinition);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rEcsLTD = () => {
                return new Promise((resolve, reject) => {

                    ecsclient.send(new ListTaskDefinitionsCommand({}))
                        .then((data) => {
                            console.log(data);
                            let arrP = [];
                            data.taskDefinitionArns.forEach((taskDefArn) => {
                                arrP.push(rEcsDTD(taskDefArn)
                                    .then((taskDefinition) => {
                                        return new Promise((resolve, reject) => {

                                            if (objGlobal[region] === undefined) {
                                                objGlobal[region] = {};
                                            }

                                            if (objGlobal[region].TaskDefinitions === undefined) {
                                                objGlobal[region].TaskDefinitions = [];
                                            }

                                            objGlobal[region].TaskDefinitions.push(taskDefinition);
                                            resolve(`taskDefinition described.`);
                                        });
                                    }));
                            });
                            Promise.all(arrP)
                                .then(() => {
                                    resolve(`rEc2DSG`);
                                });
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rEc2DSG = () => {
                return new Promise((resolve, reject) => {

                    ec2client.send(new DescribeSecurityGroupsCommand({}))
                        .then((data) => {
                            data.SecurityGroups.forEach((securityGroup) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].SecurityGroups === undefined) {
                                    objGlobal[region].SecurityGroups = [];
                                }

                                objGlobal[region].SecurityGroups.push(securityGroup);
                            });
                            resolve(`rEc2DSG`);
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rAgwGM = (httpMethod, resourceId, restApiId) => {
                return new Promise((resolve, reject) => {

                    agwclient.send(new GetMethodCommand(
                        {
                            httpMethod,
                            resourceId,
                            restApiId,
                        }
                    ))
                        .then((data) => {
                            // console.log("Mk.04");
                            // console.log(data);
                            resolve(data);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rAgwGR = (restApiId) => {
                return new Promise((resolve, reject) => {

                    agwclient.send(new GetResourcesCommand(
                        {
                            restApiId,
                        }
                    ))
                        .then((data) => {
                            console.log("Mk.01");
                            console.log(data);
                            let arrResources = [];
                            let arrP = [];

                            data.items.forEach((Resource) => {
                                console.log("Mk.02");
                                console.log(Resource);
                                if (Resource.Methods === undefined) {
                                    Resource.Methods = [];
                                }
                                let arrResourceMethods = [];
                                if (Resource.resourceMethods !== undefined) {
                                    arrResourceMethods = Object.keys(Resource.resourceMethods);
                                }
                                arrResourceMethods.forEach((METHOD) => {
                                    // let Methods = Object.keys(resourceMethod)
                                    console.log("Mk.03");
                                    console.log(METHOD);
                                    arrP.push(rAgwGM(METHOD, Resource.id, restApiId)
                                        .then((oMethod) => {
                                            return new Promise((resolve, reject) => {
                                                Resource.Methods.push(oMethod);
                                                resolve(`Method objtained for ${Resource.id}`);
                                            });

                                        }));
                                });
                                arrResources.push(Resource);
                            });

                            Promise.all(arrP)
                                .then(() => {
                                    resolve(arrResources);
                                });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rAgwGRAs = () => {
                return new Promise((resolve, reject) => {

                    agwclient.send(new GetRestApisCommand({}))
                        .then((data) => {
                            // console.log(data);
                            let arrP = [];
                            data.items.forEach((RestApi) => {
                                let restApiId = RestApi.id;
                                arrP.push(rAgwGR(restApiId)
                                    .then((arrResources) => {
                                        return new Promise((resolve, reject) => {

                                            RestApi.Resources = arrResources;
                                            if (objGlobal[region] === undefined) {
                                                objGlobal[region] = {};
                                            }

                                            if (objGlobal[region].RestApis === undefined) {
                                                objGlobal[region].RestApis = [];
                                            }

                                            objGlobal[region].RestApis.push(RestApi);
                                            resolve(`Resources obtained for ${restApiId}`);
                                        });
                                    }));
                            });
                            Promise.all(arrP)
                                .then(() => {
                                    resolve(`rAgwGRA`);
                                });
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rELBV2DLBA = (loadbalancer) => {
                return new Promise((resolve, reject) => {

                    elbv2client.send(new DescribeLoadBalancerAttributesCommand(
                        {
                            LoadBalancerArn: loadbalancer.LoadBalancerArn,
                        }
                    ))
                        .then((data) => {
                            resolve(data.Attributes);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rELBV2DLB = () => {
                return new Promise((resolve, reject) => {

                    elbv2client.send(new DescribeLoadBalancersCommand({}))
                        .then((data) => {
                            let arrP = [];
                            data.LoadBalancers.forEach((loadBalancer) => {
                                arrP.push(rELBV2DLBA(loadBalancer)
                                    .then((Attributes) => {
                                        return new Promise((resolve) => {

                                            loadBalancer.Attributes = Attributes;

                                            if (objGlobal[region] === undefined) {
                                                objGlobal[region] = {};
                                            }

                                            if (objGlobal[region].ApplicationLoadBalancers === undefined) {
                                                objGlobal[region].ApplicationLoadBalancers = [];
                                            }

                                            objGlobal[region].ApplicationLoadBalancers.push(loadBalancer);
                                            resolve(`attributes added for ${loadBalancer.LoadBalancerName}`);
                                        });
                                    }));
                            });
                            Promise.all(arrP)
                                .then(() => {
                                    resolve(`rELBV2DLB`);
                                });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rAcmDC = (cert) => {
                return new Promise((resolve, reject) => {

                    acmclient.send(new DescribeCertificateCommand(
                        {
                            CertificateArn: cert.CertificateArn,
                        }
                    ))
                        .then((data) => {
                            resolve(data.Certificate);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            let rAcmLC = () => {
                return new Promise((resolve, reject) => {

                    acmclient.send(new ListCertificatesCommand({}))
                        .then((data) => {
                            let arrP = [];
                            data.CertificateSummaryList.forEach((cert) => {
                                arrP.push(rAcmDC(cert)
                                    .then((Certificate) => {
                                        return new Promise((resolve) => {

                                            if (objGlobal[region] === undefined) {
                                                objGlobal[region] = {};
                                            }

                                            if (objGlobal[region].Certificates === undefined) {
                                                objGlobal[region].Certificates = [];
                                            }

                                            objGlobal[region].Certificates.push(Certificate);
                                            resolve(`certificate described for ${cert.CertificateArn}`)
                                        });
                                    }));
                            });
                            Promise.all(arrP)
                                .then(() => {
                                    resolve(`rAcmLC`);
                                });
                        })
                        .catch((e) => {
                            reject(e);
                        });
                });
            };


            let rS3LB = () => {
                return new Promise((resolve, reject) => {

                    s3client.send(new ListBucketsCommand({}))
                        .then((data) => {
                            data.Buckets.forEach((bucket) => {
                                if (objGlobal[region] === undefined) {
                                    objGlobal[region] = {};
                                }

                                if (objGlobal[region].Buckets === undefined) {
                                    objGlobal[region].Buckets = [];
                                }

                                objGlobal[region].Buckets.push(bucket);
                            });
                            resolve(`rS3LB`);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            };


            const RETRIES = 2;
            let requestSender = (fName, retry) => {
                return new Promise(async (resolve, reject) => {
                    if (retry === undefined) {
                        retry = 0;
                    }
                    console.log(`Attempt ${retry + 1} for ${fName.name} for region ${region}`);


                    let fRand = Math.random();
                    let rWait = Math.round(fRand * MAX_WAIT);
                    // console.log(`pausing ${rWait} ms....`);
                    await new Promise(resolve => setTimeout(resolve, rWait));


                    fName()
                        .then((p) => {
                            resolve(p);
                        })
                        .catch(async (e) => {
                            console.warn(`Problem w requestSender on Fn ${fName.name} for region ${region}.`);
                            console.log(e.name);
                            console.log(Object.keys(e));

                            switch (e.name) {
                                case 'AccessDeniedException':
                                    // console.log("Mk.06");
                                    console.warn(`No retry - access denied insurmountable exception.`);
                                    reject(e);
                                    break;

                                case 'UnrecognizedClientException':
                                    // console.log("Mk.07");
                                    console.warn(`No retry - Unrecognized excpetion, likely no access to region.`);
                                    reject(e);
                                    break;

                                default:
                                    let p;
                                    if (retry < RETRIES) {
                                        console.log(`Retrying, prev error was ${e.name}`);
                                        p = await requestSender(fName, retry + 1);
                                    } else {
                                        console.log("Mk.08");
                                        console.warn(`Too many retries; failing.`);
                                        reject(e);
                                    }
                            }
                            // let re = /AccessDenied/g;
                            // let arrMatches = e.match(re);
                            // if (arrMatches !== null) {
                            //     console.log("Mk.05");
                            //     console.log(arrMatches);
                            // }
                        });
                });
            };


            let arrRegionRequests = [];
            services.forEach((svc) => {
                switch (svc) {
                    case 'rCfLD':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rCfLD));
                        }
                        break;

                    case 'rCfLCP':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rCfLCP));
                        }
                        break;

                    case 'rIamLP':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rIamLP));
                        }
                        break;

                    case 'rIamLR':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rIamLR));
                        }
                        break;

                    case 'rR53LHZ':
                        if (region === 'us-east-1') {
                            arrRegionRequests.push(requestSender(rR53LHZ));
                        }
                        break;

                    case 'rLamLF':
                        arrRegionRequests.push(requestSender(rLamLF));
                        break;

                    case 'rElcDCC':
                        arrRegionRequests.push(requestSender(rElcDCC));
                        break;

                    case 'rAsgDASG':
                        arrRegionRequests.push(requestSender(rAsgDASG));
                        break;

                    case 'rAsgDLC':
                        arrRegionRequests.push(requestSender(rAsgDLC));
                        break;

                    case 'rDdbLT':
                        arrRegionRequests.push(requestSender(rDdbLT));
                        break;

                    case 'rRdsDI':
                        arrRegionRequests.push(requestSender(rRdsDI));
                        break;

                    case 'rRdsDC':
                        arrRegionRequests.push(requestSender(rRdsDC));
                        break;

                    case 'rRdsDOG':
                        arrRegionRequests.push(requestSender(rRdsDOG));
                        break;

                    case 'rRdsDPG':
                        arrRegionRequests.push(requestSender(rRdsDPG));
                        break;

                    case 'rRdsDSG':
                        arrRegionRequests.push(requestSender(rRdsDSG));
                        break;

                    case 'rEc2DI':
                        arrRegionRequests.push(requestSender(rEc2DI));
                        break;

                    case 'rEc2DSG':
                        arrRegionRequests.push(requestSender(rEc2DSG));
                        break;

                    case 'rEc2DS':
                        arrRegionRequests.push(requestSender(rEc2DS));
                        break;

                    case 'rEc2DV':
                        arrRegionRequests.push(requestSender(rEc2DV));
                        break;

                    case 'rEc2DVo':
                        arrRegionRequests.push(requestSender(rEc2DVo));
                        break;

                    case 'rEc2DRT':
                        arrRegionRequests.push(requestSender(rEc2DRT));
                        break;

                    case 'rCwDA':
                        arrRegionRequests.push(requestSender(rCwDA));
                        break;

                    case 'rEcrDR':
                        arrRegionRequests.push(requestSender(rEcrDR));
                        break;

                    case 'rEcsLC':
                        arrRegionRequests.push(requestSender(rEcsLC));
                        break;

                    case 'rEcsLTD':
                        arrRegionRequests.push(requestSender(rEcsLTD));
                        break;

                    case 'rS3LB':
                        arrRegionRequests.push(requestSender(rS3LB));
                        break;

                    case 'rELBV2DLB':
                        arrRegionRequests.push(requestSender(rELBV2DLB));
                        break;

                    case 'rAcmLC':
                        arrRegionRequests.push(requestSender(rAcmLC));
                        break;

                    case 'rAgwGRAs':
                        arrRegionRequests.push(requestSender(rAgwGRAs));
                        break;

                    default:
                        console.error(`Unknown fn: '${svc}'`);
                }
            });


            Promise.all(arrRegionRequests)
                .then((p) => {
                    resolve(p);
                });
        });
    };


    let sendToS3 = (signedUrl, data) => {
        return new Promise(async (resolve) => {
            axios(
                {
                    method: 'PUT',
                    data,
                    url: signedUrl,
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            )
                .then((res) => {
                    resolve(res);
                });
        });
    };


    let postGantrie = (obj) => {
        return new Promise((resolve) => {
            axios(
                {
                    method: 'POST',
                    url: process.env.BACKEND,
                    data: obj,
                    headers: {
                        'content-type': 'application/json',
                    }
                }
            )
                .then((res) => {
                    resolve(res);
                });
        });
    };


    let getPresignedUrl = () => {
        return new Promise((resolve) => {
            let url = process.env.URL_S3;
            axios.get(url)
                .then((p) => {
                    resolve(p);
                });
        });
    };

    let pollingLoop = (Key) => {
        return new Promise(async (resolve) => {
            let url = `${process.env.BACKEND}/status`;
            let params = {
                Key: Key
            };

            while (bStopPoller !== true) {

                let bAllStatusesTrue = true;
                let p = await axios.get(url, {
                    params
                });

                let objStatuses = JSON.parse(p.data.status);
                let arrRegions = Object.keys(objStatuses);
                for (let i = 0; i < arrRegions.length; i++) {
                    let bStatus = objStatuses[arrRegions[i]];
                    if (bStatus === false) {
                        bAllStatusesTrue = false;
                    }
                }

                if (bAllStatusesTrue === true) {
                    bStopPoller = true;
                    resolve(p);
                }

                await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
            }
        });
    };

    let getCdkCode = (url) => {
        return new Promise((resolve, reject) => {
            try {
                axios.get(url, {})
                    .then((response) => {
                        resolve(response.data);
                    });
            } catch (err) {
                reject(err);
            }
        });
    };

    let init = (awsRegions, awsServices, objKeys) => {
        return new Promise((resolve) => {

            bStopPoller = false;
            const credentials = {
                accessKeyId: objKeys.accessKey,
                secretAccessKey: objKeys.secretKey,
            };

            objGlobal = {};
            let arrRequests = [];

            /*
            Calculate temporal spreae
             */
            MAX_WAIT = Math.floor((awsRegions.length + awsServices.length) / 2) * 1000;
            awsRegions.forEach((region) => {
                arrRequests.push(run(region, awsServices, credentials));
            });

            Promise.all(arrRequests)
                .then(async () => {
                    console.log("Finished AWS API calls for each region.");
                    console.log(objGlobal);
                    console.log(JSON.stringify(objGlobal).length);
                    let oPSURL = await getPresignedUrl();


                    sendToS3(oPSURL.data.Url, objGlobal)
                        .then(() => {
                            postGantrie(oPSURL.data)
                                .then(() => {
                                    pollingLoop(oPSURL.data.Key)
                                        .then((p) => {
                                            let objStatus = JSON.parse(p.data.status);
                                            let arrPromises = [];
                                            Object.keys(objStatus).forEach(async (region, i) => {

                                                arrPromises.push(getCdkCode(objStatus[region])
                                                    .then((p) => {
                                                        return new Promise((resolve) => {
                                                            let obj = {
                                                                region,
                                                                content: p,
                                                            };
                                                            resolve(obj);
                                                        });

                                                    }));
                                            });
                                            Promise.all(arrPromises)
                                                .then((p) => {
                                                    resolve(p);
                                                });
                                        });
                                });
                        });
                });
        });
    };
};


export {CloudInventory as default};
