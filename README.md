cloud-inventory
========

#### Cloud Infrastructure Inventory ####

This module provides an abstraction layer to inventory your cloud resources.

Supported cloud vendors:
`AWS`

Supported services (and APIs):
AWS
`EC2:`
`RDS:`
`ELC:`
`IAM:`
`CloudFront:`
`CloudWatch:`
`ECS:`
`ECR:`
`Lambda:`
`DynamoDB:`
`Route53:`
`ELB:`
`API Gateway:`
`Autoscaling Groups:`
`ACM: `

Supported Regions
AWS
`us-west-1`
`us-west-2`
`us-east-1`
`us-east-2`
`af-south-1`
`ap-northeast-3`
`ap-northeast-2`
`ap-northeast-1`
`ap-southeast-1`
`ap-southeast-2`
`ca-central-1`
`eu-central-1`
`eu-west-1`
`eu-west-2`
`eu-west-3`
`me-south-1`
`sa-east-1`
`ap-east-1`
`ap-south-2`
`eu-south-1`

### Installation ###
```bash
npm install cloud-inventory
```

### Usage ###

```javascript
import CloudInventory from 'cloud-inventory'

const config = {
  aws: {
    credentials: {
      accessKeyId: 'your_access_key',
      secretAccessKey: 'your_secret_key'
    },
    services: ['ec2', 'rds'],
    regions: ['us-west-2, us-east-1']
  }
};

const oCloudInventory = new CloudInventory(config);
const oResources = oCloudInventory.inventory();
```
