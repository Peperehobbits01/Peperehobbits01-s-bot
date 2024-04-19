import dotenv from 'dotenv';
dotenv.config();

const env = (key: string, defaultValue: any = undefined): any => {
    return process.env[key] || defaultValue;
}

export default env;