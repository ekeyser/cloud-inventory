cloud-inventory
========

#### Cloud Infrastructure Inventory ####

This module provides an abstraction layer to inventory your cloud resources.


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
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY
    },
    services: process.env.AWSSERVICES.split(','),
    regions: process.env.AWSREGIONS.split(',')
  },
}

// OR

const config = {
  aws: {
    credentials: {
      accessKeyId: 'your_access_key',
      secretAccessKey: 'your_secret_key'
    },
    services: ['ec2', 'rds'],
    regions: ['us-west-2, us-east-1']
  },
}


const oCloudInventory = new CloudInventory(config)
const oInventory = oCloudInventory.inventory()
```
