const config = (key: string, defaultValue: any = undefined): any => {
    try {
        let keySplit: string[] = key.split('.');
        let configName = keySplit.shift();

        let config = require('../../config/' + configName).default;

        keySplit.forEach((value: string) => {
            config = config[value];
        })
        if(config === undefined){
            return defaultValue;
        }
        else {
            return config;
        }
    }
    catch (e)
    {
        return defaultValue;
    }

}

export default config;