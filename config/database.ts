import env from "../app/globals/env";

export default {
    type: "mysql",
    mysql: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env('DATABASE_PORT', '3006'),
        database: env('DATABASE_DATABASE', null),
        username: env('DATABASE_USERNAME', null),
        password: env('DATABASE_PASSWORD', null),
    }
}