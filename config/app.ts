import env from "../app/globals/env";

export default {
    /**
     * Application name used.
     **/
    name: env('APPLICATION_NAME', 'Bot'),

    /**
     * Token used to interact with Discord.
     **/
    token: env('TOKEN', null),

    /**
    * Lang used by the application.
    **/
    locale: env('LOCALE', 'fr-FR'),
}