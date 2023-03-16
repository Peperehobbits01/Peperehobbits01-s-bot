module.exports = async () => {
    process.on('uncaughtException', (error, origin) => {
        console.log('----- Uncaught exception -----');
        console.log(error);
        console.log('----- Exception origin -----');
        console.log(origin);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log('----- Unhandled Rejection at -----');
        console.log(promise);
        console.log('----- Reason -----');
        console.log(reason);
    });

    process.on('warning', (name, message, stack) => {
        console.log('----- Warning -----');
        console.log(name);
        console.log('----- Message -----');
        console.log(message);
        console.log('----- Stack -----');
        console.log(stack);
    });
};