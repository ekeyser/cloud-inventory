/**
 * @author ekeyser
 */
'use strict';


import {AwsInventory} from 'aws-inventory';
// const { AzureInventory } = require('azure-inventory');
// const { GoogleCloudInventory } = require('google-cloud-inventory');

export class CloudInventory {

    constructor(config) {
        this.config = config;
    }

    static getPermissions = () => {
        return AwsInventory.getPermissions();
    };

    static getInitiators = () => {
        return AwsInventory.getInitiators();
    };

    static getRequestPermissions = () => {
        return AwsInventory.getRequestPermissions();
    };

    inventory() {
        return new Promise((resolve) => {
            this.objGlobal = {};
            let arrRequests = [];

            const vendors = Object.keys(this.config);
            vendors.forEach((vendor) => {

                let oCloudProvider;
                switch (vendor) {
                    case 'aws':
                        oCloudProvider = new AwsInventory(this.config[vendor]);
                        break;

                    case 'google-cloud':
                        // oCloudProvider = new GoogleCloudProvider(this.config[vendor]);
                        break;

                    case 'azure':
                        // oCloudProvider = new AzureProvider(this.config[vendor]);
                        break;

                    default:
                        console.error(`Unknown cloud providers: '${vendor}'`);
                }

                arrRequests.push(oCloudProvider.inventory()
                    .then((promise) => {
                        this.objGlobal[vendor] = promise;
                    })
                );
            });

            Promise.all(arrRequests)
                .then(() => {
                    resolve(this.objGlobal);
                });
        });
    }
}
