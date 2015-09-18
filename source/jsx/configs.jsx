define([], function() {

    /*
        You need to replace these API keys and hostnames with
        your own. Then run 'grunt dev' on the console to transpile
        this file into .js
    */

    var local = {
        env: 'local',
        Skylink: {
            apiMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca',
            apiNoMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca'
        },
        maxUsers: 4
    };

    var dev = {
        env: 'dev',
        Skylink: {
            apiMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca',
            apiNoMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca'
        },
        maxUsers: 4
    };

    var prod = {
        env: 'prod',
        Skylink: {
            apiMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca',
            apiNoMCUKey: '3ed54c91-8d60-4908-91f5-f315157567ca'
        },
        maxUsers: 4
    };

    return location.host === 'getaroom.io' ? prod : (
            location.host === 'dev.getaroom.io' ? dev : local
        );

});
