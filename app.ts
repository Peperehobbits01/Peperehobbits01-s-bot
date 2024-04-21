import Application from "./app/application";
import config from "./app/globals/config";
import env from "./app/globals/env";

const client = Application.getInstance().getClient();

client.login(config('app.token')).then(() => {
    console.log(config('app.name') + ' - ' + env('npm_package_version'));
});