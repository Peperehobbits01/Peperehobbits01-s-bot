import env from "../app/globals/env";

export default {
    type: "mysql",
    mysql: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env('DATABASE_PORT', '3006'),
        database: env('DATABASE_DATABASE'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
    }
}