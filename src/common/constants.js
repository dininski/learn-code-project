'use strict';

var constants = {
    dbName: 'codeDb',
    Execution: {
        baseFolder: '/executionFolder',
        userFile: 'userFile'
    },
    processingStates: {
        notProcessed: 0,
        inProgress: 1,
        done: 2
    },
    codeExecution: {
        checkInterval: 5000
    }
};



module.exports = constants;
