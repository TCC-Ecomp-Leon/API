"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function createEnvFile() {
    const options = {
        local: process.env.ENV === undefined || process.env.ENV === 'LOCAL',
        test: process.env.ENV === 'TEST',
        beta: process.env.ENV === 'BETA',
        prod: process.env.ENV === 'PROD',
    };
    let envFile;
    if (options.prod) {
        envFile = '.env.prod';
        process.env.ENV = 'PROD';
    }
    else if (options.beta) {
        envFile = '.env.beta';
        process.env.ENV = 'BETA';
    }
    else if (options.test) {
        envFile = '.env.test';
        process.env.ENV = 'TEST';
    }
    else {
        envFile = '.env.local';
        process.env.ENV = 'LOCAL';
    }
    console.log('using ' + envFile + ' environment');
    fs_1.default.readFile(envFile, 'utf8', (err, data) => {
        if (err) {
            console.log('error reading the .env.* file');
            process.exit(-1);
        }
        const envData = data + '\n' + 'ENV=' + process.env.ENV.toString();
        fs_1.default.writeFile('./.env', envData, (err) => {
            if (err) {
                console.log('error writing the .env server file');
                process.exit(-1);
            }
        });
    });
}
createEnvFile();
//# sourceMappingURL=env.js.map