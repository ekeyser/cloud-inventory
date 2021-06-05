export default {
    input: 'src/CloudInventory.js',
    output: [
        {
            format: 'umd',
            name: 'CloudInventory',
            file: 'build/CloudInventory.js',
            indent: '\t'
        },
        {
            format: 'es',
            name: 'CloudInventory',
            file: 'build/CloudInventory.module.js',
            indent: '\t'
        }
    ]
};
