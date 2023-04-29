const { getTemplateSync: getTemplate } = require('./server-functions/get-file');


console.log({ build: getTemplate('index') });