/* eslint-disable */
/**
 * @author ekeyser
 */
'use strict';


import {AwsInventory} from 'aws-inventory';
// const { AzureInventory } = require('azure-inventory');
// const { GoogleCloudInventory } = require('google-cloud-inventory');

export class CloudInventory {

    // MAX_WAIT = 5000;
    // objGlobal = {};
    // credentials;
    // config;

    constructor(config) {
        this.config = config;
        // Object.keys(config).forEach((vendor) => {
        //
        // });
        // this.credentials = config.aws.credentials;
        // this.awsRegions = config.aws.regions;
        // this.awsServices = config.aws.services;
    }

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

                // this.MAX_WAIT = Math.floor((this.config[vendor].regions.length + this.config[vendor].services.length) / 2) * 1000;
                arrRequests.push(oCloudProvider.inventory()
                    .then((promise) => {
                        this.objGlobal[vendor] = promise;
                    })
                );
                // this.config[vendor].regions.forEach((region) => {
                //     arrRequests.push(oCloudProvider.inventory(region, this.config.awsServices, this.credentials));
                // });
            });

            Promise.all(arrRequests)
                .then(() => {
                    resolve(this.objGlobal);
                });
        });
    }
}
