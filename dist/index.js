require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7529:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"7.15.0"};

/***/ }),

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const requests_1 = __nccwpck_require__(5883);
const tool_1 = __nccwpck_require__(8059);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const githubToken = (0, tool_1.loadInput)('githubToken');
            const githubOrg = (0, tool_1.loadInput)('githubOrg');
            const githubRepository = (0, tool_1.loadInput)('githubRepository');
            const githubRunId = (0, tool_1.loadInput)('githubRunId');
            const elasticApiKeyId = (0, tool_1.loadInput)('elasticApiKeyId');
            const elasticApiKey = (0, tool_1.loadInput)('elasticApiKey');
            const elasticHost = (0, tool_1.loadInput)('elasticHost');
            const elasticIndex = (0, tool_1.loadInput)('elasticIndex');
            core.info(`Initializing Github Connection Instance`);
            const githubInstance = (0, requests_1.createAxiosGithubInstance)(githubToken);
            core.info(`Initializing Elastic Instance`);
            const elasticInstance = (0, requests_1.createElasticInstance)(elasticHost, elasticApiKeyId, elasticApiKey);
            const metadataUrl = `/repos/${githubOrg}/${githubRepository}/actions/runs/${githubRunId}`;
            core.info(`Retrieving metadata from Github Pipeline ${githubRunId}`);
            const metadata = yield (0, requests_1.sendRequestToGithub)(githubInstance, metadataUrl);
            const jobsUrl = metadata.jobs_url;
            core.info(`Retrieving jobs list  from Github Pipeline ${githubRunId}`);
            const jobs = yield (0, requests_1.sendRequestToGithub)(githubInstance, jobsUrl);
            for (const job of jobs.jobs) {
                if (job.status === 'completed') {
                    core.info(`Parsing Job '${job.name}'`);
                    const achievedJob = {
                        id: job.id,
                        name: job.name,
                        status: job.status,
                        conclusion: job.conclusion,
                        steps: job.steps,
                        logs: yield (0, requests_1.sendRequestToGithub)(githubInstance, `/repos/${githubOrg}/${githubRepository}/actions/jobs/${job.id}/logs`)
                    };
                    yield (0, requests_1.sendMessagesToElastic)(elasticInstance, [achievedJob], elasticIndex);
                }
            }
        }
        catch (e) {
            if (e instanceof Error) {
                core.setFailed(e.message);
            }
        }
    });
}
run();


/***/ }),

/***/ 5883:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createElasticInstance = exports.createAxiosGithubInstance = exports.sendMessagesToElastic = exports.sendRequestToGithub = void 0;
const core = __importStar(__nccwpck_require__(2186));
const axios_1 = __importDefault(__nccwpck_require__(6545));
const elasticsearch_1 = __nccwpck_require__(2294);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function sendRequestToGithub(client, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield client.get(path);
            core.debug(response.data);
            return response.data;
        }
        catch (e) {
            throw new Error(`Cannot send request to Github : ${e}`);
        }
    });
}
exports.sendRequestToGithub = sendRequestToGithub;
function sendMessagesToElastic(client, messages, elasticIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug(`Push to elasticIndex`);
            client.bulk({ body: messages, index: elasticIndex });
        }
        catch (e) {
            throw new Error(`Cannot send request to Elastic : ${e}`);
        }
    });
}
exports.sendMessagesToElastic = sendMessagesToElastic;
function createAxiosGithubInstance(token) {
    return axios_1.default.create({
        baseURL: 'https://api.github.com',
        timeout: 1000,
        headers: { Authorization: `token ${token}` }
    });
}
exports.createAxiosGithubInstance = createAxiosGithubInstance;
function createElasticInstance(elasticUrl, elasticApiKeyId, elasticApiKey) {
    return new elasticsearch_1.Client({
        node: elasticUrl,
        auth: {
            apiKey: {
                id: elasticApiKeyId,
                api_key: elasticApiKey
            }
        }
    });
}
exports.createElasticInstance = createElasticInstance;


/***/ }),

/***/ 8059:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadInput = void 0;
const core = __importStar(__nccwpck_require__(2186));
function loadInput(inputName) {
    try {
        return core.getInput(inputName);
    }
    catch (e) {
        throw new Error(`Cannot retrieve parameters ${inputName}`);
    }
}
exports.loadInput = loadInput;


/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(9925);
const auth_1 = __nccwpck_require__(3702);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3702:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 6188:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion_timeout', 'keep_alive', 'typed_keys', 'keep_on_completion', 'batched_reduce_size', 'request_cache', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'explain', 'stored_fields', 'docvalue_fields', 'from', 'ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'search_type', 'size', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'suggest_field', 'suggest_mode', 'suggest_size', 'suggest_text', 'timeout', 'track_scores', 'track_total_hits', 'allow_partial_search_results', 'version', 'seq_no_primary_term', 'max_concurrent_shard_requests']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletionTimeout: 'wait_for_completion_timeout', keepAlive: 'keep_alive', typedKeys: 'typed_keys', keepOnCompletion: 'keep_on_completion', batchedReduceSize: 'batched_reduce_size', requestCache: 'request_cache', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', storedFields: 'stored_fields', docvalueFields: 'docvalue_fields', ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', suggestField: 'suggest_field', suggestMode: 'suggest_mode', suggestSize: 'suggest_size', suggestText: 'suggest_text', trackScores: 'track_scores', trackTotalHits: 'track_total_hits', allowPartialSearchResults: 'allow_partial_search_results', seqNoPrimaryTerm: 'seq_no_primary_term', maxConcurrentShardRequests: 'max_concurrent_shard_requests' }

function AsyncSearchApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

AsyncSearchApi.prototype.delete = function asyncSearchDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_async_search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

AsyncSearchApi.prototype.get = function asyncSearchGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_async_search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AsyncSearchApi.prototype.status = function asyncSearchStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_async_search' + '/' + 'status' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AsyncSearchApi.prototype.submit = function asyncSearchSubmitApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_async_search'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_async_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = AsyncSearchApi


/***/ }),

/***/ 3070:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function AutoscalingApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

AutoscalingApi.prototype.deleteAutoscalingPolicy = function autoscalingDeleteAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.getAutoscalingCapacity = function autoscalingGetAutoscalingCapacityApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_autoscaling' + '/' + 'capacity'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.getAutoscalingPolicy = function autoscalingGetAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.putAutoscalingPolicy = function autoscalingPutAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(AutoscalingApi.prototype, {
  delete_autoscaling_policy: { get () { return this.deleteAutoscalingPolicy } },
  get_autoscaling_capacity: { get () { return this.getAutoscalingCapacity } },
  get_autoscaling_policy: { get () { return this.getAutoscalingPolicy } },
  put_autoscaling_policy: { get () { return this.putAutoscalingPolicy } }
})

module.exports = AutoscalingApi


/***/ }),

/***/ 7630:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'type', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pipeline', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function bulkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_bulk'
  } else if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_bulk'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_bulk'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = bulkApi


/***/ }),

/***/ 8887:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['format', 'local', 'h', 'help', 's', 'v', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'bytes', 'master_timeout', 'fields', 'time', 'ts', 'health', 'pri', 'include_unloaded_segments', 'allow_no_match', 'allow_no_datafeeds', 'allow_no_jobs', 'from', 'size', 'full_id', 'include_bootstrap', 'active_only', 'detailed', 'index', 'ignore_unavailable', 'nodes', 'actions', 'parent_task_id']
const snakeCase = { expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout', includeUnloadedSegments: 'include_unloaded_segments', allowNoMatch: 'allow_no_match', allowNoDatafeeds: 'allow_no_datafeeds', allowNoJobs: 'allow_no_jobs', fullId: 'full_id', includeBootstrap: 'include_bootstrap', activeOnly: 'active_only', ignoreUnavailable: 'ignore_unavailable', parentTaskId: 'parent_task_id' }

function CatApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

CatApi.prototype.aliases = function catAliasesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'aliases' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'aliases'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.allocation = function catAllocationApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'allocation' + '/' + encodeURIComponent(node_id || nodeId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'allocation'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.count = function catCountApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'count' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'count'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.fielddata = function catFielddataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, fields, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'fielddata' + '/' + encodeURIComponent(fields)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'fielddata'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.health = function catHealthApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'health'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.help = function catHelpApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.indices = function catIndicesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'indices' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'indices'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.master = function catMasterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'master'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlDataFrameAnalytics = function catMlDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'data_frame' + '/' + 'analytics'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlDatafeeds = function catMlDatafeedsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'datafeeds'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlJobs = function catMlJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'anomaly_detectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlTrainedModels = function catMlTrainedModelsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.nodeattrs = function catNodeattrsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'nodeattrs'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.nodes = function catNodesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'nodes'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.pendingTasks = function catPendingTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'pending_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.plugins = function catPluginsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'plugins'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.recovery = function catRecoveryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'recovery' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'recovery'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.repositories = function catRepositoriesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'repositories'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.segments = function catSegmentsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'segments' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'segments'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.shards = function catShardsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'shards' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'shards'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.snapshots = function catSnapshotsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'snapshots' + '/' + encodeURIComponent(repository)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'snapshots'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.tasks = function catTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.templates = function catTemplatesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'templates' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'templates'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.threadPool = function catThreadPoolApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, threadPoolPatterns, thread_pool_patterns, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((thread_pool_patterns || threadPoolPatterns) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'thread_pool' + '/' + encodeURIComponent(thread_pool_patterns || threadPoolPatterns)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'thread_pool'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.transforms = function catTransformsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((transform_id || transformId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'transforms' + '/' + encodeURIComponent(transform_id || transformId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'transforms'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(CatApi.prototype, {
  ml_data_frame_analytics: { get () { return this.mlDataFrameAnalytics } },
  ml_datafeeds: { get () { return this.mlDatafeeds } },
  ml_jobs: { get () { return this.mlJobs } },
  ml_trained_models: { get () { return this.mlTrainedModels } },
  pending_tasks: { get () { return this.pendingTasks } },
  thread_pool: { get () { return this.threadPool } }
})

module.exports = CatApi


/***/ }),

/***/ 9287:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_active_shards']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForActiveShards: 'wait_for_active_shards' }

function CcrApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

CcrApi.prototype.deleteAutoFollowPattern = function ccrDeleteAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.follow = function ccrFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.followInfo = function ccrFollowInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.followStats = function ccrFollowStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.forgetFollower = function ccrForgetFollowerApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'forget_follower'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.getAutoFollowPattern = function ccrGetAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ccr' + '/' + 'auto_follow'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.pauseAutoFollowPattern = function ccrPauseAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name) + '/' + 'pause'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.pauseFollow = function ccrPauseFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'pause_follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.putAutoFollowPattern = function ccrPutAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.resumeAutoFollowPattern = function ccrResumeAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name) + '/' + 'resume'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.resumeFollow = function ccrResumeFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'resume_follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.stats = function ccrStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ccr' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.unfollow = function ccrUnfollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'unfollow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(CcrApi.prototype, {
  delete_auto_follow_pattern: { get () { return this.deleteAutoFollowPattern } },
  follow_info: { get () { return this.followInfo } },
  follow_stats: { get () { return this.followStats } },
  forget_follower: { get () { return this.forgetFollower } },
  get_auto_follow_pattern: { get () { return this.getAutoFollowPattern } },
  pause_auto_follow_pattern: { get () { return this.pauseAutoFollowPattern } },
  pause_follow: { get () { return this.pauseFollow } },
  put_auto_follow_pattern: { get () { return this.putAutoFollowPattern } },
  resume_auto_follow_pattern: { get () { return this.resumeAutoFollowPattern } },
  resume_follow: { get () { return this.resumeFollow } }
})

module.exports = CcrApi


/***/ }),

/***/ 7259:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function clearScrollApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, scrollId, scroll_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((scroll_id || scrollId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_search' + '/' + 'scroll' + '/' + encodeURIComponent(scroll_id || scrollId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_search' + '/' + 'scroll'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = clearScrollApi


/***/ }),

/***/ 3294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function closePointInTimeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_pit'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = closePointInTimeApi


/***/ }),

/***/ 6323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['include_yes_decisions', 'include_disk_info', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'timeout', 'master_timeout', 'wait_for_removal', 'local', 'flat_settings', 'include_defaults', 'expand_wildcards', 'level', 'wait_for_active_shards', 'wait_for_nodes', 'wait_for_events', 'wait_for_no_relocating_shards', 'wait_for_no_initializing_shards', 'wait_for_status', 'node_ids', 'node_names', 'create', 'dry_run', 'explain', 'retry_failed', 'metric', 'wait_for_metadata_version', 'wait_for_timeout', 'ignore_unavailable', 'allow_no_indices']
const snakeCase = { includeYesDecisions: 'include_yes_decisions', includeDiskInfo: 'include_disk_info', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout', waitForRemoval: 'wait_for_removal', flatSettings: 'flat_settings', includeDefaults: 'include_defaults', expandWildcards: 'expand_wildcards', waitForActiveShards: 'wait_for_active_shards', waitForNodes: 'wait_for_nodes', waitForEvents: 'wait_for_events', waitForNoRelocatingShards: 'wait_for_no_relocating_shards', waitForNoInitializingShards: 'wait_for_no_initializing_shards', waitForStatus: 'wait_for_status', nodeIds: 'node_ids', nodeNames: 'node_names', dryRun: 'dry_run', retryFailed: 'retry_failed', waitForMetadataVersion: 'wait_for_metadata_version', waitForTimeout: 'wait_for_timeout', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices' }

function ClusterApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

ClusterApi.prototype.allocationExplain = function clusterAllocationExplainApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_cluster' + '/' + 'allocation' + '/' + 'explain'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.deleteComponentTemplate = function clusterDeleteComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.deleteVotingConfigExclusions = function clusterDeleteVotingConfigExclusionsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_cluster' + '/' + 'voting_config_exclusions'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.existsComponentTemplate = function clusterExistsComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.getComponentTemplate = function clusterGetComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_component_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_component_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.getSettings = function clusterGetSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cluster' + '/' + 'settings'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.health = function clusterHealthApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'health' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'health'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.pendingTasks = function clusterPendingTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cluster' + '/' + 'pending_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.postVotingConfigExclusions = function clusterPostVotingConfigExclusionsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_cluster' + '/' + 'voting_config_exclusions'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.putComponentTemplate = function clusterPutComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.putSettings = function clusterPutSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_cluster' + '/' + 'settings'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.remoteInfo = function clusterRemoteInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_remote' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.reroute = function clusterRerouteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_cluster' + '/' + 'reroute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.state = function clusterStateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.index != null && (params.metric == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: metric')
    return handleError(err, callback)
  }

  let { method, body, metric, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((metric) != null && (index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.stats = function clusterStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'stats' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(ClusterApi.prototype, {
  allocation_explain: { get () { return this.allocationExplain } },
  delete_component_template: { get () { return this.deleteComponentTemplate } },
  delete_voting_config_exclusions: { get () { return this.deleteVotingConfigExclusions } },
  exists_component_template: { get () { return this.existsComponentTemplate } },
  get_component_template: { get () { return this.getComponentTemplate } },
  get_settings: { get () { return this.getSettings } },
  pending_tasks: { get () { return this.pendingTasks } },
  post_voting_config_exclusions: { get () { return this.postVotingConfigExclusions } },
  put_component_template: { get () { return this.putComponentTemplate } },
  put_settings: { get () { return this.putSettings } },
  remote_info: { get () { return this.remoteInfo } }
})

module.exports = ClusterApi


/***/ }),

/***/ 7944:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'min_score', 'preference', 'routing', 'q', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'lenient', 'terminate_after', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', minScore: 'min_score', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', terminateAfter: 'terminate_after', errorTrace: 'error_trace', filterPath: 'filter_path' }

function countApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_count'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_count'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_count'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = countApi


/***/ }),

/***/ 3555:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'version', 'version_type', 'pipeline', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function createApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_create'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_create' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = createApi


/***/ }),

/***/ 8540:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['accept_data_loss', 'timeout', 'master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { acceptDataLoss: 'accept_data_loss', masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function DanglingIndicesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

DanglingIndicesApi.prototype.deleteDanglingIndex = function danglingIndicesDeleteDanglingIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index_uuid == null && params.indexUuid == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index_uuid or indexUuid')
    return handleError(err, callback)
  }

  let { method, body, indexUuid, index_uuid, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_dangling' + '/' + encodeURIComponent(index_uuid || indexUuid)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

DanglingIndicesApi.prototype.importDanglingIndex = function danglingIndicesImportDanglingIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index_uuid == null && params.indexUuid == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index_uuid or indexUuid')
    return handleError(err, callback)
  }

  let { method, body, indexUuid, index_uuid, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_dangling' + '/' + encodeURIComponent(index_uuid || indexUuid)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

DanglingIndicesApi.prototype.listDanglingIndices = function danglingIndicesListDanglingIndicesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_dangling'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(DanglingIndicesApi.prototype, {
  delete_dangling_index: { get () { return this.deleteDanglingIndex } },
  import_dangling_index: { get () { return this.importDanglingIndex } },
  list_dangling_indices: { get () { return this.listDanglingIndices } }
})

module.exports = DanglingIndicesApi


/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'if_seq_no', 'if_primary_term', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteApi


/***/ }),

/***/ 2109:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'default_operator', 'df', 'from', 'ignore_unavailable', 'allow_no_indices', 'conflicts', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'scroll', 'search_type', 'search_timeout', 'size', 'max_docs', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'version', 'request_cache', 'refresh', 'timeout', 'wait_for_active_shards', 'scroll_size', 'wait_for_completion', 'requests_per_second', 'slices', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', searchTimeout: 'search_timeout', maxDocs: 'max_docs', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', requestCache: 'request_cache', waitForActiveShards: 'wait_for_active_shards', scrollSize: 'scroll_size', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteByQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_delete_by_query'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_delete_by_query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteByQueryApi


/***/ }),

/***/ 2264:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteByQueryRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.task_id == null && params.taskId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params.requests_per_second == null && params.requestsPerSecond == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  let { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_delete_by_query' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteByQueryRethrottleApi


/***/ }),

/***/ 3107:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_scripts' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteScriptApi


/***/ }),

/***/ 6350:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletion: 'wait_for_completion' }

function EnrichApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

EnrichApi.prototype.deletePolicy = function enrichDeletePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.executePolicy = function enrichExecutePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name) + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.getPolicy = function enrichGetPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_enrich' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.putPolicy = function enrichPutPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.stats = function enrichStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_enrich' + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(EnrichApi.prototype, {
  delete_policy: { get () { return this.deletePolicy } },
  execute_policy: { get () { return this.executePolicy } },
  get_policy: { get () { return this.getPolicy } },
  put_policy: { get () { return this.putPolicy } }
})

module.exports = EnrichApi


/***/ }),

/***/ 941:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion_timeout', 'keep_alive', 'keep_on_completion']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletionTimeout: 'wait_for_completion_timeout', keepAlive: 'keep_alive', keepOnCompletion: 'keep_on_completion' }

function EqlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

EqlApi.prototype.delete = function eqlDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_eql' + '/' + 'search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EqlApi.prototype.get = function eqlGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_eql' + '/' + 'search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

EqlApi.prototype.getStatus = function eqlGetStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_eql' + '/' + 'search' + '/' + 'status' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

EqlApi.prototype.search = function eqlSearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_eql' + '/' + 'search'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(EqlApi.prototype, {
  get_status: { get () { return this.getStatus } }
})

module.exports = EqlApi


/***/ }),

/***/ 1297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function existsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = existsApi


/***/ }),

/***/ 5602:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function existsSourceApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params.id != null && (params.type == null || params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: type, index')
    return handleError(err, callback)
  } else if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_source'
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_source' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = existsSourceApi


/***/ }),

/***/ 8941:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['analyze_wildcard', 'analyzer', 'default_operator', 'df', 'stored_fields', 'lenient', 'preference', 'q', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', errorTrace: 'error_trace', filterPath: 'filter_path' }

function explainApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_explain'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_explain' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = explainApi


/***/ }),

/***/ 8348:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function FeaturesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

FeaturesApi.prototype.getFeatures = function featuresGetFeaturesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_features'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

FeaturesApi.prototype.resetFeatures = function featuresResetFeaturesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_features' + '/' + '_reset'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(FeaturesApi.prototype, {
  get_features: { get () { return this.getFeatures } },
  reset_features: { get () { return this.resetFeatures } }
})

module.exports = FeaturesApi


/***/ }),

/***/ 7109:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['fields', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'include_unmapped', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', includeUnmapped: 'include_unmapped', errorTrace: 'error_trace', filterPath: 'filter_path' }

function fieldCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_field_caps'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_field_caps'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = fieldCapsApi


/***/ }),

/***/ 4366:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_advance', 'wait_for_index', 'checkpoints', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForAdvance: 'wait_for_advance', waitForIndex: 'wait_for_index', errorTrace: 'error_trace', filterPath: 'filter_path' }

function FleetApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

FleetApi.prototype.globalCheckpoints = function fleetGlobalCheckpointsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_fleet' + '/' + 'global_checkpoints'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(FleetApi.prototype, {
  global_checkpoints: { get () { return this.globalCheckpoints } }
})

module.exports = FleetApi


/***/ }),

/***/ 7210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getApi


/***/ }),

/***/ 6482:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_scripts' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptApi


/***/ }),

/***/ 8031:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptContextApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_script_context'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptContextApi


/***/ }),

/***/ 8681:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptLanguagesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_script_language'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptLanguagesApi


/***/ }),

/***/ 1488:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getSourceApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_source'
  } else {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_source' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getSourceApi


/***/ }),

/***/ 6235:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['routing', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function GraphApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

GraphApi.prototype.explore = function graphExploreApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_graph' + '/' + 'explore'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_graph' + '/' + 'explore'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = GraphApi


/***/ }),

/***/ 9790:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'only_managed', 'only_errors', 'dry_run']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', onlyManaged: 'only_managed', onlyErrors: 'only_errors', dryRun: 'dry_run' }

function IlmApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IlmApi.prototype.deleteLifecycle = function ilmDeleteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.policy == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy')
    return handleError(err, callback)
  }

  let { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.explainLifecycle = function ilmExplainLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'explain'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.getLifecycle = function ilmGetLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((policy) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ilm' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.getStatus = function ilmGetStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ilm' + '/' + 'status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.migrateToDataTiers = function ilmMigrateToDataTiersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'migrate_to_data_tiers'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.moveToStep = function ilmMoveToStepApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'move' + '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.putLifecycle = function ilmPutLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.policy == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy')
    return handleError(err, callback)
  }

  let { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.removePolicy = function ilmRemovePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'remove'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.retry = function ilmRetryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'retry'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.start = function ilmStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.stop = function ilmStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IlmApi.prototype, {
  delete_lifecycle: { get () { return this.deleteLifecycle } },
  explain_lifecycle: { get () { return this.explainLifecycle } },
  get_lifecycle: { get () { return this.getLifecycle } },
  get_status: { get () { return this.getStatus } },
  migrate_to_data_tiers: { get () { return this.migrateToDataTiers } },
  move_to_step: { get () { return this.moveToStep } },
  put_lifecycle: { get () { return this.putLifecycle } },
  remove_policy: { get () { return this.removePolicy } }
})

module.exports = IlmApi


/***/ }),

/***/ 9835:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'op_type', 'refresh', 'routing', 'timeout', 'version', 'version_type', 'if_seq_no', 'if_primary_term', 'pipeline', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', opType: 'op_type', versionType: 'version_type', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function indexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else if ((index) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type)
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_doc'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = indexApi


/***/ }),

/***/ 9820:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'index', 'fielddata', 'fields', 'query', 'request', 'wait_for_active_shards', 'include_type_name', 'run_expensive_tasks', 'flush', 'local', 'flat_settings', 'include_defaults', 'force', 'wait_if_ongoing', 'max_num_segments', 'only_expunge_deletes', 'create', 'cause', 'write_index_only', 'preserve_existing', 'order', 'detailed', 'active_only', 'dry_run', 'verbose', 'status', 'copy_settings', 'completion_fields', 'fielddata_fields', 'groups', 'level', 'types', 'include_segment_file_sizes', 'include_unloaded_segments', 'forbid_closed_indices', 'wait_for_completion', 'only_ancient_segments', 'explain', 'q', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'lenient', 'rewrite', 'all_shards']
const snakeCase = { masterTimeout: 'master_timeout', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path', waitForActiveShards: 'wait_for_active_shards', includeTypeName: 'include_type_name', runExpensiveTasks: 'run_expensive_tasks', flatSettings: 'flat_settings', includeDefaults: 'include_defaults', waitIfOngoing: 'wait_if_ongoing', maxNumSegments: 'max_num_segments', onlyExpungeDeletes: 'only_expunge_deletes', writeIndexOnly: 'write_index_only', preserveExisting: 'preserve_existing', activeOnly: 'active_only', dryRun: 'dry_run', copySettings: 'copy_settings', completionFields: 'completion_fields', fielddataFields: 'fielddata_fields', includeSegmentFileSizes: 'include_segment_file_sizes', includeUnloadedSegments: 'include_unloaded_segments', forbidClosedIndices: 'forbid_closed_indices', waitForCompletion: 'wait_for_completion', onlyAncientSegments: 'only_ancient_segments', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', allShards: 'all_shards' }

function IndicesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IndicesApi.prototype.addBlock = function indicesAddBlockApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.block == null) {
    const err = new this[kConfigurationError]('Missing required parameter: block')
    return handleError(err, callback)
  }

  // check required url components
  if (params.block != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, block, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_block' + '/' + encodeURIComponent(block)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.analyze = function indicesAnalyzeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_analyze'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_analyze'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.clearCache = function indicesClearCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_cache' + '/' + 'clear'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_cache' + '/' + 'clear'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.clone = function indicesCloneApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.target == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params.target != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_clone' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.close = function indicesCloseApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.create = function indicesCreateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.createDataStream = function indicesCreateDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_data_stream' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.dataStreamsStats = function indicesDataStreamsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + encodeURIComponent(name) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.delete = function indicesDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteAlias = function indicesDeleteAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_aliases' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteDataStream = function indicesDeleteDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_data_stream' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteIndexTemplate = function indicesDeleteIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteTemplate = function indicesDeleteTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.diskUsage = function indicesDiskUsageApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_disk_usage'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.exists = function indicesExistsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsAlias = function indicesExistsAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + '_alias' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsIndexTemplate = function indicesExistsIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsTemplate = function indicesExistsTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsType = function indicesExistsTypeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.type == null) {
    const err = new this[kConfigurationError]('Missing required parameter: type')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.fieldUsageStats = function indicesFieldUsageStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_field_usage_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.flush = function indicesFlushApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_flush'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_flush'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.flushSynced = function indicesFlushSyncedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_flush' + '/' + 'synced'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.forcemerge = function indicesForcemergeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_forcemerge'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_forcemerge'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.freeze = function indicesFreezeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_freeze'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.get = function indicesGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getAlias = function indicesGetAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_alias' + '/' + encodeURIComponent(name)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_alias'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_alias'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getDataStream = function indicesGetDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getFieldMapping = function indicesGetFieldMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.fields == null) {
    const err = new this[kConfigurationError]('Missing required parameter: fields')
    return handleError(err, callback)
  }

  let { method, body, fields, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type) + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else if ((index) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else if ((type) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type) + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + 'field' + '/' + encodeURIComponent(fields)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getIndexTemplate = function indicesGetIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_index_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_index_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getMapping = function indicesGetMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping'
  } else if ((type) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_mapping'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getSettings = function indicesGetSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_settings' + '/' + encodeURIComponent(name)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_settings'
  } else if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_settings' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getTemplate = function indicesGetTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getUpgrade = function indicesGetUpgradeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_upgrade'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.migrateToDataStream = function indicesMigrateToDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_data_stream' + '/' + '_migrate' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.open = function indicesOpenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_open'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.promoteDataStream = function indicesPromoteDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_data_stream' + '/' + '_promote' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putAlias = function indicesPutAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_aliases' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putIndexTemplate = function indicesPutIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putMapping = function indicesPutMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mapping'
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mappings'
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mappings' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping'
  } else if ((type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_mappings' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mappings'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putSettings = function indicesPutSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_settings'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putTemplate = function indicesPutTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.recovery = function indicesRecoveryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_recovery'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_recovery'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.refresh = function indicesRefreshApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_refresh'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_refresh'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.reloadSearchAnalyzers = function indicesReloadSearchAnalyzersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_reload_search_analyzers'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.resolveIndex = function indicesResolveIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_resolve' + '/' + 'index' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.rollover = function indicesRolloverApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.alias == null) {
    const err = new this[kConfigurationError]('Missing required parameter: alias')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.new_index != null || params.newIndex != null) && (params.alias == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: alias')
    return handleError(err, callback)
  }

  let { method, body, alias, newIndex, new_index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((alias) != null && (new_index || newIndex) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(alias) + '/' + '_rollover' + '/' + encodeURIComponent(new_index || newIndex)
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(alias) + '/' + '_rollover'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.segments = function indicesSegmentsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_segments'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_segments'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.shardStores = function indicesShardStoresApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_shard_stores'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_shard_stores'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.shrink = function indicesShrinkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.target == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params.target != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_shrink' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.simulateIndexTemplate = function indicesSimulateIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_index_template' + '/' + '_simulate_index' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.simulateTemplate = function indicesSimulateTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_index_template' + '/' + '_simulate' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_index_template' + '/' + '_simulate'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.split = function indicesSplitApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.target == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params.target != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_split' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.stats = function indicesStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, metric, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_stats' + '/' + encodeURIComponent(metric)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_stats' + '/' + encodeURIComponent(metric)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.unfreeze = function indicesUnfreezeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_unfreeze'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.updateAliases = function indicesUpdateAliasesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_aliases'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.upgrade = function indicesUpgradeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_upgrade'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.validateQuery = function indicesValidateQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_validate' + '/' + 'query'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_validate' + '/' + 'query'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_validate' + '/' + 'query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IndicesApi.prototype, {
  add_block: { get () { return this.addBlock } },
  clear_cache: { get () { return this.clearCache } },
  create_data_stream: { get () { return this.createDataStream } },
  data_streams_stats: { get () { return this.dataStreamsStats } },
  delete_alias: { get () { return this.deleteAlias } },
  delete_data_stream: { get () { return this.deleteDataStream } },
  delete_index_template: { get () { return this.deleteIndexTemplate } },
  delete_template: { get () { return this.deleteTemplate } },
  disk_usage: { get () { return this.diskUsage } },
  exists_alias: { get () { return this.existsAlias } },
  exists_index_template: { get () { return this.existsIndexTemplate } },
  exists_template: { get () { return this.existsTemplate } },
  exists_type: { get () { return this.existsType } },
  field_usage_stats: { get () { return this.fieldUsageStats } },
  flush_synced: { get () { return this.flushSynced } },
  get_alias: { get () { return this.getAlias } },
  get_data_stream: { get () { return this.getDataStream } },
  get_field_mapping: { get () { return this.getFieldMapping } },
  get_index_template: { get () { return this.getIndexTemplate } },
  get_mapping: { get () { return this.getMapping } },
  get_settings: { get () { return this.getSettings } },
  get_template: { get () { return this.getTemplate } },
  get_upgrade: { get () { return this.getUpgrade } },
  migrate_to_data_stream: { get () { return this.migrateToDataStream } },
  promote_data_stream: { get () { return this.promoteDataStream } },
  put_alias: { get () { return this.putAlias } },
  put_index_template: { get () { return this.putIndexTemplate } },
  put_mapping: { get () { return this.putMapping } },
  put_settings: { get () { return this.putSettings } },
  put_template: { get () { return this.putTemplate } },
  reload_search_analyzers: { get () { return this.reloadSearchAnalyzers } },
  resolve_index: { get () { return this.resolveIndex } },
  shard_stores: { get () { return this.shardStores } },
  simulate_index_template: { get () { return this.simulateIndexTemplate } },
  simulate_template: { get () { return this.simulateTemplate } },
  update_aliases: { get () { return this.updateAliases } },
  validate_query: { get () { return this.validateQuery } }
})

module.exports = IndicesApi


/***/ }),

/***/ 5188:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function infoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = infoApi


/***/ }),

/***/ 5631:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['master_timeout', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'summary', 'verbose']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function IngestApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IngestApi.prototype.deletePipeline = function ingestDeletePipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.geoIpStats = function ingestGeoIpStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ingest' + '/' + 'geoip' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.getPipeline = function ingestGetPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ingest' + '/' + 'pipeline'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.processorGrok = function ingestProcessorGrokApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ingest' + '/' + 'processor' + '/' + 'grok'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.putPipeline = function ingestPutPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.simulate = function ingestSimulateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id) + '/' + '_simulate'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + '_simulate'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IngestApi.prototype, {
  delete_pipeline: { get () { return this.deletePipeline } },
  geo_ip_stats: { get () { return this.geoIpStats } },
  get_pipeline: { get () { return this.getPipeline } },
  processor_grok: { get () { return this.processorGrok } },
  put_pipeline: { get () { return this.putPipeline } }
})

module.exports = IngestApi


/***/ }),

/***/ 1510:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'local', 'accept_enterprise', 'acknowledge', 'type']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', acceptEnterprise: 'accept_enterprise' }

function LicenseApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

LicenseApi.prototype.delete = function licenseDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.get = function licenseGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.getBasicStatus = function licenseGetBasicStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license' + '/' + 'basic_status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.getTrialStatus = function licenseGetTrialStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license' + '/' + 'trial_status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.post = function licensePostApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.postStartBasic = function licensePostStartBasicApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_license' + '/' + 'start_basic'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.postStartTrial = function licensePostStartTrialApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_license' + '/' + 'start_trial'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(LicenseApi.prototype, {
  get_basic_status: { get () { return this.getBasicStatus } },
  get_trial_status: { get () { return this.getTrialStatus } },
  post_start_basic: { get () { return this.postStartBasic } },
  post_start_trial: { get () { return this.postStartTrial } }
})

module.exports = LicenseApi


/***/ }),

/***/ 521:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function LogstashApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

LogstashApi.prototype.deletePipeline = function logstashDeletePipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_logstash' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LogstashApi.prototype.getPipeline = function logstashGetPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_logstash' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LogstashApi.prototype.putPipeline = function logstashPutPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_logstash' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(LogstashApi.prototype, {
  delete_pipeline: { get () { return this.deletePipeline } },
  get_pipeline: { get () { return this.getPipeline } },
  put_pipeline: { get () { return this.putPipeline } }
})

module.exports = LogstashApi


/***/ }),

/***/ 3803:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', errorTrace: 'error_trace', filterPath: 'filter_path' }

function mgetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mget'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_mget'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_mget'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = mgetApi


/***/ }),

/***/ 8652:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function MigrationApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MigrationApi.prototype.deprecations = function migrationDeprecationsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_migration' + '/' + 'deprecations'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_migration' + '/' + 'deprecations'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = MigrationApi


/***/ }),

/***/ 842:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['allow_no_match', 'allow_no_jobs', 'force', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'requests_per_second', 'allow_no_forecasts', 'wait_for_completion', 'lines_to_sample', 'line_merge_size_limit', 'charset', 'format', 'has_header_row', 'column_names', 'delimiter', 'quote', 'should_trim_fields', 'grok_pattern', 'timestamp_field', 'timestamp_format', 'explain', 'calc_interim', 'start', 'end', 'advance_time', 'skip_time', 'duration', 'expires_in', 'max_model_memory', 'expand', 'exclude_interim', 'from', 'size', 'anomaly_score', 'sort', 'desc', 'job_id', 'partition_field_value', 'exclude_generated', 'verbose', 'allow_no_datafeeds', 'influencer_score', 'top_n', 'bucket_span', 'overall_score', 'record_score', 'include', 'include_model_definition', 'decompress_definition', 'tags', 'reset_start', 'reset_end', 'ignore_unavailable', 'allow_no_indices', 'ignore_throttled', 'expand_wildcards', 'reassign', 'delete_intervening_results', 'enabled']
const snakeCase = { allowNoMatch: 'allow_no_match', allowNoJobs: 'allow_no_jobs', errorTrace: 'error_trace', filterPath: 'filter_path', requestsPerSecond: 'requests_per_second', allowNoForecasts: 'allow_no_forecasts', waitForCompletion: 'wait_for_completion', linesToSample: 'lines_to_sample', lineMergeSizeLimit: 'line_merge_size_limit', hasHeaderRow: 'has_header_row', columnNames: 'column_names', shouldTrimFields: 'should_trim_fields', grokPattern: 'grok_pattern', timestampField: 'timestamp_field', timestampFormat: 'timestamp_format', calcInterim: 'calc_interim', advanceTime: 'advance_time', skipTime: 'skip_time', expiresIn: 'expires_in', maxModelMemory: 'max_model_memory', excludeInterim: 'exclude_interim', anomalyScore: 'anomaly_score', jobId: 'job_id', partitionFieldValue: 'partition_field_value', excludeGenerated: 'exclude_generated', allowNoDatafeeds: 'allow_no_datafeeds', influencerScore: 'influencer_score', topN: 'top_n', bucketSpan: 'bucket_span', overallScore: 'overall_score', recordScore: 'record_score', includeModelDefinition: 'include_model_definition', decompressDefinition: 'decompress_definition', resetStart: 'reset_start', resetEnd: 'reset_end', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', ignoreThrottled: 'ignore_throttled', expandWildcards: 'expand_wildcards', deleteInterveningResults: 'delete_intervening_results' }

function MlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MlApi.prototype.closeJob = function mlCloseJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendar = function mlDeleteCalendarApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendarEvent = function mlDeleteCalendarEventApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params.event_id == null && params.eventId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: event_id or eventId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.event_id != null || params.eventId != null) && ((params.calendar_id == null && params.calendarId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, eventId, event_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events' + '/' + encodeURIComponent(event_id || eventId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendarJob = function mlDeleteCalendarJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.job_id != null || params.jobId != null) && ((params.calendar_id == null && params.calendarId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'jobs' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteDataFrameAnalytics = function mlDeleteDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteDatafeed = function mlDeleteDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.datafeed_id == null && params.datafeedId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteExpiredData = function mlDeleteExpiredDataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + '_delete_expired_data' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + '_delete_expired_data'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteFilter = function mlDeleteFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.filter_id == null && params.filterId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }

  let { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteForecast = function mlDeleteForecastApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.forecast_id != null || params.forecastId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, forecastId, forecast_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null && (forecast_id || forecastId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast' + '/' + encodeURIComponent(forecast_id || forecastId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteJob = function mlDeleteJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteModelSnapshot = function mlDeleteModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.snapshot_id == null && params.snapshotId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.snapshot_id != null || params.snapshotId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteTrainedModel = function mlDeleteTrainedModelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.model_id == null && params.modelId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }

  let { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteTrainedModelAlias = function mlDeleteTrainedModelAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.model_alias == null && params.modelAlias == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_alias or modelAlias')
    return handleError(err, callback)
  }
  if (params.model_id == null && params.modelId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.model_alias != null || params.modelAlias != null) && ((params.model_id == null && params.modelId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: model_id')
    return handleError(err, callback)
  }

  let { method, body, modelAlias, model_alias, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId) + '/' + 'model_aliases' + '/' + encodeURIComponent(model_alias || modelAlias)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.estimateModelMemory = function mlEstimateModelMemoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_estimate_model_memory'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.evaluateDataFrame = function mlEvaluateDataFrameApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + '_evaluate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.explainDataFrameAnalytics = function mlExplainDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_explain'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + '_explain'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.findFileStructure = function mlFindFileStructureApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'find_file_structure'

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.flushJob = function mlFlushJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_flush'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.forecast = function mlForecastApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getBuckets = function mlGetBucketsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if (params.timestamp != null && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, timestamp, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null && (timestamp) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'buckets' + '/' + encodeURIComponent(timestamp)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'buckets'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCalendarEvents = function mlGetCalendarEventsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCalendars = function mlGetCalendarsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((calendar_id || calendarId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'calendars'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCategories = function mlGetCategoriesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.category_id != null || params.categoryId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, categoryId, category_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null && (category_id || categoryId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'categories' + '/' + encodeURIComponent(category_id || categoryId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'categories'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDataFrameAnalytics = function mlGetDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDataFrameAnalyticsStats = function mlGetDataFrameAnalyticsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDatafeedStats = function mlGetDatafeedStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDatafeeds = function mlGetDatafeedsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getFilters = function mlGetFiltersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((filter_id || filterId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'filters'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getInfluencers = function mlGetInfluencersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'influencers'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getJobStats = function mlGetJobStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getJobs = function mlGetJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getModelSnapshots = function mlGetModelSnapshotsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.snapshot_id != null || params.snapshotId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((job_id || jobId) != null && (snapshot_id || snapshotId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getOverallBuckets = function mlGetOverallBucketsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'overall_buckets'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getRecords = function mlGetRecordsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'records'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getTrainedModels = function mlGetTrainedModelsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getTrainedModelsStats = function mlGetTrainedModelsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.info = function mlInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ml' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.openJob = function mlOpenJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_open'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.postCalendarEvents = function mlPostCalendarEventsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.postData = function mlPostDataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_data'

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.previewDataFrameAnalytics = function mlPreviewDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_preview'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + '_preview'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.previewDatafeed = function mlPreviewDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_preview'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + '_preview'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putCalendar = function mlPutCalendarApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putCalendarJob = function mlPutCalendarJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.calendar_id == null && params.calendarId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.job_id != null || params.jobId != null) && ((params.calendar_id == null && params.calendarId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  let { method, body, calendarId, calendar_id, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'jobs' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putDataFrameAnalytics = function mlPutDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putDatafeed = function mlPutDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.datafeed_id == null && params.datafeedId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putFilter = function mlPutFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.filter_id == null && params.filterId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putJob = function mlPutJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putTrainedModel = function mlPutTrainedModelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.model_id == null && params.modelId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putTrainedModelAlias = function mlPutTrainedModelAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.model_alias == null && params.modelAlias == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_alias or modelAlias')
    return handleError(err, callback)
  }
  if (params.model_id == null && params.modelId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.model_alias != null || params.modelAlias != null) && ((params.model_id == null && params.modelId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: model_id')
    return handleError(err, callback)
  }

  let { method, body, modelAlias, model_alias, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId) + '/' + 'model_aliases' + '/' + encodeURIComponent(model_alias || modelAlias)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.resetJob = function mlResetJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_reset'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.revertModelSnapshot = function mlRevertModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.snapshot_id == null && params.snapshotId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.snapshot_id != null || params.snapshotId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId) + '/' + '_revert'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.setUpgradeMode = function mlSetUpgradeModeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'set_upgrade_mode'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.startDataFrameAnalytics = function mlStartDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.startDatafeed = function mlStartDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.datafeed_id == null && params.datafeedId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.stopDataFrameAnalytics = function mlStopDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.stopDatafeed = function mlStopDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.datafeed_id == null && params.datafeedId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateDataFrameAnalytics = function mlUpdateDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateDatafeed = function mlUpdateDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.datafeed_id == null && params.datafeedId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateFilter = function mlUpdateFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.filter_id == null && params.filterId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateJob = function mlUpdateJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateModelSnapshot = function mlUpdateModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.snapshot_id == null && params.snapshotId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.snapshot_id != null || params.snapshotId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.upgradeJobSnapshot = function mlUpgradeJobSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.job_id == null && params.jobId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params.snapshot_id == null && params.snapshotId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.snapshot_id != null || params.snapshotId != null) && ((params.job_id == null && params.jobId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  let { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId) + '/' + '_upgrade'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.validate = function mlValidateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_validate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.validateDetector = function mlValidateDetectorApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_validate' + '/' + 'detector'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(MlApi.prototype, {
  close_job: { get () { return this.closeJob } },
  delete_calendar: { get () { return this.deleteCalendar } },
  delete_calendar_event: { get () { return this.deleteCalendarEvent } },
  delete_calendar_job: { get () { return this.deleteCalendarJob } },
  delete_data_frame_analytics: { get () { return this.deleteDataFrameAnalytics } },
  delete_datafeed: { get () { return this.deleteDatafeed } },
  delete_expired_data: { get () { return this.deleteExpiredData } },
  delete_filter: { get () { return this.deleteFilter } },
  delete_forecast: { get () { return this.deleteForecast } },
  delete_job: { get () { return this.deleteJob } },
  delete_model_snapshot: { get () { return this.deleteModelSnapshot } },
  delete_trained_model: { get () { return this.deleteTrainedModel } },
  delete_trained_model_alias: { get () { return this.deleteTrainedModelAlias } },
  estimate_model_memory: { get () { return this.estimateModelMemory } },
  evaluate_data_frame: { get () { return this.evaluateDataFrame } },
  explain_data_frame_analytics: { get () { return this.explainDataFrameAnalytics } },
  find_file_structure: { get () { return this.findFileStructure } },
  flush_job: { get () { return this.flushJob } },
  get_buckets: { get () { return this.getBuckets } },
  get_calendar_events: { get () { return this.getCalendarEvents } },
  get_calendars: { get () { return this.getCalendars } },
  get_categories: { get () { return this.getCategories } },
  get_data_frame_analytics: { get () { return this.getDataFrameAnalytics } },
  get_data_frame_analytics_stats: { get () { return this.getDataFrameAnalyticsStats } },
  get_datafeed_stats: { get () { return this.getDatafeedStats } },
  get_datafeeds: { get () { return this.getDatafeeds } },
  get_filters: { get () { return this.getFilters } },
  get_influencers: { get () { return this.getInfluencers } },
  get_job_stats: { get () { return this.getJobStats } },
  get_jobs: { get () { return this.getJobs } },
  get_model_snapshots: { get () { return this.getModelSnapshots } },
  get_overall_buckets: { get () { return this.getOverallBuckets } },
  get_records: { get () { return this.getRecords } },
  get_trained_models: { get () { return this.getTrainedModels } },
  get_trained_models_stats: { get () { return this.getTrainedModelsStats } },
  open_job: { get () { return this.openJob } },
  post_calendar_events: { get () { return this.postCalendarEvents } },
  post_data: { get () { return this.postData } },
  preview_data_frame_analytics: { get () { return this.previewDataFrameAnalytics } },
  preview_datafeed: { get () { return this.previewDatafeed } },
  put_calendar: { get () { return this.putCalendar } },
  put_calendar_job: { get () { return this.putCalendarJob } },
  put_data_frame_analytics: { get () { return this.putDataFrameAnalytics } },
  put_datafeed: { get () { return this.putDatafeed } },
  put_filter: { get () { return this.putFilter } },
  put_job: { get () { return this.putJob } },
  put_trained_model: { get () { return this.putTrainedModel } },
  put_trained_model_alias: { get () { return this.putTrainedModelAlias } },
  reset_job: { get () { return this.resetJob } },
  revert_model_snapshot: { get () { return this.revertModelSnapshot } },
  set_upgrade_mode: { get () { return this.setUpgradeMode } },
  start_data_frame_analytics: { get () { return this.startDataFrameAnalytics } },
  start_datafeed: { get () { return this.startDatafeed } },
  stop_data_frame_analytics: { get () { return this.stopDataFrameAnalytics } },
  stop_datafeed: { get () { return this.stopDatafeed } },
  update_data_frame_analytics: { get () { return this.updateDataFrameAnalytics } },
  update_datafeed: { get () { return this.updateDatafeed } },
  update_filter: { get () { return this.updateFilter } },
  update_job: { get () { return this.updateJob } },
  update_model_snapshot: { get () { return this.updateModelSnapshot } },
  upgrade_job_snapshot: { get () { return this.upgradeJobSnapshot } },
  validate_detector: { get () { return this.validateDetector } }
})

module.exports = MlApi


/***/ }),

/***/ 9861:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['system_id', 'system_api_version', 'interval', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { systemId: 'system_id', systemApiVersion: 'system_api_version', errorTrace: 'error_trace', filterPath: 'filter_path' }

function MonitoringApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MonitoringApi.prototype.bulk = function monitoringBulkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((type) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_monitoring' + '/' + encodeURIComponent(type) + '/' + 'bulk'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_monitoring' + '/' + 'bulk'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = MonitoringApi


/***/ }),

/***/ 4757:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['search_type', 'max_concurrent_searches', 'typed_keys', 'pre_filter_shard_size', 'max_concurrent_shard_requests', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { searchType: 'search_type', maxConcurrentSearches: 'max_concurrent_searches', typedKeys: 'typed_keys', preFilterShardSize: 'pre_filter_shard_size', maxConcurrentShardRequests: 'max_concurrent_shard_requests', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function msearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_msearch'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_msearch'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_msearch'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = msearchApi


/***/ }),

/***/ 1596:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['search_type', 'typed_keys', 'max_concurrent_searches', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { searchType: 'search_type', typedKeys: 'typed_keys', maxConcurrentSearches: 'max_concurrent_searches', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function msearchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_msearch' + '/' + 'template'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_msearch' + '/' + 'template'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_msearch' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = msearchTemplateApi


/***/ }),

/***/ 1240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['ids', 'term_statistics', 'field_statistics', 'fields', 'offsets', 'positions', 'payloads', 'preference', 'routing', 'realtime', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { termStatistics: 'term_statistics', fieldStatistics: 'field_statistics', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function mtermvectorsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mtermvectors'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_mtermvectors'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_mtermvectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = mtermvectorsApi


/***/ }),

/***/ 7089:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'interval', 'snapshots', 'threads', 'ignore_idle_threads', 'type', 'timeout', 'flat_settings', 'completion_fields', 'fielddata_fields', 'fields', 'groups', 'level', 'types', 'include_segment_file_sizes', 'include_unloaded_segments']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', ignoreIdleThreads: 'ignore_idle_threads', flatSettings: 'flat_settings', completionFields: 'completion_fields', fielddataFields: 'fielddata_fields', includeSegmentFileSizes: 'include_segment_file_sizes', includeUnloadedSegments: 'include_unloaded_segments' }

function NodesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

NodesApi.prototype.clearRepositoriesMeteringArchive = function nodesClearRepositoriesMeteringArchiveApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.node_id == null && params.nodeId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: node_id or nodeId')
    return handleError(err, callback)
  }
  if (params.max_archive_version == null && params.maxArchiveVersion == null) {
    const err = new this[kConfigurationError]('Missing required parameter: max_archive_version or maxArchiveVersion')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.max_archive_version != null || params.maxArchiveVersion != null) && ((params.node_id == null && params.nodeId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: node_id')
    return handleError(err, callback)
  }

  let { method, body, nodeId, node_id, maxArchiveVersion, max_archive_version, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + '_repositories_metering' + '/' + encodeURIComponent(max_archive_version || maxArchiveVersion)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.getRepositoriesMeteringInfo = function nodesGetRepositoriesMeteringInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.node_id == null && params.nodeId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: node_id or nodeId')
    return handleError(err, callback)
  }

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + '_repositories_metering'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.hotThreads = function nodesHotThreadsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hot_threads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hotthreads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hotthreads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hot_threads'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'hot_threads'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.info = function nodesInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + encodeURIComponent(metric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.reloadSecureSettings = function nodesReloadSecureSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'reload_secure_settings'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_nodes' + '/' + 'reload_secure_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.stats = function nodesStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, metric, indexMetric, index_metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null && (metric) != null && (index_metric || indexMetric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
  } else if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else if ((metric) != null && (index_metric || indexMetric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats'
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.usage = function nodesUsageApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'usage' + '/' + encodeURIComponent(metric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'usage'
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'usage' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'usage'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(NodesApi.prototype, {
  clear_repositories_metering_archive: { get () { return this.clearRepositoriesMeteringArchive } },
  get_repositories_metering_info: { get () { return this.getRepositoriesMeteringInfo } },
  hot_threads: { get () { return this.hotThreads } },
  reload_secure_settings: { get () { return this.reloadSecureSettings } }
})

module.exports = NodesApi


/***/ }),

/***/ 923:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['preference', 'routing', 'ignore_unavailable', 'expand_wildcards', 'keep_alive', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', expandWildcards: 'expand_wildcards', keepAlive: 'keep_alive', errorTrace: 'error_trace', filterPath: 'filter_path' }

function openPointInTimeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_pit'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = openPointInTimeApi


/***/ }),

/***/ 4539:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function pingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'HEAD'
  path = '/'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = pingApi


/***/ }),

/***/ 2321:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'context', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function putScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.context != null && (params.id == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: id')
    return handleError(err, callback)
  }

  let { method, body, id, context, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null && (context) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_scripts' + '/' + encodeURIComponent(id) + '/' + encodeURIComponent(context)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_scripts' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = putScriptApi


/***/ }),

/***/ 683:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'search_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function rankEvalApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_rank_eval'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_rank_eval'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = rankEvalApi


/***/ }),

/***/ 8919:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['refresh', 'timeout', 'wait_for_active_shards', 'wait_for_completion', 'requests_per_second', 'scroll', 'slices', 'max_docs', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', maxDocs: 'max_docs', errorTrace: 'error_trace', filterPath: 'filter_path' }

function reindexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_reindex'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = reindexApi


/***/ }),

/***/ 643:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function reindexRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.task_id == null && params.taskId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params.requests_per_second == null && params.requestsPerSecond == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  let { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_reindex' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = reindexRethrottleApi


/***/ }),

/***/ 9252:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function renderSearchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_render' + '/' + 'template' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_render' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = renderSearchTemplateApi


/***/ }),

/***/ 5711:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'typed_keys', 'rest_total_hits_as_int', 'wait_for_completion', 'timeout']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', typedKeys: 'typed_keys', restTotalHitsAsInt: 'rest_total_hits_as_int', waitForCompletion: 'wait_for_completion' }

function RollupApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

RollupApi.prototype.deleteJob = function rollupDeleteJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getJobs = function rollupGetJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'job'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getRollupCaps = function rollupGetRollupCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'data' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'data'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getRollupIndexCaps = function rollupGetRollupIndexCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_rollup' + '/' + 'data'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.putJob = function rollupPutJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.rollup = function rollupRollupApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.rollup_index == null && params.rollupIndex == null) {
    const err = new this[kConfigurationError]('Missing required parameter: rollup_index or rollupIndex')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.rollup_index != null || params.rollupIndex != null) && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, rollupIndex, rollup_index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_rollup' + '/' + encodeURIComponent(rollup_index || rollupIndex)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.rollupSearch = function rollupRollupSearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_rollup_search'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_rollup_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.startJob = function rollupStartJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.stopJob = function rollupStopJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(RollupApi.prototype, {
  delete_job: { get () { return this.deleteJob } },
  get_jobs: { get () { return this.getJobs } },
  get_rollup_caps: { get () { return this.getRollupCaps } },
  get_rollup_index_caps: { get () { return this.getRollupIndexCaps } },
  put_job: { get () { return this.putJob } },
  rollup_search: { get () { return this.rollupSearch } },
  start_job: { get () { return this.startJob } },
  stop_job: { get () { return this.stopJob } }
})

module.exports = RollupApi


/***/ }),

/***/ 9064:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function scriptsPainlessExecuteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_scripts' + '/' + 'painless' + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = scriptsPainlessExecuteApi


/***/ }),

/***/ 3432:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['scroll', 'scroll_id', 'rest_total_hits_as_int', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { scrollId: 'scroll_id', restTotalHitsAsInt: 'rest_total_hits_as_int', errorTrace: 'error_trace', filterPath: 'filter_path' }

function scrollApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, scrollId, scroll_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((scroll_id || scrollId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'scroll' + '/' + encodeURIComponent(scroll_id || scrollId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'scroll'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = scrollApi


/***/ }),

/***/ 1974:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'ccs_minimize_roundtrips', 'default_operator', 'df', 'explain', 'stored_fields', 'docvalue_fields', 'from', 'ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'scroll', 'search_type', 'size', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'suggest_field', 'suggest_mode', 'suggest_size', 'suggest_text', 'timeout', 'track_scores', 'track_total_hits', 'allow_partial_search_results', 'typed_keys', 'version', 'seq_no_primary_term', 'request_cache', 'batched_reduce_size', 'max_concurrent_shard_requests', 'pre_filter_shard_size', 'rest_total_hits_as_int', 'min_compatible_shard_node', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', defaultOperator: 'default_operator', storedFields: 'stored_fields', docvalueFields: 'docvalue_fields', ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', suggestField: 'suggest_field', suggestMode: 'suggest_mode', suggestSize: 'suggest_size', suggestText: 'suggest_text', trackScores: 'track_scores', trackTotalHits: 'track_total_hits', allowPartialSearchResults: 'allow_partial_search_results', typedKeys: 'typed_keys', seqNoPrimaryTerm: 'seq_no_primary_term', requestCache: 'request_cache', batchedReduceSize: 'batched_reduce_size', maxConcurrentShardRequests: 'max_concurrent_shard_requests', preFilterShardSize: 'pre_filter_shard_size', restTotalHitsAsInt: 'rest_total_hits_as_int', minCompatibleShardNode: 'min_compatible_shard_node', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_search'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchApi


/***/ }),

/***/ 8241:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['exact_bounds', 'extent', 'grid_precision', 'grid_type', 'size', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { exactBounds: 'exact_bounds', gridPrecision: 'grid_precision', gridType: 'grid_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchMvtApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.field == null) {
    const err = new this[kConfigurationError]('Missing required parameter: field')
    return handleError(err, callback)
  }
  if (params.zoom == null) {
    const err = new this[kConfigurationError]('Missing required parameter: zoom')
    return handleError(err, callback)
  }
  if (params.x == null) {
    const err = new this[kConfigurationError]('Missing required parameter: x')
    return handleError(err, callback)
  }
  if (params.y == null) {
    const err = new this[kConfigurationError]('Missing required parameter: y')
    return handleError(err, callback)
  }

  // check required url components
  if (params.y != null && (params.x == null || params.zoom == null || params.field == null || params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: x, zoom, field, index')
    return handleError(err, callback)
  } else if (params.x != null && (params.zoom == null || params.field == null || params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: zoom, field, index')
    return handleError(err, callback)
  } else if (params.zoom != null && (params.field == null || params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: field, index')
    return handleError(err, callback)
  } else if (params.field != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, field, zoom, x, y, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_mvt' + '/' + encodeURIComponent(field) + '/' + encodeURIComponent(zoom) + '/' + encodeURIComponent(x) + '/' + encodeURIComponent(y)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchMvtApi


/***/ }),

/***/ 1434:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['preference', 'routing', 'local', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchShardsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search_shards'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search_shards'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchShardsApi


/***/ }),

/***/ 9874:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'preference', 'routing', 'scroll', 'search_type', 'explain', 'profile', 'typed_keys', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', typedKeys: 'typed_keys', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_search' + '/' + 'template'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search' + '/' + 'template'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchTemplateApi


/***/ }),

/***/ 2240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'index', 'master_timeout', 'wait_for_completion', 'storage', 'level']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', masterTimeout: 'master_timeout', waitForCompletion: 'wait_for_completion' }

function SearchableSnapshotsApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SearchableSnapshotsApi.prototype.cacheStats = function searchableSnapshotsCacheStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_searchable_snapshots' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'cache' + '/' + 'stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_searchable_snapshots' + '/' + 'cache' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.clearCache = function searchableSnapshotsClearCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_searchable_snapshots' + '/' + 'cache' + '/' + 'clear'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_searchable_snapshots' + '/' + 'cache' + '/' + 'clear'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.mount = function searchableSnapshotsMountApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_mount'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.repositoryStats = function searchableSnapshotsRepositoryStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.stats = function searchableSnapshotsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_searchable_snapshots' + '/' + 'stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_searchable_snapshots' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SearchableSnapshotsApi.prototype, {
  cache_stats: { get () { return this.cacheStats } },
  clear_cache: { get () { return this.clearCache } },
  repository_stats: { get () { return this.repositoryStats } }
})

module.exports = SearchableSnapshotsApi


/***/ }),

/***/ 9457:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'refresh', 'usernames', 'id', 'name', 'username', 'realm_name', 'owner']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', realmName: 'realm_name' }

function SecurityApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SecurityApi.prototype.authenticate = function securityAuthenticateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + '_authenticate'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.changePassword = function securityChangePasswordApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((username) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_password'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_security' + '/' + 'user' + '/' + '_password'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearApiKeyCache = function securityClearApiKeyCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.ids == null) {
    const err = new this[kConfigurationError]('Missing required parameter: ids')
    return handleError(err, callback)
  }

  let { method, body, ids, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'api_key' + '/' + encodeURIComponent(ids) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedPrivileges = function securityClearCachedPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.application == null) {
    const err = new this[kConfigurationError]('Missing required parameter: application')
    return handleError(err, callback)
  }

  let { method, body, application, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedRealms = function securityClearCachedRealmsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.realms == null) {
    const err = new this[kConfigurationError]('Missing required parameter: realms')
    return handleError(err, callback)
  }

  let { method, body, realms, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'realm' + '/' + encodeURIComponent(realms) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedRoles = function securityClearCachedRolesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedServiceTokens = function securityClearCachedServiceTokensApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.namespace == null) {
    const err = new this[kConfigurationError]('Missing required parameter: namespace')
    return handleError(err, callback)
  }
  if (params.service == null) {
    const err = new this[kConfigurationError]('Missing required parameter: service')
    return handleError(err, callback)
  }
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.service == null || params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: service, namespace')
    return handleError(err, callback)
  } else if (params.service != null && (params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: namespace')
    return handleError(err, callback)
  }

  let { method, body, namespace, service, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service) + '/' + 'credential' + '/' + 'token' + '/' + encodeURIComponent(name) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.createApiKey = function securityCreateApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.createServiceToken = function securityCreateServiceTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.namespace == null) {
    const err = new this[kConfigurationError]('Missing required parameter: namespace')
    return handleError(err, callback)
  }
  if (params.service == null) {
    const err = new this[kConfigurationError]('Missing required parameter: service')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.service == null || params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: service, namespace')
    return handleError(err, callback)
  } else if (params.service != null && (params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: namespace')
    return handleError(err, callback)
  }

  let { method, body, namespace, service, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((namespace) != null && (service) != null && (name) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service) + '/' + 'credential' + '/' + 'token' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service) + '/' + 'credential' + '/' + 'token'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deletePrivileges = function securityDeletePrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.application == null) {
    const err = new this[kConfigurationError]('Missing required parameter: application')
    return handleError(err, callback)
  }
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.application == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: application')
    return handleError(err, callback)
  }

  let { method, body, application, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteRole = function securityDeleteRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteRoleMapping = function securityDeleteRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteServiceToken = function securityDeleteServiceTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.namespace == null) {
    const err = new this[kConfigurationError]('Missing required parameter: namespace')
    return handleError(err, callback)
  }
  if (params.service == null) {
    const err = new this[kConfigurationError]('Missing required parameter: service')
    return handleError(err, callback)
  }
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params.name != null && (params.service == null || params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: service, namespace')
    return handleError(err, callback)
  } else if (params.service != null && (params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: namespace')
    return handleError(err, callback)
  }

  let { method, body, namespace, service, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service) + '/' + 'credential' + '/' + 'token' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteUser = function securityDeleteUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.username == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.disableUser = function securityDisableUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.username == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_disable'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.enableUser = function securityEnableUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.username == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_enable'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getApiKey = function securityGetApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getBuiltinPrivileges = function securityGetBuiltinPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'privilege' + '/' + '_builtin'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getPrivileges = function securityGetPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.name != null && (params.application == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: application')
    return handleError(err, callback)
  }

  let { method, body, application, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((application) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + encodeURIComponent(name)
  } else if ((application) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getRole = function securityGetRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getRoleMapping = function securityGetRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role_mapping'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getServiceAccounts = function securityGetServiceAccountsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.service != null && (params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: namespace')
    return handleError(err, callback)
  }

  let { method, body, namespace, service, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((namespace) != null && (service) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service)
  } else if ((namespace) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'service'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getServiceCredentials = function securityGetServiceCredentialsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.namespace == null) {
    const err = new this[kConfigurationError]('Missing required parameter: namespace')
    return handleError(err, callback)
  }
  if (params.service == null) {
    const err = new this[kConfigurationError]('Missing required parameter: service')
    return handleError(err, callback)
  }

  // check required url components
  if (params.service != null && (params.namespace == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: namespace')
    return handleError(err, callback)
  }

  let { method, body, namespace, service, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'service' + '/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(service) + '/' + 'credential'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getToken = function securityGetTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'oauth2' + '/' + 'token'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getUser = function securityGetUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((username) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'user'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getUserPrivileges = function securityGetUserPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'user' + '/' + '_privileges'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.grantApiKey = function securityGrantApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'api_key' + '/' + 'grant'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.hasPrivileges = function securityHasPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, user, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((user) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(user) + '/' + '_has_privileges'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_security' + '/' + 'user' + '/' + '_has_privileges'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.invalidateApiKey = function securityInvalidateApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.invalidateToken = function securityInvalidateTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'oauth2' + '/' + 'token'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putPrivileges = function securityPutPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'privilege'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putRole = function securityPutRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putRoleMapping = function securityPutRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.name == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putUser = function securityPutUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.username == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.queryApiKeys = function securityQueryApiKeysApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_security' + '/' + '_query' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlAuthenticate = function securitySamlAuthenticateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'authenticate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlCompleteLogout = function securitySamlCompleteLogoutApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'complete_logout'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlInvalidate = function securitySamlInvalidateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'invalidate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlLogout = function securitySamlLogoutApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'logout'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlPrepareAuthentication = function securitySamlPrepareAuthenticationApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'prepare'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.samlServiceProviderMetadata = function securitySamlServiceProviderMetadataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.realm_name == null && params.realmName == null) {
    const err = new this[kConfigurationError]('Missing required parameter: realm_name or realmName')
    return handleError(err, callback)
  }

  let { method, body, realmName, realm_name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'saml' + '/' + 'metadata' + '/' + encodeURIComponent(realm_name || realmName)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SecurityApi.prototype, {
  change_password: { get () { return this.changePassword } },
  clear_api_key_cache: { get () { return this.clearApiKeyCache } },
  clear_cached_privileges: { get () { return this.clearCachedPrivileges } },
  clear_cached_realms: { get () { return this.clearCachedRealms } },
  clear_cached_roles: { get () { return this.clearCachedRoles } },
  clear_cached_service_tokens: { get () { return this.clearCachedServiceTokens } },
  create_api_key: { get () { return this.createApiKey } },
  create_service_token: { get () { return this.createServiceToken } },
  delete_privileges: { get () { return this.deletePrivileges } },
  delete_role: { get () { return this.deleteRole } },
  delete_role_mapping: { get () { return this.deleteRoleMapping } },
  delete_service_token: { get () { return this.deleteServiceToken } },
  delete_user: { get () { return this.deleteUser } },
  disable_user: { get () { return this.disableUser } },
  enable_user: { get () { return this.enableUser } },
  get_api_key: { get () { return this.getApiKey } },
  get_builtin_privileges: { get () { return this.getBuiltinPrivileges } },
  get_privileges: { get () { return this.getPrivileges } },
  get_role: { get () { return this.getRole } },
  get_role_mapping: { get () { return this.getRoleMapping } },
  get_service_accounts: { get () { return this.getServiceAccounts } },
  get_service_credentials: { get () { return this.getServiceCredentials } },
  get_token: { get () { return this.getToken } },
  get_user: { get () { return this.getUser } },
  get_user_privileges: { get () { return this.getUserPrivileges } },
  grant_api_key: { get () { return this.grantApiKey } },
  has_privileges: { get () { return this.hasPrivileges } },
  invalidate_api_key: { get () { return this.invalidateApiKey } },
  invalidate_token: { get () { return this.invalidateToken } },
  put_privileges: { get () { return this.putPrivileges } },
  put_role: { get () { return this.putRole } },
  put_role_mapping: { get () { return this.putRoleMapping } },
  put_user: { get () { return this.putUser } },
  query_api_keys: { get () { return this.queryApiKeys } },
  saml_authenticate: { get () { return this.samlAuthenticate } },
  saml_complete_logout: { get () { return this.samlCompleteLogout } },
  saml_invalidate: { get () { return this.samlInvalidate } },
  saml_logout: { get () { return this.samlLogout } },
  saml_prepare_authentication: { get () { return this.samlPrepareAuthentication } },
  saml_service_provider_metadata: { get () { return this.samlServiceProviderMetadata } }
})

module.exports = SecurityApi


/***/ }),

/***/ 5991:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function ShutdownApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

ShutdownApi.prototype.deleteNode = function shutdownDeleteNodeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.node_id == null && params.nodeId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: node_id or nodeId')
    return handleError(err, callback)
  }

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'shutdown'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ShutdownApi.prototype.getNode = function shutdownGetNodeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'shutdown'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'shutdown'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ShutdownApi.prototype.putNode = function shutdownPutNodeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.node_id == null && params.nodeId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: node_id or nodeId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'shutdown'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(ShutdownApi.prototype, {
  delete_node: { get () { return this.deleteNode } },
  get_node: { get () { return this.getNode } },
  put_node: { get () { return this.putNode } }
})

module.exports = ShutdownApi


/***/ }),

/***/ 1395:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function SlmApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SlmApi.prototype.deleteLifecycle = function slmDeleteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.policy_id == null && params.policyId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  let { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.executeLifecycle = function slmExecuteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.policy_id == null && params.policyId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  let { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId) + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.executeRetention = function slmExecuteRetentionApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + '_execute_retention'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getLifecycle = function slmGetLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((policy_id || policyId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_slm' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getStats = function slmGetStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_slm' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getStatus = function slmGetStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_slm' + '/' + 'status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.putLifecycle = function slmPutLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.policy_id == null && params.policyId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  let { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.start = function slmStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + 'start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.stop = function slmStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + 'stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SlmApi.prototype, {
  delete_lifecycle: { get () { return this.deleteLifecycle } },
  execute_lifecycle: { get () { return this.executeLifecycle } },
  execute_retention: { get () { return this.executeRetention } },
  get_lifecycle: { get () { return this.getLifecycle } },
  get_stats: { get () { return this.getStats } },
  get_status: { get () { return this.getStatus } },
  put_lifecycle: { get () { return this.putLifecycle } }
})

module.exports = SlmApi


/***/ }),

/***/ 3536:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['master_timeout', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion', 'verify', 'ignore_unavailable', 'index_details', 'include_repository', 'verbose', 'local', 'blob_count', 'concurrency', 'read_node_count', 'early_read_node_count', 'seed', 'rare_action_probability', 'max_blob_size', 'max_total_data_size', 'detailed', 'rarely_abort_writes']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletion: 'wait_for_completion', ignoreUnavailable: 'ignore_unavailable', indexDetails: 'index_details', includeRepository: 'include_repository', blobCount: 'blob_count', readNodeCount: 'read_node_count', earlyReadNodeCount: 'early_read_node_count', rareActionProbability: 'rare_action_probability', maxBlobSize: 'max_blob_size', maxTotalDataSize: 'max_total_data_size', rarelyAbortWrites: 'rarely_abort_writes' }

function SnapshotApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SnapshotApi.prototype.cleanupRepository = function snapshotCleanupRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_cleanup'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.clone = function snapshotCloneApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }
  if (params.target_snapshot == null && params.targetSnapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target_snapshot or targetSnapshot')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.target_snapshot != null || params.targetSnapshot != null) && (params.snapshot == null || params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: snapshot, repository')
    return handleError(err, callback)
  } else if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, targetSnapshot, target_snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_clone' + '/' + encodeURIComponent(target_snapshot || targetSnapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.create = function snapshotCreateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.createRepository = function snapshotCreateRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.delete = function snapshotDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.deleteRepository = function snapshotDeleteRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.get = function snapshotGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.getRepository = function snapshotGetRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.repositoryAnalyze = function snapshotRepositoryAnalyzeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_analyze'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.restore = function snapshotRestoreApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params.snapshot == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_restore'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.status = function snapshotStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params.snapshot != null && (params.repository == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((repository) != null && (snapshot) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_status'
  } else if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_status'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + '_status'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.verifyRepository = function snapshotVerifyRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.repository == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  let { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_verify'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SnapshotApi.prototype, {
  cleanup_repository: { get () { return this.cleanupRepository } },
  create_repository: { get () { return this.createRepository } },
  delete_repository: { get () { return this.deleteRepository } },
  get_repository: { get () { return this.getRepository } },
  repository_analyze: { get () { return this.repositoryAnalyze } },
  verify_repository: { get () { return this.verifyRepository } }
})

module.exports = SnapshotApi


/***/ }),

/***/ 8150:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'delimiter', 'format', 'keep_alive', 'wait_for_completion_timeout']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', keepAlive: 'keep_alive', waitForCompletionTimeout: 'wait_for_completion_timeout' }

function SqlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SqlApi.prototype.clearCursor = function sqlClearCursorApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_sql' + '/' + 'close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.deleteAsync = function sqlDeleteAsyncApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_sql' + '/' + 'async' + '/' + 'delete' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.getAsync = function sqlGetAsyncApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_sql' + '/' + 'async' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.getAsyncStatus = function sqlGetAsyncStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_sql' + '/' + 'async' + '/' + 'status' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.query = function sqlQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_sql'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.translate = function sqlTranslateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_sql' + '/' + 'translate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SqlApi.prototype, {
  clear_cursor: { get () { return this.clearCursor } },
  delete_async: { get () { return this.deleteAsync } },
  get_async: { get () { return this.getAsync } },
  get_async_status: { get () { return this.getAsyncStatus } }
})

module.exports = SqlApi


/***/ }),

/***/ 6805:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function SslApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SslApi.prototype.certificates = function sslCertificatesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ssl' + '/' + 'certificates'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = SslApi


/***/ }),

/***/ 8917:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['nodes', 'actions', 'parent_task_id', 'wait_for_completion', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'timeout', 'detailed', 'group_by']
const snakeCase = { parentTaskId: 'parent_task_id', waitForCompletion: 'wait_for_completion', errorTrace: 'error_trace', filterPath: 'filter_path', groupBy: 'group_by' }

function TasksApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

TasksApi.prototype.cancel = function tasksCancelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((task_id || taskId) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_tasks' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_cancel'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_tasks' + '/' + '_cancel'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TasksApi.prototype.get = function tasksGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.task_id == null && params.taskId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }

  let { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_tasks' + '/' + encodeURIComponent(task_id || taskId)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TasksApi.prototype.list = function tasksListApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = TasksApi


/***/ }),

/***/ 887:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function termsEnumApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_terms_enum'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = termsEnumApi


/***/ }),

/***/ 1796:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['term_statistics', 'field_statistics', 'fields', 'offsets', 'positions', 'payloads', 'preference', 'routing', 'realtime', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { termStatistics: 'term_statistics', fieldStatistics: 'field_statistics', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function termvectorsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  let { method, body, index, id, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_termvectors'
  } else if ((index) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_termvectors' + '/' + encodeURIComponent(id)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_termvectors'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_termvectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = termvectorsApi


/***/ }),

/***/ 4864:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['lines_to_sample', 'line_merge_size_limit', 'timeout', 'charset', 'format', 'has_header_row', 'column_names', 'delimiter', 'quote', 'should_trim_fields', 'grok_pattern', 'timestamp_field', 'timestamp_format', 'explain', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { linesToSample: 'lines_to_sample', lineMergeSizeLimit: 'line_merge_size_limit', hasHeaderRow: 'has_header_row', columnNames: 'column_names', shouldTrimFields: 'should_trim_fields', grokPattern: 'grok_pattern', timestampField: 'timestamp_field', timestampFormat: 'timestamp_format', errorTrace: 'error_trace', filterPath: 'filter_path' }

function TextStructureApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

TextStructureApi.prototype.findStructure = function textStructureFindStructureApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_text_structure' + '/' + 'find_structure'

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(TextStructureApi.prototype, {
  find_structure: { get () { return this.findStructure } }
})

module.exports = TextStructureApi


/***/ }),

/***/ 3881:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['force', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'from', 'size', 'allow_no_match', 'exclude_generated', 'defer_validation', 'timeout', 'wait_for_completion', 'wait_for_checkpoint']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', allowNoMatch: 'allow_no_match', excludeGenerated: 'exclude_generated', deferValidation: 'defer_validation', waitForCompletion: 'wait_for_completion', waitForCheckpoint: 'wait_for_checkpoint' }

function TransformApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

TransformApi.prototype.deleteTransform = function transformDeleteTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.getTransform = function transformGetTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((transform_id || transformId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_transform'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.getTransformStats = function transformGetTransformStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.previewTransform = function transformPreviewTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + '_preview'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.putTransform = function transformPutTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.startTransform = function transformStartTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.stopTransform = function transformStopTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.updateTransform = function transformUpdateTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.transform_id == null && params.transformId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(TransformApi.prototype, {
  delete_transform: { get () { return this.deleteTransform } },
  get_transform: { get () { return this.getTransform } },
  get_transform_stats: { get () { return this.getTransformStats } },
  preview_transform: { get () { return this.previewTransform } },
  put_transform: { get () { return this.putTransform } },
  start_transform: { get () { return this.startTransform } },
  stop_transform: { get () { return this.stopTransform } },
  update_transform: { get () { return this.updateTransform } }
})

module.exports = TransformApi


/***/ }),

/***/ 8676:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'lang', 'refresh', 'retry_on_conflict', 'routing', 'timeout', 'if_seq_no', 'if_primary_term', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', retryOnConflict: 'retry_on_conflict', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params.body == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  let { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_update'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_update' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateApi


/***/ }),

/***/ 4651:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'default_operator', 'df', 'from', 'ignore_unavailable', 'allow_no_indices', 'conflicts', 'expand_wildcards', 'lenient', 'pipeline', 'preference', 'q', 'routing', 'scroll', 'search_type', 'search_timeout', 'size', 'max_docs', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'version', 'version_type', 'request_cache', 'refresh', 'timeout', 'wait_for_active_shards', 'scroll_size', 'wait_for_completion', 'requests_per_second', 'slices', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', searchTimeout: 'search_timeout', maxDocs: 'max_docs', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', versionType: 'version_type', requestCache: 'request_cache', waitForActiveShards: 'wait_for_active_shards', scrollSize: 'scroll_size', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateByQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.index == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params.type != null && (params.index == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  let { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_update_by_query'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_update_by_query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateByQueryApi


/***/ }),

/***/ 6879:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateByQueryRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.task_id == null && params.taskId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params.requests_per_second == null && params.requestsPerSecond == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  let { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_update_by_query' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateByQueryRethrottleApi


/***/ }),

/***/ 1085:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'debug', 'active', 'version', 'if_seq_no', 'if_primary_term', 'metric', 'emit_stacktraces']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', emitStacktraces: 'emit_stacktraces' }

function WatcherApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

WatcherApi.prototype.ackWatch = function watcherAckWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.watch_id == null && params.watchId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params.action_id != null || params.actionId != null) && ((params.watch_id == null && params.watchId == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: watch_id')
    return handleError(err, callback)
  }

  let { method, body, watchId, watch_id, actionId, action_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((watch_id || watchId) != null && (action_id || actionId) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_ack' + '/' + encodeURIComponent(action_id || actionId)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_ack'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.activateWatch = function watcherActivateWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.watch_id == null && params.watchId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  let { method, body, watchId, watch_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_activate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.deactivateWatch = function watcherDeactivateWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.watch_id == null && params.watchId == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  let { method, body, watchId, watch_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_deactivate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.deleteWatch = function watcherDeleteWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.executeWatch = function watcherExecuteWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id) + '/' + '_execute'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + '_execute'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.getWatch = function watcherGetWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.putWatch = function watcherPutWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params.id == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  let { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.queryWatches = function watcherQueryWatchesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_watcher' + '/' + '_query' + '/' + 'watches'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.start = function watcherStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_watcher' + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.stats = function watcherStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_watcher' + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_watcher' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.stop = function watcherStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'POST'
  path = '/' + '_watcher' + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(WatcherApi.prototype, {
  ack_watch: { get () { return this.ackWatch } },
  activate_watch: { get () { return this.activateWatch } },
  deactivate_watch: { get () { return this.deactivateWatch } },
  delete_watch: { get () { return this.deleteWatch } },
  execute_watch: { get () { return this.executeWatch } },
  get_watch: { get () { return this.getWatch } },
  put_watch: { get () { return this.putWatch } },
  query_watches: { get () { return this.queryWatches } }
})

module.exports = WatcherApi


/***/ }),

/***/ 4323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __nccwpck_require__(5230)
const acceptedQuerystring = ['categories', 'accept_enterprise', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'master_timeout']
const snakeCase = { acceptEnterprise: 'accept_enterprise', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout' }

function XpackApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

XpackApi.prototype.info = function xpackInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_xpack'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

XpackApi.prototype.usage = function xpackUsageApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  let { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  let path = ''
  if (method == null) method = 'GET'
  path = '/' + '_xpack' + '/' + 'usage'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = XpackApi


/***/ }),

/***/ 8608:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const AsyncSearchApi = __nccwpck_require__(6188)
const AutoscalingApi = __nccwpck_require__(3070)
const bulkApi = __nccwpck_require__(7630)
const CatApi = __nccwpck_require__(8887)
const CcrApi = __nccwpck_require__(9287)
const clearScrollApi = __nccwpck_require__(7259)
const closePointInTimeApi = __nccwpck_require__(3294)
const ClusterApi = __nccwpck_require__(6323)
const countApi = __nccwpck_require__(7944)
const createApi = __nccwpck_require__(3555)
const DanglingIndicesApi = __nccwpck_require__(8540)
const deleteApi = __nccwpck_require__(6080)
const deleteByQueryApi = __nccwpck_require__(2109)
const deleteByQueryRethrottleApi = __nccwpck_require__(2264)
const deleteScriptApi = __nccwpck_require__(3107)
const EnrichApi = __nccwpck_require__(6350)
const EqlApi = __nccwpck_require__(941)
const existsApi = __nccwpck_require__(1297)
const existsSourceApi = __nccwpck_require__(5602)
const explainApi = __nccwpck_require__(8941)
const FeaturesApi = __nccwpck_require__(8348)
const fieldCapsApi = __nccwpck_require__(7109)
const FleetApi = __nccwpck_require__(4366)
const getApi = __nccwpck_require__(7210)
const getScriptApi = __nccwpck_require__(6482)
const getScriptContextApi = __nccwpck_require__(8031)
const getScriptLanguagesApi = __nccwpck_require__(8681)
const getSourceApi = __nccwpck_require__(1488)
const GraphApi = __nccwpck_require__(6235)
const IlmApi = __nccwpck_require__(9790)
const indexApi = __nccwpck_require__(9835)
const IndicesApi = __nccwpck_require__(9820)
const infoApi = __nccwpck_require__(5188)
const IngestApi = __nccwpck_require__(5631)
const LicenseApi = __nccwpck_require__(1510)
const LogstashApi = __nccwpck_require__(521)
const mgetApi = __nccwpck_require__(3803)
const MigrationApi = __nccwpck_require__(8652)
const MlApi = __nccwpck_require__(842)
const MonitoringApi = __nccwpck_require__(9861)
const msearchApi = __nccwpck_require__(4757)
const msearchTemplateApi = __nccwpck_require__(1596)
const mtermvectorsApi = __nccwpck_require__(1240)
const NodesApi = __nccwpck_require__(7089)
const openPointInTimeApi = __nccwpck_require__(923)
const pingApi = __nccwpck_require__(4539)
const putScriptApi = __nccwpck_require__(2321)
const rankEvalApi = __nccwpck_require__(683)
const reindexApi = __nccwpck_require__(8919)
const reindexRethrottleApi = __nccwpck_require__(643)
const renderSearchTemplateApi = __nccwpck_require__(9252)
const RollupApi = __nccwpck_require__(5711)
const scriptsPainlessExecuteApi = __nccwpck_require__(9064)
const scrollApi = __nccwpck_require__(3432)
const searchApi = __nccwpck_require__(1974)
const searchMvtApi = __nccwpck_require__(8241)
const searchShardsApi = __nccwpck_require__(1434)
const searchTemplateApi = __nccwpck_require__(9874)
const SearchableSnapshotsApi = __nccwpck_require__(2240)
const SecurityApi = __nccwpck_require__(9457)
const ShutdownApi = __nccwpck_require__(5991)
const SlmApi = __nccwpck_require__(1395)
const SnapshotApi = __nccwpck_require__(3536)
const SqlApi = __nccwpck_require__(8150)
const SslApi = __nccwpck_require__(6805)
const TasksApi = __nccwpck_require__(8917)
const termsEnumApi = __nccwpck_require__(887)
const termvectorsApi = __nccwpck_require__(1796)
const TextStructureApi = __nccwpck_require__(4864)
const TransformApi = __nccwpck_require__(3881)
const updateApi = __nccwpck_require__(8676)
const updateByQueryApi = __nccwpck_require__(4651)
const updateByQueryRethrottleApi = __nccwpck_require__(6879)
const WatcherApi = __nccwpck_require__(1085)
const XpackApi = __nccwpck_require__(4323)

const { kConfigurationError } = __nccwpck_require__(5230)
const kAsyncSearch = Symbol('AsyncSearch')
const kAutoscaling = Symbol('Autoscaling')
const kCat = Symbol('Cat')
const kCcr = Symbol('Ccr')
const kCluster = Symbol('Cluster')
const kDanglingIndices = Symbol('DanglingIndices')
const kEnrich = Symbol('Enrich')
const kEql = Symbol('Eql')
const kFeatures = Symbol('Features')
const kFleet = Symbol('Fleet')
const kGraph = Symbol('Graph')
const kIlm = Symbol('Ilm')
const kIndices = Symbol('Indices')
const kIngest = Symbol('Ingest')
const kLicense = Symbol('License')
const kLogstash = Symbol('Logstash')
const kMigration = Symbol('Migration')
const kMl = Symbol('Ml')
const kMonitoring = Symbol('Monitoring')
const kNodes = Symbol('Nodes')
const kRollup = Symbol('Rollup')
const kSearchableSnapshots = Symbol('SearchableSnapshots')
const kSecurity = Symbol('Security')
const kShutdown = Symbol('Shutdown')
const kSlm = Symbol('Slm')
const kSnapshot = Symbol('Snapshot')
const kSql = Symbol('Sql')
const kSsl = Symbol('Ssl')
const kTasks = Symbol('Tasks')
const kTextStructure = Symbol('TextStructure')
const kTransform = Symbol('Transform')
const kWatcher = Symbol('Watcher')
const kXpack = Symbol('Xpack')

function ESAPI (opts) {
  this[kConfigurationError] = opts.ConfigurationError
  this[kAsyncSearch] = null
  this[kAutoscaling] = null
  this[kCat] = null
  this[kCcr] = null
  this[kCluster] = null
  this[kDanglingIndices] = null
  this[kEnrich] = null
  this[kEql] = null
  this[kFeatures] = null
  this[kFleet] = null
  this[kGraph] = null
  this[kIlm] = null
  this[kIndices] = null
  this[kIngest] = null
  this[kLicense] = null
  this[kLogstash] = null
  this[kMigration] = null
  this[kMl] = null
  this[kMonitoring] = null
  this[kNodes] = null
  this[kRollup] = null
  this[kSearchableSnapshots] = null
  this[kSecurity] = null
  this[kShutdown] = null
  this[kSlm] = null
  this[kSnapshot] = null
  this[kSql] = null
  this[kSsl] = null
  this[kTasks] = null
  this[kTextStructure] = null
  this[kTransform] = null
  this[kWatcher] = null
  this[kXpack] = null
}

ESAPI.prototype.bulk = bulkApi
ESAPI.prototype.clearScroll = clearScrollApi
ESAPI.prototype.closePointInTime = closePointInTimeApi
ESAPI.prototype.count = countApi
ESAPI.prototype.create = createApi
ESAPI.prototype.delete = deleteApi
ESAPI.prototype.deleteByQuery = deleteByQueryApi
ESAPI.prototype.deleteByQueryRethrottle = deleteByQueryRethrottleApi
ESAPI.prototype.deleteScript = deleteScriptApi
ESAPI.prototype.exists = existsApi
ESAPI.prototype.existsSource = existsSourceApi
ESAPI.prototype.explain = explainApi
ESAPI.prototype.fieldCaps = fieldCapsApi
ESAPI.prototype.get = getApi
ESAPI.prototype.getScript = getScriptApi
ESAPI.prototype.getScriptContext = getScriptContextApi
ESAPI.prototype.getScriptLanguages = getScriptLanguagesApi
ESAPI.prototype.getSource = getSourceApi
ESAPI.prototype.index = indexApi
ESAPI.prototype.info = infoApi
ESAPI.prototype.mget = mgetApi
ESAPI.prototype.msearch = msearchApi
ESAPI.prototype.msearchTemplate = msearchTemplateApi
ESAPI.prototype.mtermvectors = mtermvectorsApi
ESAPI.prototype.openPointInTime = openPointInTimeApi
ESAPI.prototype.ping = pingApi
ESAPI.prototype.putScript = putScriptApi
ESAPI.prototype.rankEval = rankEvalApi
ESAPI.prototype.reindex = reindexApi
ESAPI.prototype.reindexRethrottle = reindexRethrottleApi
ESAPI.prototype.renderSearchTemplate = renderSearchTemplateApi
ESAPI.prototype.scriptsPainlessExecute = scriptsPainlessExecuteApi
ESAPI.prototype.scroll = scrollApi
ESAPI.prototype.search = searchApi
ESAPI.prototype.searchMvt = searchMvtApi
ESAPI.prototype.searchShards = searchShardsApi
ESAPI.prototype.searchTemplate = searchTemplateApi
ESAPI.prototype.termsEnum = termsEnumApi
ESAPI.prototype.termvectors = termvectorsApi
ESAPI.prototype.update = updateApi
ESAPI.prototype.updateByQuery = updateByQueryApi
ESAPI.prototype.updateByQueryRethrottle = updateByQueryRethrottleApi

Object.defineProperties(ESAPI.prototype, {
  asyncSearch: {
    get () {
      if (this[kAsyncSearch] === null) {
        this[kAsyncSearch] = new AsyncSearchApi(this.transport, this[kConfigurationError])
      }
      return this[kAsyncSearch]
    }
  },
  async_search: { get () { return this.asyncSearch } },
  autoscaling: {
    get () {
      if (this[kAutoscaling] === null) {
        this[kAutoscaling] = new AutoscalingApi(this.transport, this[kConfigurationError])
      }
      return this[kAutoscaling]
    }
  },
  cat: {
    get () {
      if (this[kCat] === null) {
        this[kCat] = new CatApi(this.transport, this[kConfigurationError])
      }
      return this[kCat]
    }
  },
  ccr: {
    get () {
      if (this[kCcr] === null) {
        this[kCcr] = new CcrApi(this.transport, this[kConfigurationError])
      }
      return this[kCcr]
    }
  },
  clear_scroll: { get () { return this.clearScroll } },
  close_point_in_time: { get () { return this.closePointInTime } },
  cluster: {
    get () {
      if (this[kCluster] === null) {
        this[kCluster] = new ClusterApi(this.transport, this[kConfigurationError])
      }
      return this[kCluster]
    }
  },
  danglingIndices: {
    get () {
      if (this[kDanglingIndices] === null) {
        this[kDanglingIndices] = new DanglingIndicesApi(this.transport, this[kConfigurationError])
      }
      return this[kDanglingIndices]
    }
  },
  dangling_indices: { get () { return this.danglingIndices } },
  delete_by_query: { get () { return this.deleteByQuery } },
  delete_by_query_rethrottle: { get () { return this.deleteByQueryRethrottle } },
  delete_script: { get () { return this.deleteScript } },
  enrich: {
    get () {
      if (this[kEnrich] === null) {
        this[kEnrich] = new EnrichApi(this.transport, this[kConfigurationError])
      }
      return this[kEnrich]
    }
  },
  eql: {
    get () {
      if (this[kEql] === null) {
        this[kEql] = new EqlApi(this.transport, this[kConfigurationError])
      }
      return this[kEql]
    }
  },
  exists_source: { get () { return this.existsSource } },
  features: {
    get () {
      if (this[kFeatures] === null) {
        this[kFeatures] = new FeaturesApi(this.transport, this[kConfigurationError])
      }
      return this[kFeatures]
    }
  },
  field_caps: { get () { return this.fieldCaps } },
  fleet: {
    get () {
      if (this[kFleet] === null) {
        this[kFleet] = new FleetApi(this.transport, this[kConfigurationError])
      }
      return this[kFleet]
    }
  },
  get_script: { get () { return this.getScript } },
  get_script_context: { get () { return this.getScriptContext } },
  get_script_languages: { get () { return this.getScriptLanguages } },
  get_source: { get () { return this.getSource } },
  graph: {
    get () {
      if (this[kGraph] === null) {
        this[kGraph] = new GraphApi(this.transport, this[kConfigurationError])
      }
      return this[kGraph]
    }
  },
  ilm: {
    get () {
      if (this[kIlm] === null) {
        this[kIlm] = new IlmApi(this.transport, this[kConfigurationError])
      }
      return this[kIlm]
    }
  },
  indices: {
    get () {
      if (this[kIndices] === null) {
        this[kIndices] = new IndicesApi(this.transport, this[kConfigurationError])
      }
      return this[kIndices]
    }
  },
  ingest: {
    get () {
      if (this[kIngest] === null) {
        this[kIngest] = new IngestApi(this.transport, this[kConfigurationError])
      }
      return this[kIngest]
    }
  },
  license: {
    get () {
      if (this[kLicense] === null) {
        this[kLicense] = new LicenseApi(this.transport, this[kConfigurationError])
      }
      return this[kLicense]
    }
  },
  logstash: {
    get () {
      if (this[kLogstash] === null) {
        this[kLogstash] = new LogstashApi(this.transport, this[kConfigurationError])
      }
      return this[kLogstash]
    }
  },
  migration: {
    get () {
      if (this[kMigration] === null) {
        this[kMigration] = new MigrationApi(this.transport, this[kConfigurationError])
      }
      return this[kMigration]
    }
  },
  ml: {
    get () {
      if (this[kMl] === null) {
        this[kMl] = new MlApi(this.transport, this[kConfigurationError])
      }
      return this[kMl]
    }
  },
  monitoring: {
    get () {
      if (this[kMonitoring] === null) {
        this[kMonitoring] = new MonitoringApi(this.transport, this[kConfigurationError])
      }
      return this[kMonitoring]
    }
  },
  msearch_template: { get () { return this.msearchTemplate } },
  nodes: {
    get () {
      if (this[kNodes] === null) {
        this[kNodes] = new NodesApi(this.transport, this[kConfigurationError])
      }
      return this[kNodes]
    }
  },
  open_point_in_time: { get () { return this.openPointInTime } },
  put_script: { get () { return this.putScript } },
  rank_eval: { get () { return this.rankEval } },
  reindex_rethrottle: { get () { return this.reindexRethrottle } },
  render_search_template: { get () { return this.renderSearchTemplate } },
  rollup: {
    get () {
      if (this[kRollup] === null) {
        this[kRollup] = new RollupApi(this.transport, this[kConfigurationError])
      }
      return this[kRollup]
    }
  },
  scripts_painless_execute: { get () { return this.scriptsPainlessExecute } },
  search_mvt: { get () { return this.searchMvt } },
  search_shards: { get () { return this.searchShards } },
  search_template: { get () { return this.searchTemplate } },
  searchableSnapshots: {
    get () {
      if (this[kSearchableSnapshots] === null) {
        this[kSearchableSnapshots] = new SearchableSnapshotsApi(this.transport, this[kConfigurationError])
      }
      return this[kSearchableSnapshots]
    }
  },
  searchable_snapshots: { get () { return this.searchableSnapshots } },
  security: {
    get () {
      if (this[kSecurity] === null) {
        this[kSecurity] = new SecurityApi(this.transport, this[kConfigurationError])
      }
      return this[kSecurity]
    }
  },
  shutdown: {
    get () {
      if (this[kShutdown] === null) {
        this[kShutdown] = new ShutdownApi(this.transport, this[kConfigurationError])
      }
      return this[kShutdown]
    }
  },
  slm: {
    get () {
      if (this[kSlm] === null) {
        this[kSlm] = new SlmApi(this.transport, this[kConfigurationError])
      }
      return this[kSlm]
    }
  },
  snapshot: {
    get () {
      if (this[kSnapshot] === null) {
        this[kSnapshot] = new SnapshotApi(this.transport, this[kConfigurationError])
      }
      return this[kSnapshot]
    }
  },
  sql: {
    get () {
      if (this[kSql] === null) {
        this[kSql] = new SqlApi(this.transport, this[kConfigurationError])
      }
      return this[kSql]
    }
  },
  ssl: {
    get () {
      if (this[kSsl] === null) {
        this[kSsl] = new SslApi(this.transport, this[kConfigurationError])
      }
      return this[kSsl]
    }
  },
  tasks: {
    get () {
      if (this[kTasks] === null) {
        this[kTasks] = new TasksApi(this.transport, this[kConfigurationError])
      }
      return this[kTasks]
    }
  },
  terms_enum: { get () { return this.termsEnum } },
  textStructure: {
    get () {
      if (this[kTextStructure] === null) {
        this[kTextStructure] = new TextStructureApi(this.transport, this[kConfigurationError])
      }
      return this[kTextStructure]
    }
  },
  text_structure: { get () { return this.textStructure } },
  transform: {
    get () {
      if (this[kTransform] === null) {
        this[kTransform] = new TransformApi(this.transport, this[kConfigurationError])
      }
      return this[kTransform]
    }
  },
  update_by_query: { get () { return this.updateByQuery } },
  update_by_query_rethrottle: { get () { return this.updateByQueryRethrottle } },
  watcher: {
    get () {
      if (this[kWatcher] === null) {
        this[kWatcher] = new WatcherApi(this.transport, this[kConfigurationError])
      }
      return this[kWatcher]
    }
  },
  xpack: {
    get () {
      if (this[kXpack] === null) {
        this[kXpack] = new XpackApi(this.transport, this[kConfigurationError])
      }
      return this[kXpack]
    }
  }
})

module.exports = ESAPI


/***/ }),

/***/ 5230:
/***/ ((module) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const result = { body: null, statusCode: null, headers: null, warnings: null }
const kConfigurationError = Symbol('configuration error')

function handleError (err, callback) {
  if (callback) {
    process.nextTick(callback, err, result)
    return { then: noop, catch: noop, abort: noop }
  }
  return Promise.reject(err)
}

function snakeCaseKeys (acceptedQuerystring, snakeCase, querystring) {
  const target = {}
  const keys = Object.keys(querystring)
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    target[snakeCase[key] || key] = querystring[key]
  }
  return target
}

function normalizeArguments (params, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (typeof params === 'function' || params == null) {
    callback = params
    params = {}
    options = {}
  }
  return [params, options, callback]
}

function noop () {}

module.exports = { handleError, snakeCaseKeys, normalizeArguments, noop, kConfigurationError }


/***/ }),

/***/ 2294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const { EventEmitter } = __nccwpck_require__(8614)
const { URL } = __nccwpck_require__(8835)
const debug = __nccwpck_require__(8237)('elasticsearch')
const Transport = __nccwpck_require__(7027)
const Connection = __nccwpck_require__(5613)
const { ConnectionPool, CloudConnectionPool } = __nccwpck_require__(3911)
const Helpers = __nccwpck_require__(4505)
const Serializer = __nccwpck_require__(2697)
const errors = __nccwpck_require__(5372)
const { ConfigurationError } = errors
const { prepareHeaders } = Connection.internals
let clientVersion = __nccwpck_require__(7529)/* .version */ .i8
/* istanbul ignore next */
if (clientVersion.includes('-')) {
  // clean prerelease
  clientVersion = clientVersion.slice(0, clientVersion.indexOf('-')) + 'p'
}
const nodeVersion = process.versions.node

const kInitialOptions = Symbol('elasticsearchjs-initial-options')
const kChild = Symbol('elasticsearchjs-child')
const kExtensions = Symbol('elasticsearchjs-extensions')
const kEventEmitter = Symbol('elasticsearchjs-event-emitter')

const ESAPI = __nccwpck_require__(8608)

class Client extends ESAPI {
  constructor (opts = {}) {
    super({ ConfigurationError })
    if (opts.cloud && opts[kChild] === undefined) {
      const { id, username, password } = opts.cloud
      // the cloud id is `cluster-name:base64encodedurl`
      // the url is a string divided by two '$', the first is the cloud url
      // the second the elasticsearch instance, the third the kibana instance
      const cloudUrls = Buffer.from(id.split(':')[1], 'base64').toString().split('$')

      // TODO: remove username and password here in 8
      if (username && password) {
        opts.auth = Object.assign({}, opts.auth, { username, password })
      }
      opts.node = `https://${cloudUrls[1]}.${cloudUrls[0]}`

      // Cloud has better performances with compression enabled
      // see https://github.com/elastic/elasticsearch-py/pull/704.
      // So unless the user specifies otherwise, we enable compression.
      if (opts.compression == null) opts.compression = 'gzip'
      if (opts.suggestCompression == null) opts.suggestCompression = true
      if (opts.ssl == null ||
         (opts.ssl && opts.ssl.secureProtocol == null)) {
        opts.ssl = opts.ssl || {}
        opts.ssl.secureProtocol = 'TLSv1_2_method'
      }
    }

    if (!opts.node && !opts.nodes) {
      throw new ConfigurationError('Missing node(s) option')
    }

    if (opts[kChild] === undefined) {
      const checkAuth = getAuth(opts.node || opts.nodes)
      if (checkAuth && checkAuth.username && checkAuth.password) {
        opts.auth = Object.assign({}, opts.auth, { username: checkAuth.username, password: checkAuth.password })
      }
    }

    const options = opts[kChild] !== undefined
      ? opts[kChild].initialOptions
      : Object.assign({}, {
        Connection,
        Transport,
        Serializer,
        ConnectionPool: opts.cloud ? CloudConnectionPool : ConnectionPool,
        maxRetries: 3,
        requestTimeout: 30000,
        pingTimeout: 3000,
        sniffInterval: false,
        sniffOnStart: false,
        sniffEndpoint: '_nodes/_all/http',
        sniffOnConnectionFault: false,
        resurrectStrategy: 'ping',
        suggestCompression: false,
        compression: false,
        ssl: null,
        caFingerprint: null,
        agent: null,
        headers: {},
        nodeFilter: null,
        nodeSelector: 'round-robin',
        generateRequestId: null,
        name: 'elasticsearch-js',
        auth: null,
        opaqueIdPrefix: null,
        context: null,
        proxy: null,
        enableMetaHeader: true,
        disablePrototypePoisoningProtection: false
      }, opts)

    if (options.caFingerprint !== null && isHttpConnection(opts.node || opts.nodes)) {
      throw new ConfigurationError('You can\'t configure the caFingerprint with a http connection')
    }

    if (process.env.ELASTIC_CLIENT_APIVERSIONING === 'true') {
      options.headers = Object.assign({ accept: 'application/vnd.elasticsearch+json; compatible-with=7' }, options.headers)
    }

    this[kInitialOptions] = options
    this[kExtensions] = []
    this.name = options.name

    if (options.enableMetaHeader) {
      options.headers['x-elastic-client-meta'] = `es=${clientVersion},js=${nodeVersion},t=${clientVersion},hc=${nodeVersion}`
    }

    if (opts[kChild] !== undefined) {
      this.serializer = options[kChild].serializer
      this.connectionPool = options[kChild].connectionPool
      this[kEventEmitter] = options[kChild].eventEmitter
    } else {
      this[kEventEmitter] = new EventEmitter()
      this.serializer = new options.Serializer({
        disablePrototypePoisoningProtection: options.disablePrototypePoisoningProtection
      })
      this.connectionPool = new options.ConnectionPool({
        pingTimeout: options.pingTimeout,
        resurrectStrategy: options.resurrectStrategy,
        ssl: options.ssl,
        agent: options.agent,
        proxy: options.proxy,
        Connection: options.Connection,
        auth: options.auth,
        emit: this[kEventEmitter].emit.bind(this[kEventEmitter]),
        caFingerprint: options.caFingerprint,
        sniffEnabled: options.sniffInterval !== false ||
                      options.sniffOnStart !== false ||
                      options.sniffOnConnectionFault !== false
      })
      // Add the connections before initialize the Transport
      this.connectionPool.addConnection(options.node || options.nodes)
    }

    this.transport = new options.Transport({
      emit: this[kEventEmitter].emit.bind(this[kEventEmitter]),
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      maxRetries: options.maxRetries,
      requestTimeout: options.requestTimeout,
      sniffInterval: options.sniffInterval,
      sniffOnStart: options.sniffOnStart,
      sniffOnConnectionFault: options.sniffOnConnectionFault,
      sniffEndpoint: options.sniffEndpoint,
      suggestCompression: options.suggestCompression,
      compression: options.compression,
      headers: options.headers,
      nodeFilter: options.nodeFilter,
      nodeSelector: options.nodeSelector,
      generateRequestId: options.generateRequestId,
      name: options.name,
      opaqueIdPrefix: options.opaqueIdPrefix,
      context: options.context
    })

    this.helpers = new Helpers({
      client: this,
      maxRetries: options.maxRetries,
      metaHeader: options.enableMetaHeader
        ? `es=${clientVersion},js=${nodeVersion},t=${clientVersion},hc=${nodeVersion}`
        : null
    })
  }

  get emit () {
    return this[kEventEmitter].emit.bind(this[kEventEmitter])
  }

  get on () {
    return this[kEventEmitter].on.bind(this[kEventEmitter])
  }

  get once () {
    return this[kEventEmitter].once.bind(this[kEventEmitter])
  }

  get off () {
    return this[kEventEmitter].off.bind(this[kEventEmitter])
  }

  extend (name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }

    let [namespace, method] = name.split('.')
    if (method == null) {
      method = namespace
      namespace = null
    }

    if (namespace != null) {
      if (this[namespace] != null && this[namespace][method] != null && opts.force !== true) {
        throw new Error(`The method "${method}" already exists on namespace "${namespace}"`)
      }

      if (this[namespace] == null) this[namespace] = {}
      this[namespace][method] = fn({
        makeRequest: this.transport.request.bind(this.transport),
        result: { body: null, statusCode: null, headers: null, warnings: null },
        ConfigurationError
      })
    } else {
      if (this[method] != null && opts.force !== true) {
        throw new Error(`The method "${method}" already exists`)
      }

      this[method] = fn({
        makeRequest: this.transport.request.bind(this.transport),
        result: { body: null, statusCode: null, headers: null, warnings: null },
        ConfigurationError
      })
    }

    this[kExtensions].push({ name, opts, fn })
  }

  child (opts) {
    // Merge the new options with the initial ones
    const options = Object.assign({}, this[kInitialOptions], opts)
    // Pass to the child client the parent instances that cannot be overriden
    options[kChild] = {
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      eventEmitter: this[kEventEmitter],
      initialOptions: options
    }

    /* istanbul ignore else */
    if (options.auth !== undefined) {
      options.headers = prepareHeaders(options.headers, options.auth)
    }

    const client = new Client(options)
    // sync product check
    const tSymbol = Object.getOwnPropertySymbols(this.transport)
      .filter(symbol => symbol.description === 'product check')[0]
    client.transport[tSymbol] = this.transport[tSymbol]
    // Add parent extensions
    if (this[kExtensions].length > 0) {
      this[kExtensions].forEach(({ name, opts, fn }) => {
        client.extend(name, opts, fn)
      })
    }
    return client
  }

  close (callback) {
    if (callback == null) {
      return new Promise((resolve, reject) => {
        this.close(resolve)
      })
    }
    debug('Closing the client')
    this.connectionPool.empty(callback)
  }
}

function getAuth (node) {
  if (Array.isArray(node)) {
    for (const url of node) {
      const auth = getUsernameAndPassword(url)
      if (auth.username !== '' && auth.password !== '') {
        return auth
      }
    }

    return null
  }

  const auth = getUsernameAndPassword(node)
  if (auth.username !== '' && auth.password !== '') {
    return auth
  }

  return null

  function getUsernameAndPassword (node) {
    /* istanbul ignore else */
    if (typeof node === 'string') {
      const { username, password } = new URL(node)
      return {
        username: decodeURIComponent(username),
        password: decodeURIComponent(password)
      }
    } else if (node.url instanceof URL) {
      return {
        username: decodeURIComponent(node.url.username),
        password: decodeURIComponent(node.url.password)
      }
    }
  }
}

function isHttpConnection (node) {
  if (Array.isArray(node)) {
    return node.some((n) => (typeof n === 'string' ? new URL(n).protocol : n.url.protocol) === 'http:')
  } else {
    return (typeof node === 'string' ? new URL(node).protocol : node.url.protocol) === 'http:'
  }
}

const events = {
  RESPONSE: 'response',
  REQUEST: 'request',
  SNIFF: 'sniff',
  RESURRECT: 'resurrect',
  SERIALIZATION: 'serialization',
  DESERIALIZATION: 'deserialization'
}

module.exports = {
  Client,
  Transport,
  ConnectionPool,
  Connection,
  Serializer,
  events,
  errors
}


/***/ }),

/***/ 5613:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const assert = __nccwpck_require__(2357)
const { inspect } = __nccwpck_require__(1669)
const hpagent = __nccwpck_require__(4585)
const http = __nccwpck_require__(8605)
const https = __nccwpck_require__(7211)
const debug = __nccwpck_require__(8237)('elasticsearch')
const { pipeline } = __nccwpck_require__(2413)
const INVALID_PATH_REGEX = /[^\u0021-\u00ff]/
const {
  ConnectionError,
  RequestAbortedError,
  TimeoutError,
  ConfigurationError
} = __nccwpck_require__(5372)

class Connection {
  constructor (opts) {
    this.url = opts.url
    this.ssl = opts.ssl || null
    this.id = opts.id || stripAuth(opts.url.href)
    this.headers = prepareHeaders(opts.headers, opts.auth)
    this.deadCount = 0
    this.resurrectTimeout = 0
    this.caFingerprint = opts.caFingerprint

    this._openRequests = 0
    this._status = opts.status || Connection.statuses.ALIVE
    this.roles = Object.assign({}, defaultRoles, opts.roles)

    if (!['http:', 'https:'].includes(this.url.protocol)) {
      throw new ConfigurationError(`Invalid protocol: '${this.url.protocol}'`)
    }

    if (typeof opts.agent === 'function') {
      this.agent = opts.agent(opts)
    } else if (opts.agent === false) {
      this.agent = undefined
    } else {
      const agentOptions = Object.assign({}, {
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: 'lifo'
      }, opts.agent)
      if (opts.proxy) {
        agentOptions.proxy = opts.proxy
        this.agent = this.url.protocol === 'http:'
          ? new hpagent.HttpProxyAgent(agentOptions)
          : new hpagent.HttpsProxyAgent(Object.assign({}, agentOptions, this.ssl))
      } else {
        this.agent = this.url.protocol === 'http:'
          ? new http.Agent(agentOptions)
          : new https.Agent(Object.assign({}, agentOptions, this.ssl))
      }
    }

    this.makeRequest = this.url.protocol === 'http:'
      ? http.request
      : https.request
  }

  request (params, callback) {
    this._openRequests++
    let cleanedListeners = false

    const requestParams = this.buildRequestObject(params)
    // https://github.com/nodejs/node/commit/b961d9fd83
    if (INVALID_PATH_REGEX.test(requestParams.path) === true) {
      callback(new TypeError(`ERR_UNESCAPED_CHARACTERS: ${requestParams.path}`), null)
      /* istanbul ignore next */
      return { abort: () => {} }
    }

    debug('Starting a new request', params)
    const request = this.makeRequest(requestParams)

    const onResponse = response => {
      cleanListeners()
      this._openRequests--
      callback(null, response)
    }

    const onTimeout = () => {
      cleanListeners()
      this._openRequests--
      request.once('error', () => {}) // we need to catch the request aborted error
      request.abort()
      callback(new TimeoutError('Request timed out', params), null)
    }

    const onError = err => {
      cleanListeners()
      this._openRequests--
      callback(new ConnectionError(err.message), null)
    }

    const onAbort = () => {
      cleanListeners()
      request.once('error', () => {}) // we need to catch the request aborted error
      debug('Request aborted', params)
      this._openRequests--
      callback(new RequestAbortedError(), null)
    }

    const onSocket = socket => {
      /* istanbul ignore else */
      if (!socket.isSessionReused()) {
        socket.once('secureConnect', () => {
          const issuerCertificate = getIssuerCertificate(socket)
          /* istanbul ignore next */
          if (issuerCertificate == null) {
            onError(new Error('Invalid or malformed certificate'))
            request.once('error', () => {}) // we need to catch the request aborted error
            return request.abort()
          }

          // Check if fingerprint matches
          /* istanbul ignore else */
          if (this.caFingerprint !== issuerCertificate.fingerprint256) {
            onError(new Error('Server certificate CA fingerprint does not match the value configured in caFingerprint'))
            request.once('error', () => {}) // we need to catch the request aborted error
            return request.abort()
          }
        })
      }
    }

    request.on('response', onResponse)
    request.on('timeout', onTimeout)
    request.on('error', onError)
    request.on('abort', onAbort)
    if (this.caFingerprint != null) {
      request.on('socket', onSocket)
    }

    // Disables the Nagle algorithm
    request.setNoDelay(true)

    // starts the request
    if (isStream(params.body) === true) {
      pipeline(params.body, request, err => {
        /* istanbul ignore if  */
        if (err != null && cleanedListeners === false) {
          cleanListeners()
          this._openRequests--
          callback(err, null)
        }
      })
    } else {
      request.end(params.body)
    }

    return request

    function cleanListeners () {
      request.removeListener('response', onResponse)
      request.removeListener('timeout', onTimeout)
      request.removeListener('error', onError)
      request.removeListener('abort', onAbort)
      request.removeListener('socket', onSocket)
      cleanedListeners = true
    }
  }

  // TODO: write a better closing logic
  close (callback = () => {}) {
    debug('Closing connection', this.id)
    if (this._openRequests > 0) {
      setTimeout(() => this.close(callback), 1000)
    } else {
      if (this.agent !== undefined) {
        this.agent.destroy()
      }
      callback()
    }
  }

  setRole (role, enabled) {
    if (validRoles.indexOf(role) === -1) {
      throw new ConfigurationError(`Unsupported role: '${role}'`)
    }
    if (typeof enabled !== 'boolean') {
      throw new ConfigurationError('enabled should be a boolean')
    }

    this.roles[role] = enabled
    return this
  }

  get status () {
    return this._status
  }

  set status (status) {
    assert(
      ~validStatuses.indexOf(status),
      `Unsupported status: '${status}'`
    )
    this._status = status
  }

  buildRequestObject (params) {
    const url = this.url
    const request = {
      protocol: url.protocol,
      hostname: url.hostname[0] === '['
        ? url.hostname.slice(1, -1)
        : url.hostname,
      hash: url.hash,
      search: url.search,
      pathname: url.pathname,
      path: '',
      href: url.href,
      origin: url.origin,
      // https://github.com/elastic/elasticsearch-js/issues/843
      port: url.port !== '' ? url.port : undefined,
      headers: this.headers,
      agent: this.agent
    }

    const paramsKeys = Object.keys(params)
    for (let i = 0, len = paramsKeys.length; i < len; i++) {
      const key = paramsKeys[i]
      if (key === 'path') {
        request.pathname = resolve(request.pathname, params[key])
      } else if (key === 'querystring' && !!params[key] === true) {
        if (request.search === '') {
          request.search = '?' + params[key]
        } else {
          request.search += '&' + params[key]
        }
      } else if (key === 'headers') {
        request.headers = Object.assign({}, request.headers, params.headers)
      } else {
        request[key] = params[key]
      }
    }

    request.path = request.pathname + request.search

    return request
  }

  // Handles console.log and utils.inspect invocations.
  // We want to hide `auth`, `agent` and `ssl` since they made
  // the logs very hard to read. The user can still
  // access them with `instance.agent` and `instance.ssl`.
  [inspect.custom] (depth, options) {
    const {
      authorization,
      ...headers
    } = this.headers

    return {
      url: stripAuth(this.url.toString()),
      id: this.id,
      headers,
      deadCount: this.deadCount,
      resurrectTimeout: this.resurrectTimeout,
      _openRequests: this._openRequests,
      status: this.status,
      roles: this.roles
    }
  }

  toJSON () {
    const {
      authorization,
      ...headers
    } = this.headers

    return {
      url: stripAuth(this.url.toString()),
      id: this.id,
      headers,
      deadCount: this.deadCount,
      resurrectTimeout: this.resurrectTimeout,
      _openRequests: this._openRequests,
      status: this.status,
      roles: this.roles
    }
  }
}

Connection.statuses = {
  ALIVE: 'alive',
  DEAD: 'dead'
}

Connection.roles = {
  MASTER: 'master',
  DATA: 'data',
  INGEST: 'ingest',
  ML: 'ml'
}

const defaultRoles = {
  [Connection.roles.MASTER]: true,
  [Connection.roles.DATA]: true,
  [Connection.roles.INGEST]: true,
  [Connection.roles.ML]: false
}

const validStatuses = Object.keys(Connection.statuses)
  .map(k => Connection.statuses[k])
const validRoles = Object.keys(Connection.roles)
  .map(k => Connection.roles[k])

function stripAuth (url) {
  if (url.indexOf('@') === -1) return url
  return url.slice(0, url.indexOf('//') + 2) + url.slice(url.indexOf('@') + 1)
}

function isStream (obj) {
  return obj != null && typeof obj.pipe === 'function'
}

function resolve (host, path) {
  const hostEndWithSlash = host[host.length - 1] === '/'
  const pathStartsWithSlash = path[0] === '/'

  if (hostEndWithSlash === true && pathStartsWithSlash === true) {
    return host + path.slice(1)
  } else if (hostEndWithSlash !== pathStartsWithSlash) {
    return host + path
  } else {
    return host + '/' + path
  }
}

function prepareHeaders (headers = {}, auth) {
  if (auth != null && headers.authorization == null) {
    /* istanbul ignore else */
    if (auth.apiKey) {
      if (typeof auth.apiKey === 'object') {
        headers.authorization = 'ApiKey ' + Buffer.from(`${auth.apiKey.id}:${auth.apiKey.api_key}`).toString('base64')
      } else {
        headers.authorization = `ApiKey ${auth.apiKey}`
      }
    } else if (auth.bearer) {
      headers.authorization = `Bearer ${auth.bearer}`
    } else if (auth.username && auth.password) {
      headers.authorization = 'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
    }
  }
  return headers
}

function getIssuerCertificate (socket) {
  let certificate = socket.getPeerCertificate(true)
  while (certificate && Object.keys(certificate).length > 0) {
    // invalid certificate
    if (certificate.issuerCertificate == null) {
      return null
    }

    // We have reached the root certificate.
    // In case of self-signed certificates, `issuerCertificate` may be a circular reference.
    if (certificate.fingerprint256 === certificate.issuerCertificate.fingerprint256) {
      break
    }

    // continue the loop
    certificate = certificate.issuerCertificate
  }
  return certificate
}

module.exports = Connection
module.exports.internals = { prepareHeaders, getIssuerCertificate }


/***/ }),

/***/ 4505:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */

const { Readable } = __nccwpck_require__(2413)
const { promisify } = __nccwpck_require__(1669)
const { ResponseError, ConfigurationError } = __nccwpck_require__(5372)

const pImmediate = promisify(setImmediate)
const sleep = promisify(setTimeout)
const kClient = Symbol('elasticsearch-client')
const kMetaHeader = Symbol('meta header')
/* istanbul ignore next */
const noop = () => {}

class Helpers {
  constructor (opts) {
    this[kClient] = opts.client
    this[kMetaHeader] = opts.metaHeader
    this.maxRetries = opts.maxRetries
  }

  /**
   * Runs a search operation. The only difference between client.search and this utility,
   * is that we are only returning the hits to the user and not the full ES response.
   * This helper automatically adds `filter_path=hits.hits._source` to the querystring,
   * as it will only need the documents source.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {array} The documents that matched the request.
   */
  async search (params, options) {
    appendFilterPath('hits.hits._source', params, true)
    const { body } = await this[kClient].search(params, options)
    if (body.hits && body.hits.hits) {
      return body.hits.hits.map(d => d._source)
    }
    return []
  }

  /**
   * Runs a scroll search operation. This function returns an async iterator, allowing
   * the user to use a for await loop to get all the results of a given search.
   * ```js
   * for await (const result of client.helpers.scrollSearch({ params })) {
   *   console.log(result)
   * }
   * ```
   * Each result represents the entire body of a single scroll search request,
   * if you just need to scroll the results, use scrollDocuments.
   * This function handles automatically retries on 429 status code.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {iterator} the async iterator
   */
  async * scrollSearch (params, options = {}) {
    if (this[kMetaHeader] !== null) {
      options.headers = options.headers || {}
      options.headers['x-elastic-client-meta'] = this[kMetaHeader] + ',h=s'
    }
    // TODO: study scroll search slices
    const wait = options.wait || 5000
    const maxRetries = options.maxRetries || this.maxRetries
    if (Array.isArray(options.ignore)) {
      options.ignore.push(429)
    } else {
      options.ignore = [429]
    }
    params.scroll = params.scroll || '1m'
    appendFilterPath('_scroll_id', params, false)
    const { method, body, index, ...querystring } = params

    let response = null
    for (let i = 0; i <= maxRetries; i++) {
      response = await this[kClient].search(params, options)
      if (response.statusCode !== 429) break
      await sleep(wait)
    }
    if (response.statusCode === 429) {
      throw new ResponseError(response)
    }

    let scroll_id = response.body._scroll_id
    let stop = false
    const clear = async () => {
      stop = true
      await this[kClient].clearScroll(
        { body: { scroll_id } },
        { ignore: [400], ...options }
      )
    }

    while (response.body.hits && response.body.hits.hits.length > 0) {
      // scroll id is always present in the response, but it might
      // change over time based on the number of shards
      scroll_id = response.body._scroll_id
      response.clear = clear
      addDocumentsGetter(response)

      yield response

      if (stop === true) {
        break
      }

      for (let i = 0; i <= maxRetries; i++) {
        response = await this[kClient].scroll({
          scroll: querystring.scroll,
          rest_total_hits_as_int: querystring.rest_total_hits_as_int || querystring.restTotalHitsAsInt,
          body: { scroll_id }
        }, options)
        if (response.statusCode !== 429) break
        await sleep(wait)
      }
      if (response.statusCode === 429) {
        throw new ResponseError(response)
      }
    }

    if (stop === false) {
      await clear()
    }
  }

  /**
   * Runs a scroll search operation. This function returns an async iterator, allowing
   * the user to use a for await loop to get all the documents of a given search.
   * ```js
   * for await (const document of client.helpers.scrollSearch({ params })) {
   *   console.log(document)
   * }
   * ```
   * Each document is what you will find by running a scrollSearch and iterating on the hits array.
   * This helper automatically adds `filter_path=hits.hits._source` to the querystring,
   * as it will only need the documents source.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {iterator} the async iterator
   */
  async * scrollDocuments (params, options) {
    appendFilterPath('hits.hits._source', params, true)
    for await (const { documents } of this.scrollSearch(params, options)) {
      for (const document of documents) {
        yield document
      }
    }
  }

  /**
   * Creates a msearch helper instance. Once you configure it, you can use the provided
   * `search` method to add new searches in the queue.
   * @param {object} options - The configuration of the msearch operations.
   * @param {object} reqOptions - The client optional configuration for this request.
   * @return {object} The possible operations to run.
   */
  msearch (options = {}, reqOptions = {}) {
    const client = this[kClient]
    const {
      operations = 5,
      concurrency = 5,
      flushInterval = 500,
      retries = this.maxRetries,
      wait = 5000,
      ...msearchOptions
    } = options

    let stopReading = false
    let stopError = null
    let timeoutRef = null
    const operationsStream = new Readable({
      objectMode: true,
      read (size) {}
    })

    const p = iterate()
    const helper = {
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      stop (error = null) {
        if (stopReading === true) return
        stopReading = true
        stopError = error
        operationsStream.push(null)
      },
      // TODO: support abort a single search?
      // NOTE: the validation checks are synchronous and the callback/promise will
      //       be resolved in the same tick. We might want to fix this in the future.
      search (header, body, callback) {
        if (stopReading === true) {
          const error = stopError === null
            ? new ConfigurationError('The msearch processor has been stopped')
            : stopError
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        if (!(typeof header === 'object' && header !== null && !Array.isArray(header))) {
          const error = new ConfigurationError('The header should be an object')
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        if (!(typeof body === 'object' && body !== null && !Array.isArray(body))) {
          const error = new ConfigurationError('The body should be an object')
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        let promise = null
        if (callback === undefined) {
          let onFulfilled = null
          let onRejected = null
          promise = new Promise((resolve, reject) => {
            onFulfilled = resolve
            onRejected = reject
          })
          callback = function callback (err, result) {
            err ? onRejected(err) : onFulfilled(result)
          }
        }

        operationsStream.push([header, body, callback])

        if (promise !== null) {
          return promise
        }
      }
    }

    return helper

    async function iterate () {
      const { semaphore, finish } = buildSemaphore()
      const msearchBody = []
      const callbacks = []
      let loadedOperations = 0
      timeoutRef = setTimeout(onFlushTimeout, flushInterval)

      for await (const operation of operationsStream) {
        timeoutRef.refresh()
        loadedOperations += 1
        msearchBody.push(operation[0], operation[1])
        callbacks.push(operation[2])
        if (loadedOperations >= operations) {
          const send = await semaphore()
          send(msearchBody.slice(), callbacks.slice())
          msearchBody.length = 0
          callbacks.length = 0
          loadedOperations = 0
        }
      }

      clearTimeout(timeoutRef)
      // In some cases the previos http call does not have finished,
      // or we didn't reach the flush bytes threshold, so we force one last operation.
      if (loadedOperations > 0) {
        const send = await semaphore()
        send(msearchBody, callbacks)
      }

      await finish()

      if (stopError !== null) {
        throw stopError
      }

      async function onFlushTimeout () {
        if (loadedOperations === 0) return
        const msearchBodyCopy = msearchBody.slice()
        const callbacksCopy = callbacks.slice()
        msearchBody.length = 0
        callbacks.length = 0
        loadedOperations = 0
        try {
          const send = await semaphore()
          send(msearchBodyCopy, callbacksCopy)
        } catch (err) {
          /* istanbul ignore next */
          helper.stop(err)
        }
      }
    }

    // This function builds a semaphore using the concurrency
    // options of the msearch helper. It is used inside the iterator
    // to guarantee that no more than the number of operations
    // allowed to run at the same time are executed.
    // It returns a semaphore function which resolves in the next tick
    // if we didn't reach the maximim concurrency yet, otherwise it returns
    // a promise that resolves as soon as one of the running request has finshed.
    // The semaphore function resolves a send function, which will be used
    // to send the actual msearch request.
    // It also returns a finish function, which returns a promise that is resolved
    // when there are no longer request running.
    function buildSemaphore () {
      let resolveSemaphore = null
      let resolveFinish = null
      let running = 0

      return { semaphore, finish }

      function finish () {
        return new Promise((resolve, reject) => {
          if (running === 0) {
            resolve()
          } else {
            resolveFinish = resolve
          }
        })
      }

      function semaphore () {
        if (running < concurrency) {
          running += 1
          return pImmediate(send)
        } else {
          return new Promise((resolve, reject) => {
            resolveSemaphore = resolve
          })
        }
      }

      function send (msearchBody, callbacks) {
        /* istanbul ignore if */
        if (running > concurrency) {
          throw new Error('Max concurrency reached')
        }
        msearchOperation(msearchBody, callbacks, () => {
          running -= 1
          if (resolveSemaphore) {
            running += 1
            resolveSemaphore(send)
            resolveSemaphore = null
          } else if (resolveFinish && running === 0) {
            resolveFinish()
          }
        })
      }
    }

    function msearchOperation (msearchBody, callbacks, done) {
      let retryCount = retries

      // Instead of going full on async-await, which would make the code easier to read,
      // we have decided to use callback style instead.
      // This because every time we use async await, V8 will create multiple promises
      // behind the scenes, making the code slightly slower.
      tryMsearch(msearchBody, callbacks, retrySearch)
      function retrySearch (msearchBody, callbacks) {
        if (msearchBody.length > 0 && retryCount > 0) {
          retryCount -= 1
          setTimeout(tryMsearch, wait, msearchBody, callbacks, retrySearch)
          return
        }

        done()
      }

      // This function never returns an error, if the msearch operation fails,
      // the error is dispatched to all search executors.
      function tryMsearch (msearchBody, callbacks, done) {
        client.msearch(Object.assign({}, msearchOptions, { body: msearchBody }), reqOptions, (err, results) => {
          const retryBody = []
          const retryCallbacks = []
          if (err) {
            addDocumentsGetter(results)
            for (const callback of callbacks) {
              callback(err, results)
            }
            return done(retryBody, retryCallbacks)
          }
          const { responses } = results.body
          for (let i = 0, len = responses.length; i < len; i++) {
            const response = responses[i]
            if (response.status === 429 && retryCount > 0) {
              retryBody.push(msearchBody[i * 2])
              retryBody.push(msearchBody[(i * 2) + 1])
              retryCallbacks.push(callbacks[i])
              continue
            }
            const result = { ...results, body: response }
            addDocumentsGetter(result)
            if (response.status >= 400) {
              callbacks[i](new ResponseError(result), result)
            } else {
              callbacks[i](null, result)
            }
          }
          done(retryBody, retryCallbacks)
        })
      }
    }
  }

  /**
   * Creates a bulk helper instance. Once you configure it, you can pick which operation
   * to execute with the given dataset, index, create, update, and delete.
   * @param {object} options - The configuration of the bulk operation.
   * @param {object} reqOptions - The client optional configuration for this request.
   * @return {object} The possible operations to run with the datasource.
   */
  bulk (options, reqOptions = {}) {
    const client = this[kClient]
    const { serializer } = client
    if (this[kMetaHeader] !== null) {
      reqOptions.headers = reqOptions.headers || {}
      reqOptions.headers['x-elastic-client-meta'] = this[kMetaHeader] + ',h=bp'
    }
    const {
      datasource,
      onDocument,
      flushBytes = 5000000,
      flushInterval = 30000,
      concurrency = 5,
      retries = this.maxRetries,
      wait = 5000,
      onDrop = noop,
      refreshOnCompletion = false,
      ...bulkOptions
    } = options

    if (datasource === undefined) {
      return Promise.reject(new ConfigurationError('bulk helper: the datasource is required'))
    }
    if (!(Array.isArray(datasource) || Buffer.isBuffer(datasource) || typeof datasource.pipe === 'function' || datasource[Symbol.asyncIterator])) {
      return Promise.reject(new ConfigurationError('bulk helper: the datasource must be an array or a buffer or a readable stream or an async generator'))
    }
    if (onDocument === undefined) {
      return Promise.reject(new ConfigurationError('bulk helper: the onDocument callback is required'))
    }

    let shouldAbort = false
    let timeoutRef = null
    const stats = {
      total: 0,
      failed: 0,
      retry: 0,
      successful: 0,
      noop: 0,
      time: 0,
      bytes: 0,
      aborted: false
    }

    const p = iterate()
    const helper = {
      get stats () {
        return stats
      },
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      abort () {
        clearTimeout(timeoutRef)
        shouldAbort = true
        stats.aborted = true
        return this
      }
    }

    return helper

    /**
     * Function that iterates over the given datasource and start a bulk operation as soon
     * as it reaches the configured bulk size. It's designed to use the Node.js asynchronous
     * model at this maximum capacity, as it will collect the next body to send while there is
     * a running http call. In this way, the CPU time will be used carefully.
     * The objects will be serialized right away, to approximate the byte length of the body.
     * It creates an array of strings instead of a ndjson string because the bulkOperation
     * will navigate the body for matching failed operations with the original document.
     */
    async function iterate () {
      const { semaphore, finish } = buildSemaphore()
      const startTime = Date.now()
      const bulkBody = []
      let actionBody = ''
      let payloadBody = ''
      let chunkBytes = 0
      timeoutRef = setTimeout(onFlushTimeout, flushInterval)

      for await (const chunk of datasource) {
        if (shouldAbort === true) break
        timeoutRef.refresh()
        const action = onDocument(chunk)
        const operation = Array.isArray(action)
          ? Object.keys(action[0])[0]
          : Object.keys(action)[0]
        if (operation === 'index' || operation === 'create') {
          actionBody = serializer.serialize(action)
          payloadBody = typeof chunk === 'string' ? chunk : serializer.serialize(chunk)
          chunkBytes += Buffer.byteLength(actionBody) + Buffer.byteLength(payloadBody)
          bulkBody.push(actionBody, payloadBody)
        } else if (operation === 'update') {
          actionBody = serializer.serialize(action[0])
          payloadBody = typeof chunk === 'string'
            ? `{"doc":${chunk}}`
            : serializer.serialize({ doc: chunk, ...action[1] })
          chunkBytes += Buffer.byteLength(actionBody) + Buffer.byteLength(payloadBody)
          bulkBody.push(actionBody, payloadBody)
        } else if (operation === 'delete') {
          actionBody = serializer.serialize(action)
          chunkBytes += Buffer.byteLength(actionBody)
          bulkBody.push(actionBody)
        } else {
          clearTimeout(timeoutRef)
          throw new ConfigurationError(`Bulk helper invalid action: '${operation}'`)
        }

        if (chunkBytes >= flushBytes) {
          stats.bytes += chunkBytes
          const send = await semaphore()
          send(bulkBody.slice())
          bulkBody.length = 0
          chunkBytes = 0
        }
      }

      clearTimeout(timeoutRef)
      // In some cases the previos http call does not have finished,
      // or we didn't reach the flush bytes threshold, so we force one last operation.
      if (shouldAbort === false && chunkBytes > 0) {
        const send = await semaphore()
        stats.bytes += chunkBytes
        send(bulkBody)
      }

      await finish()

      if (refreshOnCompletion) {
        await client.indices.refresh({
          index: typeof refreshOnCompletion === 'string'
            ? refreshOnCompletion
            : '_all'
        }, reqOptions)
      }

      stats.time = Date.now() - startTime
      stats.total = stats.successful + stats.failed

      return stats

      async function onFlushTimeout () {
        if (chunkBytes === 0) return
        stats.bytes += chunkBytes
        const bulkBodyCopy = bulkBody.slice()
        bulkBody.length = 0
        chunkBytes = 0
        try {
          const send = await semaphore()
          send(bulkBodyCopy)
        } catch (err) {
          /* istanbul ignore next */
          helper.abort()
        }
      }
    }

    // This function builds a semaphore using the concurrency
    // options of the bulk helper. It is used inside the iterator
    // to guarantee that no more than the number of operations
    // allowed to run at the same time are executed.
    // It returns a semaphore function which resolves in the next tick
    // if we didn't reach the maximim concurrency yet, otherwise it returns
    // a promise that resolves as soon as one of the running request has finshed.
    // The semaphore function resolves a send function, which will be used
    // to send the actual bulk request.
    // It also returns a finish function, which returns a promise that is resolved
    // when there are no longer request running. It rejects an error if one
    // of the request has failed for some reason.
    function buildSemaphore () {
      let resolveSemaphore = null
      let resolveFinish = null
      let rejectFinish = null
      let error = null
      let running = 0

      return { semaphore, finish }

      function finish () {
        return new Promise((resolve, reject) => {
          if (running === 0) {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          } else {
            resolveFinish = resolve
            rejectFinish = reject
          }
        })
      }

      function semaphore () {
        if (running < concurrency) {
          running += 1
          return pImmediate(send)
        } else {
          return new Promise((resolve, reject) => {
            resolveSemaphore = resolve
          })
        }
      }

      function send (bulkBody) {
        /* istanbul ignore if */
        if (running > concurrency) {
          throw new Error('Max concurrency reached')
        }
        bulkOperation(bulkBody, err => {
          running -= 1
          if (err) {
            shouldAbort = true
            error = err
          }
          if (resolveSemaphore) {
            running += 1
            resolveSemaphore(send)
            resolveSemaphore = null
          } else if (resolveFinish && running === 0) {
            if (error) {
              rejectFinish(error)
            } else {
              resolveFinish()
            }
          }
        })
      }
    }

    function bulkOperation (bulkBody, callback) {
      let retryCount = retries
      let isRetrying = false

      // Instead of going full on async-await, which would make the code easier to read,
      // we have decided to use callback style instead.
      // This because every time we use async await, V8 will create multiple promises
      // behind the scenes, making the code slightly slower.
      tryBulk(bulkBody, retryDocuments)
      function retryDocuments (err, bulkBody) {
        if (err) return callback(err)
        if (shouldAbort === true) return callback()

        if (bulkBody.length > 0) {
          if (retryCount > 0) {
            isRetrying = true
            retryCount -= 1
            stats.retry += bulkBody.length
            setTimeout(tryBulk, wait, bulkBody, retryDocuments)
            return
          }
          for (let i = 0, len = bulkBody.length; i < len; i = i + 2) {
            const operation = Object.keys(serializer.deserialize(bulkBody[i]))[0]
            onDrop({
              status: 429,
              error: null,
              operation: serializer.deserialize(bulkBody[i]),
              document: operation !== 'delete'
                ? serializer.deserialize(bulkBody[i + 1])
                /* istanbul ignore next */
                : null,
              retried: isRetrying
            })
            stats.failed += 1
          }
        }
        callback()
      }

      function tryBulk (bulkBody, callback) {
        if (shouldAbort === true) return callback(null, [])
        client.bulk(Object.assign({}, bulkOptions, { body: bulkBody }), reqOptions, (err, { body }) => {
          if (err) return callback(err, null)
          if (body.errors === false) {
            stats.successful += body.items.length
            for (const item of body.items) {
              if (item.update && item.update.result === 'noop') {
                stats.noop++
              }
            }
            return callback(null, [])
          }
          const retry = []
          const { items } = body
          for (let i = 0, len = items.length; i < len; i++) {
            const action = items[i]
            const operation = Object.keys(action)[0]
            const { status } = action[operation]
            const indexSlice = operation !== 'delete' ? i * 2 : i

            if (status >= 400) {
              // 429 is the only staus code where we might want to retry
              // a document, because it was not an error in the document itself,
              // but the ES node were handling too many operations.
              if (status === 429) {
                retry.push(bulkBody[indexSlice])
                /* istanbul ignore next */
                if (operation !== 'delete') {
                  retry.push(bulkBody[indexSlice + 1])
                }
              } else {
                onDrop({
                  status: status,
                  error: action[operation].error,
                  operation: serializer.deserialize(bulkBody[indexSlice]),
                  document: operation !== 'delete'
                    ? serializer.deserialize(bulkBody[indexSlice + 1])
                    : null,
                  retried: isRetrying
                })
                stats.failed += 1
              }
            } else {
              stats.successful += 1
            }
          }
          callback(null, retry)
        })
      }
    }
  }
}

// Using a getter will improve the overall performances of the code,
// as we will reed the documents only if needed.
function addDocumentsGetter (result) {
  Object.defineProperty(result, 'documents', {
    get () {
      if (this.body.hits && this.body.hits.hits) {
        return this.body.hits.hits.map(d => d._source)
      }
      return []
    }
  })
}

function appendFilterPath (filter, params, force) {
  if (params.filter_path !== undefined) {
    params.filter_path += ',' + filter
  } else if (params.filterPath !== undefined) {
    params.filterPath += ',' + filter
  } else if (force === true) {
    params.filter_path = filter
  }
}

module.exports = Helpers


/***/ }),

/***/ 2697:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const { stringify } = __nccwpck_require__(1191)
const debug = __nccwpck_require__(8237)('elasticsearch')
const sjson = __nccwpck_require__(707)
const { SerializationError, DeserializationError } = __nccwpck_require__(5372)
const kJsonOptions = Symbol('secure json parse options')

class Serializer {
  constructor (opts = {}) {
    const disable = opts.disablePrototypePoisoningProtection
    this[kJsonOptions] = {
      protoAction: disable === true || disable === 'proto' ? 'ignore' : 'error',
      constructorAction: disable === true || disable === 'constructor' ? 'ignore' : 'error'
    }
  }

  serialize (object) {
    debug('Serializing', object)
    let json
    try {
      json = JSON.stringify(object)
    } catch (err) {
      throw new SerializationError(err.message, object)
    }
    return json
  }

  deserialize (json) {
    debug('Deserializing', json)
    let object
    try {
      object = sjson.parse(json, this[kJsonOptions])
    } catch (err) {
      throw new DeserializationError(err.message, json)
    }
    return object
  }

  ndserialize (array) {
    debug('ndserialize', array)
    if (Array.isArray(array) === false) {
      throw new SerializationError('The argument provided is not an array')
    }
    let ndjson = ''
    for (let i = 0, len = array.length; i < len; i++) {
      if (typeof array[i] === 'string') {
        ndjson += array[i] + '\n'
      } else {
        ndjson += this.serialize(array[i]) + '\n'
      }
    }
    return ndjson
  }

  qserialize (object) {
    debug('qserialize', object)
    if (object == null) return ''
    if (typeof object === 'string') return object
    // arrays should be serialized as comma separated list
    const keys = Object.keys(object)
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]
      // elasticsearch will complain for keys without a value
      if (object[key] === undefined) {
        delete object[key]
      } else if (Array.isArray(object[key]) === true) {
        object[key] = object[key].join(',')
      }
    }
    return stringify(object)
  }
}

module.exports = Serializer


/***/ }),

/***/ 7027:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const debug = __nccwpck_require__(8237)('elasticsearch')
const os = __nccwpck_require__(2087)
const { gzip, unzip, createGzip } = __nccwpck_require__(8761)
const buffer = __nccwpck_require__(4293)
const ms = __nccwpck_require__(900)
const { EventEmitter } = __nccwpck_require__(8614)
const {
  ConnectionError,
  RequestAbortedError,
  NoLivingConnectionsError,
  ResponseError,
  ConfigurationError,
  ProductNotSupportedError
} = __nccwpck_require__(5372)

const noop = () => {}

const clientVersion = __nccwpck_require__(7529)/* .version */ .i8
const userAgent = `elasticsearch-js/${clientVersion} (${os.platform()} ${os.release()}-${os.arch()}; Node.js ${process.version})`
const MAX_BUFFER_LENGTH = buffer.constants.MAX_LENGTH
const MAX_STRING_LENGTH = buffer.constants.MAX_STRING_LENGTH
const kProductCheck = Symbol('product check')
const kApiVersioning = Symbol('api versioning')
const kEventEmitter = Symbol('event emitter')

class Transport {
  constructor (opts) {
    if (typeof opts.compression === 'string' && opts.compression !== 'gzip') {
      throw new ConfigurationError(`Invalid compression: '${opts.compression}'`)
    }

    this.emit = opts.emit
    this.connectionPool = opts.connectionPool
    this.serializer = opts.serializer
    this.maxRetries = opts.maxRetries
    this.requestTimeout = toMs(opts.requestTimeout)
    this.suggestCompression = opts.suggestCompression === true
    this.compression = opts.compression || false
    this.context = opts.context || null
    this.headers = Object.assign({},
      { 'user-agent': userAgent },
      opts.suggestCompression === true ? { 'accept-encoding': 'gzip,deflate' } : null,
      lowerCaseHeaders(opts.headers)
    )
    this.sniffInterval = opts.sniffInterval
    this.sniffOnConnectionFault = opts.sniffOnConnectionFault
    this.sniffEndpoint = opts.sniffEndpoint
    this.generateRequestId = opts.generateRequestId || generateRequestId()
    this.name = opts.name
    this.opaqueIdPrefix = opts.opaqueIdPrefix
    this[kProductCheck] = 0 // 0 = to be checked, 1 = checking, 2 = checked-ok, 3 checked-notok, 4 checked-nodefault
    this[kApiVersioning] = process.env.ELASTIC_CLIENT_APIVERSIONING === 'true'
    this[kEventEmitter] = new EventEmitter()

    this.nodeFilter = opts.nodeFilter || defaultNodeFilter
    if (typeof opts.nodeSelector === 'function') {
      this.nodeSelector = opts.nodeSelector
    } else if (opts.nodeSelector === 'round-robin') {
      this.nodeSelector = roundRobinSelector()
    } else if (opts.nodeSelector === 'random') {
      this.nodeSelector = randomSelector
    } else {
      this.nodeSelector = roundRobinSelector()
    }

    this._sniffEnabled = typeof this.sniffInterval === 'number'
    this._nextSniff = this._sniffEnabled ? (Date.now() + this.sniffInterval) : 0
    this._isSniffing = false

    if (opts.sniffOnStart === true) {
      // timer needed otherwise it will clash
      // with the product check testing
      setTimeout(() => {
        this.sniff({ reason: Transport.sniffReasons.SNIFF_ON_START })
      }, 10)
    }
  }

  request (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    let p = null

    // promises support
    if (callback === undefined) {
      let onFulfilled = null
      let onRejected = null
      p = new Promise((resolve, reject) => {
        onFulfilled = resolve
        onRejected = reject
      })
      callback = function callback (err, result) {
        err ? onRejected(err) : onFulfilled(result)
      }
    }

    const meta = {
      context: null,
      request: {
        params: null,
        options: null,
        id: options.id || this.generateRequestId(params, options)
      },
      name: this.name,
      connection: null,
      attempts: 0,
      aborted: false
    }

    if (this.context != null && options.context != null) {
      meta.context = Object.assign({}, this.context, options.context)
    } else if (this.context != null) {
      meta.context = this.context
    } else if (options.context != null) {
      meta.context = options.context
    }

    const result = {
      body: null,
      statusCode: null,
      headers: null,
      meta
    }

    Object.defineProperty(result, 'warnings', {
      get () {
        return this.headers && this.headers.warning
          ? this.headers.warning.split(/(?!\B"[^"]*),(?![^"]*"\B)/)
          : null
      }
    })

    // We should not retry if we are sending a stream body, because we should store in memory
    // a copy of the stream to be able to send it again, but since we don't know in advance
    // the size of the stream, we risk to take too much memory.
    // Furthermore, copying everytime the stream is very a expensive operation.
    const maxRetries = isStream(params.body) || isStream(params.bulkBody)
      ? 0
      : (typeof options.maxRetries === 'number' ? options.maxRetries : this.maxRetries)
    const compression = options.compression !== undefined ? options.compression : this.compression
    let request = { abort: noop }
    const transportReturn = {
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      abort () {
        meta.aborted = true
        request.abort()
        debug('Aborting request', params)
        return this
      },
      finally (onFinally) {
        return p.finally(onFinally)
      }
    }

    const makeRequest = () => {
      if (meta.aborted === true) {
        this.emit('request', new RequestAbortedError(), result)
        return process.nextTick(callback, new RequestAbortedError(), result)
      }
      meta.connection = this.getConnection({ requestId: meta.request.id })
      if (meta.connection == null) {
        return process.nextTick(callback, new NoLivingConnectionsError(), result)
      }
      this.emit('request', null, result)
      // perform the actual http request
      request = meta.connection.request(params, onResponse)
    }

    const onConnectionError = (err) => {
      if (err.name !== 'RequestAbortedError') {
        // if there is an error in the connection
        // let's mark the connection as dead
        this.connectionPool.markDead(meta.connection)

        if (this.sniffOnConnectionFault === true) {
          this.sniff({
            reason: Transport.sniffReasons.SNIFF_ON_CONNECTION_FAULT,
            requestId: meta.request.id
          })
        }

        // retry logic
        if (meta.attempts < maxRetries) {
          meta.attempts++
          debug(`Retrying request, there are still ${maxRetries - meta.attempts} attempts`, params)
          makeRequest()
          return
        }
      }

      err.meta = result
      this.emit('response', err, result)
      return callback(err, result)
    }

    const onResponse = (err, response) => {
      if (err !== null) {
        return onConnectionError(err)
      }

      result.statusCode = response.statusCode
      result.headers = response.headers

      if (options.asStream === true) {
        result.body = response
        this.emit('response', null, result)
        callback(null, result)
        return
      }

      const contentEncoding = (result.headers['content-encoding'] || '').toLowerCase()
      const isCompressed = contentEncoding.indexOf('gzip') > -1 || contentEncoding.indexOf('deflate') > -1
      const isVectorTile = (result.headers['content-type'] || '').indexOf('application/vnd.mapbox-vector-tile') > -1

      /* istanbul ignore else */
      if (result.headers['content-length'] !== undefined) {
        const contentLength = Number(result.headers['content-length'])
        if (isCompressed && contentLength > MAX_BUFFER_LENGTH) {
          response.destroy()
          return onConnectionError(
            new RequestAbortedError(`The content length (${contentLength}) is bigger than the maximum allowed buffer (${MAX_BUFFER_LENGTH})`, result)
          )
        } else if (contentLength > MAX_STRING_LENGTH) {
          response.destroy()
          return onConnectionError(
            new RequestAbortedError(`The content length (${contentLength}) is bigger than the maximum allowed string (${MAX_STRING_LENGTH})`, result)
          )
        }
      }
      // if the response is compressed, we must handle it
      // as buffer for allowing decompression later
      // while if it's a vector tile, we should return it as buffer
      let payload = isCompressed || isVectorTile ? [] : ''
      const onData = isCompressed || isVectorTile
        ? chunk => { payload.push(chunk) }
        : chunk => { payload += chunk }
      const onEnd = err => {
        response.removeListener('data', onData)
        response.removeListener('end', onEnd)
        response.removeListener('error', onEnd)
        response.removeListener('aborted', onAbort)

        if (err) {
          return onConnectionError(new ConnectionError(err.message))
        }

        if (isCompressed) {
          unzip(Buffer.concat(payload), onBody)
        } else {
          onBody(null, isVectorTile ? Buffer.concat(payload) : payload)
        }
      }

      const onAbort = () => {
        response.destroy()
        onEnd(new Error('Response aborted while reading the body'))
      }

      if (!isCompressed && !isVectorTile) {
        response.setEncoding('utf8')
      }

      this.emit('deserialization', null, result)
      response.on('data', onData)
      response.on('error', onEnd)
      response.on('end', onEnd)
      response.on('aborted', onAbort)
    }

    const onBody = (err, payload) => {
      if (err) {
        this.emit('response', err, result)
        return callback(err, result)
      }

      const isVectorTile = (result.headers['content-type'] || '').indexOf('application/vnd.mapbox-vector-tile') > -1
      if (Buffer.isBuffer(payload) && !isVectorTile) {
        payload = payload.toString()
      }
      const isHead = params.method === 'HEAD'
      // we should attempt the payload deserialization only if:
      //    - a `content-type` is defined and is equal to `application/json`
      //    - the request is not a HEAD request
      //    - the payload is not an empty string
      if (result.headers['content-type'] !== undefined &&
          (result.headers['content-type'].indexOf('application/json') > -1 ||
          result.headers['content-type'].indexOf('application/vnd.elasticsearch+json') > -1) &&
          isHead === false &&
          payload !== ''
      ) {
        try {
          result.body = this.serializer.deserialize(payload)
        } catch (err) {
          this.emit('response', err, result)
          return callback(err, result)
        }
      } else {
        // cast to boolean if the request method was HEAD and there was no error
        result.body = isHead === true && result.statusCode < 400 ? true : payload
      }

      // we should ignore the statusCode if the user has configured the `ignore` field with
      // the statusCode we just got or if the request method is HEAD and the statusCode is 404
      const ignoreStatusCode = (Array.isArray(options.ignore) && options.ignore.indexOf(result.statusCode) > -1) ||
        (isHead === true && result.statusCode === 404)

      if (ignoreStatusCode === false &&
         (result.statusCode === 502 || result.statusCode === 503 || result.statusCode === 504)) {
        // if the statusCode is 502/3/4 we should run our retry strategy
        // and mark the connection as dead
        this.connectionPool.markDead(meta.connection)
        // retry logic (we shoukd not retry on "429 - Too Many Requests")
        if (meta.attempts < maxRetries && result.statusCode !== 429) {
          meta.attempts++
          debug(`Retrying request, there are still ${maxRetries - meta.attempts} attempts`, params)
          makeRequest()
          return
        }
      } else {
        // everything has worked as expected, let's mark
        // the connection as alive (or confirm it)
        this.connectionPool.markAlive(meta.connection)
      }

      if (ignoreStatusCode === false && result.statusCode >= 400) {
        const error = new ResponseError(result)
        this.emit('response', error, result)
        callback(error, result)
      } else {
        // cast to boolean if the request method was HEAD
        if (isHead === true && result.statusCode === 404) {
          result.body = false
        }
        this.emit('response', null, result)
        callback(null, result)
      }
    }

    const prepareRequest = () => {
      this.emit('serialization', null, result)
      const headers = Object.assign({}, this.headers, lowerCaseHeaders(options.headers))

      if (options.opaqueId !== undefined) {
        headers['x-opaque-id'] = this.opaqueIdPrefix !== null
          ? this.opaqueIdPrefix + options.opaqueId
          : options.opaqueId
      }

      // handle json body
      if (params.body != null) {
        if (shouldSerialize(params.body) === true) {
          try {
            params.body = this.serializer.serialize(params.body)
          } catch (err) {
            this.emit('request', err, result)
            process.nextTick(callback, err, result)
            return transportReturn
          }
        }

        if (params.body !== '') {
          headers['content-type'] = headers['content-type'] || (this[kApiVersioning] ? 'application/vnd.elasticsearch+json; compatible-with=7' : 'application/json')
        }

      // handle ndjson body
      } else if (params.bulkBody != null) {
        if (shouldSerialize(params.bulkBody) === true) {
          try {
            params.body = this.serializer.ndserialize(params.bulkBody)
          } catch (err) {
            this.emit('request', err, result)
            process.nextTick(callback, err, result)
            return transportReturn
          }
        } else {
          params.body = params.bulkBody
        }
        if (params.body !== '') {
          headers['content-type'] = headers['content-type'] || (this[kApiVersioning] ? 'application/vnd.elasticsearch+x-ndjson; compatible-with=7' : 'application/x-ndjson')
        }
      }

      params.headers = headers
      // serializes the querystring
      if (options.querystring == null) {
        params.querystring = this.serializer.qserialize(params.querystring)
      } else {
        params.querystring = this.serializer.qserialize(
          Object.assign({}, params.querystring, options.querystring)
        )
      }

      // handles request timeout
      params.timeout = toMs(options.requestTimeout || this.requestTimeout)
      if (options.asStream === true) params.asStream = true

      // handle compression
      if (params.body !== '' && params.body != null) {
        if (isStream(params.body) === true) {
          if (compression === 'gzip') {
            params.headers['content-encoding'] = compression
            params.body = params.body.pipe(createGzip())
          }
          makeRequest()
        } else if (compression === 'gzip') {
          gzip(params.body, (err, buffer) => {
            /* istanbul ignore next */
            if (err) {
              this.emit('request', err, result)
              return callback(err, result)
            }
            params.headers['content-encoding'] = compression
            params.headers['content-length'] = '' + Buffer.byteLength(buffer)
            params.body = buffer
            makeRequest()
          })
        } else {
          params.headers['content-length'] = '' + Buffer.byteLength(params.body)
          makeRequest()
        }
      } else {
        makeRequest()
      }
    }

    meta.request.params = params
    meta.request.options = options
    // still need to check the product or waiting for the check to finish
    if (this[kProductCheck] === 0 || this[kProductCheck] === 1) {
      // let pass info requests
      if (params.method === 'GET' && params.path === '/') {
        prepareRequest()
      } else {
        // wait for product check to finish
        this[kEventEmitter].once('product-check', (error, status) => {
          if (status === false) {
            const err = error || new ProductNotSupportedError(result)
            if (this[kProductCheck] === 4) {
              err.message = 'The client noticed that the server is not a supported distribution of Elasticsearch'
            }
            this.emit('request', err, result)
            process.nextTick(callback, err, result)
          } else {
            prepareRequest()
          }
        })
        // the very first request triggers the product check
        if (this[kProductCheck] === 0) {
          this.productCheck()
        }
      }
    // the product check is finished and it's not Elasticsearch
    } else if (this[kProductCheck] === 3 || this[kProductCheck] === 4) {
      const err = new ProductNotSupportedError(result)
      if (this[kProductCheck] === 4) {
        err.message = 'The client noticed that the server is not a supported distribution of Elasticsearch'
      }
      this.emit('request', err, result)
      process.nextTick(callback, err, result)
    // the product check finished and it's Elasticsearch
    } else {
      prepareRequest()
    }

    return transportReturn
  }

  getConnection (opts) {
    const now = Date.now()
    if (this._sniffEnabled === true && now > this._nextSniff) {
      this.sniff({ reason: Transport.sniffReasons.SNIFF_INTERVAL, requestId: opts.requestId })
    }
    return this.connectionPool.getConnection({
      filter: this.nodeFilter,
      selector: this.nodeSelector,
      requestId: opts.requestId,
      name: this.name,
      now
    })
  }

  sniff (opts, callback = noop) {
    if (this._isSniffing === true) return
    this._isSniffing = true
    debug('Started sniffing request')

    if (typeof opts === 'function') {
      callback = opts
      opts = { reason: Transport.sniffReasons.DEFAULT }
    }

    const { reason } = opts

    const request = {
      method: 'GET',
      path: this.sniffEndpoint
    }

    this.request(request, { id: opts.requestId }, (err, result) => {
      this._isSniffing = false
      if (this._sniffEnabled === true) {
        this._nextSniff = Date.now() + this.sniffInterval
      }

      if (err != null) {
        debug('Sniffing errored', err)
        result.meta.sniff = { hosts: [], reason }
        this.emit('sniff', err, result)
        return callback(err)
      }

      debug('Sniffing ended successfully', result.body)
      const protocol = result.meta.connection.url.protocol || /* istanbul ignore next */ 'http:'
      const hosts = this.connectionPool.nodesToHost(result.body.nodes, protocol)
      this.connectionPool.update(hosts)

      result.meta.sniff = { hosts, reason }
      this.emit('sniff', null, result)
      callback(null, hosts)
    })
  }

  productCheck () {
    debug('Start product check')
    this[kProductCheck] = 1
    this.request({
      method: 'GET',
      path: '/'
    }, (err, result) => {
      this[kProductCheck] = 3
      if (err) {
        debug('Product check failed', err)
        if (err.statusCode === 401 || err.statusCode === 403) {
          this[kProductCheck] = 2
          process.emitWarning(
            'The client is unable to verify that the server is Elasticsearch due to security privileges on the server side. Some functionality may not be compatible if the server is running an unsupported product.',
            'ProductNotSupportedSecurityError'
          )
          this[kEventEmitter].emit('product-check', null, true)
        } else {
          this[kProductCheck] = 0
          this[kEventEmitter].emit('product-check', err, false)
        }
      } else {
        debug('Checking elasticsearch version', result.body, result.headers)
        if (result.body.version == null || typeof result.body.version.number !== 'string') {
          debug('Can\'t access Elasticsearch version')
          return this[kEventEmitter].emit('product-check', null, false)
        }
        const tagline = result.body.tagline
        const version = result.body.version.number.split('.')
        const major = Number(version[0])
        const minor = Number(version[1])
        if (major < 6) {
          return this[kEventEmitter].emit('product-check', null, false)
        } else if (major >= 6 && major < 7) {
          if (tagline !== 'You Know, for Search') {
            debug('Bad tagline')
            return this[kEventEmitter].emit('product-check', null, false)
          }
        } else if (major === 7 && minor < 14) {
          if (tagline !== 'You Know, for Search') {
            debug('Bad tagline')
            return this[kEventEmitter].emit('product-check', null, false)
          }

          if (result.body.version.build_flavor !== 'default') {
            debug('Bad build_flavor')
            this[kProductCheck] = 4
            return this[kEventEmitter].emit('product-check', null, false)
          }
        } else {
          if (result.headers['x-elastic-product'] !== 'Elasticsearch') {
            debug('x-elastic-product not recognized')
            return this[kEventEmitter].emit('product-check', null, false)
          }
        }
        debug('Valid Elasticsearch distribution')
        this[kProductCheck] = 2
        this[kEventEmitter].emit('product-check', null, true)
      }
    })
  }
}

Transport.sniffReasons = {
  SNIFF_ON_START: 'sniff-on-start',
  SNIFF_INTERVAL: 'sniff-interval',
  SNIFF_ON_CONNECTION_FAULT: 'sniff-on-connection-fault',
  // TODO: find a better name
  DEFAULT: 'default'
}

function toMs (time) {
  if (typeof time === 'string') {
    return ms(time)
  }
  return time
}

function shouldSerialize (obj) {
  return typeof obj !== 'string' &&
         typeof obj.pipe !== 'function' &&
         Buffer.isBuffer(obj) === false
}

function isStream (obj) {
  return obj != null && typeof obj.pipe === 'function'
}

function defaultNodeFilter (node) {
  // avoid master only nodes
  if (node.roles.master === true &&
      node.roles.data === false &&
      node.roles.ingest === false) {
    return false
  }
  return true
}

function roundRobinSelector () {
  let current = -1
  return function _roundRobinSelector (connections) {
    if (++current >= connections.length) {
      current = 0
    }
    return connections[current]
  }
}

function randomSelector (connections) {
  const index = Math.floor(Math.random() * connections.length)
  return connections[index]
}

function generateRequestId () {
  const maxInt = 2147483647
  let nextReqId = 0
  return function genReqId (params, options) {
    return (nextReqId = (nextReqId + 1) & maxInt)
  }
}

function lowerCaseHeaders (oldHeaders) {
  if (oldHeaders == null) return oldHeaders
  const newHeaders = {}
  for (const header in oldHeaders) {
    newHeaders[header.toLowerCase()] = oldHeaders[header]
  }
  return newHeaders
}

module.exports = Transport
module.exports.internals = {
  defaultNodeFilter,
  roundRobinSelector,
  randomSelector,
  generateRequestId,
  lowerCaseHeaders
}


/***/ }),

/***/ 5372:
/***/ ((module) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



class ElasticsearchClientError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ElasticsearchClientError'
  }
}

class TimeoutError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, TimeoutError)
    this.name = 'TimeoutError'
    this.message = message || 'Timeout Error'
    this.meta = meta
  }
}

class ConnectionError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, ConnectionError)
    this.name = 'ConnectionError'
    this.message = message || 'Connection Error'
    this.meta = meta
  }
}

class NoLivingConnectionsError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, NoLivingConnectionsError)
    this.name = 'NoLivingConnectionsError'
    this.message = message || 'Given the configuration, the ConnectionPool was not able to find a usable Connection for this request.'
    this.meta = meta
  }
}

class SerializationError extends ElasticsearchClientError {
  constructor (message, data) {
    super(message, data)
    Error.captureStackTrace(this, SerializationError)
    this.name = 'SerializationError'
    this.message = message || 'Serialization Error'
    this.data = data
  }
}

class DeserializationError extends ElasticsearchClientError {
  constructor (message, data) {
    super(message, data)
    Error.captureStackTrace(this, DeserializationError)
    this.name = 'DeserializationError'
    this.message = message || 'Deserialization Error'
    this.data = data
  }
}

class ConfigurationError extends ElasticsearchClientError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ConfigurationError)
    this.name = 'ConfigurationError'
    this.message = message || 'Configuration Error'
  }
}

class ResponseError extends ElasticsearchClientError {
  constructor (meta) {
    super('Response Error')
    Error.captureStackTrace(this, ResponseError)
    this.name = 'ResponseError'
    if (meta.body && meta.body.error && meta.body.error.type) {
      if (Array.isArray(meta.body.error.root_cause)) {
        this.message = meta.body.error.type + ': '
        this.message += meta.body.error.root_cause.map(entry => `[${entry.type}] Reason: ${entry.reason}`).join('; ')
      } else {
        this.message = meta.body.error.type
      }
    } else if (typeof meta.body === 'object' && meta.body != null) {
      this.message = JSON.stringify(meta.body)
    } else {
      this.message = meta.body || 'Response Error'
    }
    this.meta = meta
  }

  get body () {
    return this.meta.body
  }

  get statusCode () {
    if (this.meta.body && typeof this.meta.body.status === 'number') {
      return this.meta.body.status
    }
    return this.meta.statusCode
  }

  get headers () {
    return this.meta.headers
  }

  toString () {
    return JSON.stringify(this.meta.body)
  }
}

class RequestAbortedError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, RequestAbortedError)
    this.name = 'RequestAbortedError'
    this.message = message || 'Request aborted'
    this.meta = meta
  }
}

class ProductNotSupportedError extends ElasticsearchClientError {
  constructor (meta) {
    super('Product Not Supported Error')
    Error.captureStackTrace(this, ProductNotSupportedError)
    this.name = 'ProductNotSupportedError'
    this.message = 'The client noticed that the server is not Elasticsearch and we do not support this unknown product.'
    this.meta = meta
  }
}

module.exports = {
  ElasticsearchClientError,
  TimeoutError,
  ConnectionError,
  NoLivingConnectionsError,
  SerializationError,
  DeserializationError,
  ConfigurationError,
  ResponseError,
  RequestAbortedError,
  ProductNotSupportedError
}


/***/ }),

/***/ 9233:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const { URL } = __nccwpck_require__(8835)
const debug = __nccwpck_require__(8237)('elasticsearch')
const Connection = __nccwpck_require__(5613)
const noop = () => {}

class BaseConnectionPool {
  constructor (opts) {
    // list of nodes and weights
    this.connections = []
    // how many nodes we have in our scheduler
    this.size = this.connections.length
    this.Connection = opts.Connection
    this.emit = opts.emit || noop
    this.auth = opts.auth || null
    this._ssl = opts.ssl
    this._agent = opts.agent
    this._proxy = opts.proxy || null
    this._caFingerprint = opts.caFingerprint || null
  }

  getConnection () {
    throw new Error('getConnection must be implemented')
  }

  markAlive () {
    return this
  }

  markDead () {
    return this
  }

  /**
   * Creates a new connection instance.
   */
  createConnection (opts) {
    if (typeof opts === 'string') {
      opts = this.urlToHost(opts)
    }

    if (this.auth !== null) {
      opts.auth = this.auth
    } else if (opts.url.username !== '' && opts.url.password !== '') {
      opts.auth = {
        username: decodeURIComponent(opts.url.username),
        password: decodeURIComponent(opts.url.password)
      }
    }

    if (opts.ssl == null) opts.ssl = this._ssl
    /* istanbul ignore else */
    if (opts.agent == null) opts.agent = this._agent
    /* istanbul ignore else */
    if (opts.proxy == null) opts.proxy = this._proxy
    /* istanbul ignore else */
    if (opts.caFingerprint == null) opts.caFingerprint = this._caFingerprint

    const connection = new this.Connection(opts)

    for (const conn of this.connections) {
      if (conn.id === connection.id) {
        throw new Error(`Connection with id '${connection.id}' is already present`)
      }
    }

    return connection
  }

  /**
   * Adds a new connection to the pool.
   *
   * @param {object|string} host
   * @returns {ConnectionPool}
   */
  addConnection (opts) {
    if (Array.isArray(opts)) {
      return opts.forEach(o => this.addConnection(o))
    }

    if (typeof opts === 'string') {
      opts = this.urlToHost(opts)
    }

    const connectionById = this.connections.find(c => c.id === opts.id)
    const connectionByUrl = this.connections.find(c => c.id === opts.url.href)

    if (connectionById || connectionByUrl) {
      throw new Error(`Connection with id '${opts.id || opts.url.href}' is already present`)
    }

    this.update([...this.connections, opts])
    return this.connections[this.size - 1]
  }

  /**
   * Removes a new connection to the pool.
   *
   * @param {object} connection
   * @returns {ConnectionPool}
   */
  removeConnection (connection) {
    debug('Removing connection', connection)
    return this.update(this.connections.filter(c => c.id !== connection.id))
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    debug('Emptying the connection pool')
    let openConnections = this.size
    this.connections.forEach(connection => {
      connection.close(() => {
        if (--openConnections === 0) {
          this.connections = []
          this.size = this.connections.length
          callback()
        }
      })
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (nodes) {
    debug('Updating the connection pool')
    const newConnections = []
    const oldConnections = []

    for (const node of nodes) {
      // if we already have a given connection in the pool
      // we mark it as alive and we do not close the connection
      // to avoid socket issues
      const connectionById = this.connections.find(c => c.id === node.id)
      const connectionByUrl = this.connections.find(c => c.id === node.url.href)
      if (connectionById) {
        debug(`The connection with id '${node.id}' is already present`)
        this.markAlive(connectionById)
        newConnections.push(connectionById)
      // in case the user has passed a single url (or an array of urls),
      // the connection id will be the full href; to avoid closing valid connections
      // because are not present in the pool, we check also the node url,
      // and if is already present we update its id with the ES provided one.
      } else if (connectionByUrl) {
        connectionByUrl.id = node.id
        this.markAlive(connectionByUrl)
        newConnections.push(connectionByUrl)
      } else {
        newConnections.push(this.createConnection(node))
      }
    }

    const ids = nodes.map(c => c.id)
    // remove all the dead connections and old connections
    for (const connection of this.connections) {
      if (ids.indexOf(connection.id) === -1) {
        oldConnections.push(connection)
      }
    }

    // close old connections
    oldConnections.forEach(connection => connection.close())

    this.connections = newConnections
    this.size = this.connections.length

    return this
  }

  /**
   * Transforms the nodes objects to a host object.
   *
   * @param {object} nodes
   * @returns {array} hosts
   */
  nodesToHost (nodes, protocol) {
    const ids = Object.keys(nodes)
    const hosts = []

    for (let i = 0, len = ids.length; i < len; i++) {
      const node = nodes[ids[i]]
      // If there is no protocol in
      // the `publish_address` new URL will throw
      // the publish_address can have two forms:
      //   - ip:port
      //   - hostname/ip:port
      // if we encounter the second case, we should
      // use the hostname instead of the ip
      let address = node.http.publish_address
      const parts = address.split('/')
      // the url is in the form of hostname/ip:port
      if (parts.length > 1) {
        const hostname = parts[0]
        const port = parts[1].match(/((?::))(?:[0-9]+)$/g)[0].slice(1)
        address = `${hostname}:${port}`
      }

      address = address.slice(0, 4) === 'http'
        /* istanbul ignore next */
        ? address
        : `${protocol}//${address}`
      const roles = node.roles.reduce((acc, role) => {
        acc[role] = true
        return acc
      }, {})

      hosts.push({
        url: new URL(address),
        id: ids[i],
        roles: Object.assign({
          [Connection.roles.MASTER]: false,
          [Connection.roles.DATA]: false,
          [Connection.roles.INGEST]: false,
          [Connection.roles.ML]: false
        }, roles)
      })
    }

    return hosts
  }

  /**
   * Transforms an url string to a host object
   *
   * @param {string} url
   * @returns {object} host
   */
  urlToHost (url) {
    return {
      url: new URL(url)
    }
  }
}

module.exports = BaseConnectionPool


/***/ }),

/***/ 8730:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __nccwpck_require__(9233)

class CloudConnectionPool extends BaseConnectionPool {
  constructor (opts) {
    super(opts)
    this.cloudConnection = null
  }

  /**
   * Returns the only cloud connection.
   *
   * @returns {object} connection
   */
  getConnection () {
    return this.cloudConnection
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    super.empty(() => {
      this.cloudConnection = null
      callback()
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (connections) {
    super.update(connections)
    this.cloudConnection = this.connections[0]
    return this
  }
}

module.exports = CloudConnectionPool


/***/ }),

/***/ 6213:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __nccwpck_require__(9233)
const assert = __nccwpck_require__(2357)
const debug = __nccwpck_require__(8237)('elasticsearch')
const Connection = __nccwpck_require__(5613)
const noop = () => {}

class ConnectionPool extends BaseConnectionPool {
  constructor (opts) {
    super(opts)

    this.dead = []
    // the resurrect timeout is 60s
    this.resurrectTimeout = 1000 * 60
    // number of consecutive failures after which
    // the timeout doesn't increase
    this.resurrectTimeoutCutoff = 5
    this.pingTimeout = opts.pingTimeout
    this._sniffEnabled = opts.sniffEnabled || false

    const resurrectStrategy = opts.resurrectStrategy || 'ping'
    this.resurrectStrategy = ConnectionPool.resurrectStrategies[resurrectStrategy]
    assert(
      this.resurrectStrategy != null,
      `Invalid resurrection strategy: '${resurrectStrategy}'`
    )
  }

  /**
   * Marks a connection as 'alive'.
   * If needed removes the connection from the dead list
   * and then resets the `deadCount`.
   *
   * @param {object} connection
   */
  markAlive (connection) {
    const { id } = connection
    debug(`Marking as 'alive' connection '${id}'`)
    const index = this.dead.indexOf(id)
    if (index > -1) this.dead.splice(index, 1)
    connection.status = Connection.statuses.ALIVE
    connection.deadCount = 0
    connection.resurrectTimeout = 0
    return this
  }

  /**
   * Marks a connection as 'dead'.
   * If needed adds the connection to the dead list
   * and then increments the `deadCount`.
   *
   * @param {object} connection
   */
  markDead (connection) {
    const { id } = connection
    debug(`Marking as 'dead' connection '${id}'`)
    if (this.dead.indexOf(id) === -1) {
      // It might happen that `markDead` is called jsut after
      // a pool update, and in such case we will add to the dead
      // list a node that no longer exist. The following check verify
      // that the connection is still part of the pool before
      // marking it as dead.
      for (let i = 0; i < this.size; i++) {
        if (this.connections[i].id === id) {
          this.dead.push(id)
          break
        }
      }
    }
    connection.status = Connection.statuses.DEAD
    connection.deadCount++
    // resurrectTimeout formula:
    // `resurrectTimeout * 2 ** min(deadCount - 1, resurrectTimeoutCutoff)`
    connection.resurrectTimeout = Date.now() + this.resurrectTimeout * Math.pow(
      2, Math.min(connection.deadCount - 1, this.resurrectTimeoutCutoff)
    )

    // sort the dead list in ascending order
    // based on the resurrectTimeout
    this.dead.sort((a, b) => {
      const conn1 = this.connections.find(c => c.id === a)
      const conn2 = this.connections.find(c => c.id === b)
      return conn1.resurrectTimeout - conn2.resurrectTimeout
    })

    return this
  }

  /**
   * If enabled, tries to resurrect a connection with the given
   * resurrect strategy ('ping', 'optimistic', 'none').
   *
   * @param {object} { now, requestId }
   * @param {function} callback (isAlive, connection)
   */
  resurrect (opts, callback = noop) {
    if (this.resurrectStrategy === 0 || this.dead.length === 0) {
      debug('Nothing to resurrect')
      callback(null, null)
      return
    }

    // the dead list is sorted in ascending order based on the timeout
    // so the first element will always be the one with the smaller timeout
    const connection = this.connections.find(c => c.id === this.dead[0])
    if ((opts.now || Date.now()) < connection.resurrectTimeout) {
      debug('Nothing to resurrect')
      callback(null, null)
      return
    }

    const { id } = connection

    // ping strategy
    if (this.resurrectStrategy === 1) {
      connection.request({
        method: 'HEAD',
        path: '/',
        timeout: this.pingTimeout
      }, (err, response) => {
        let isAlive = true
        const statusCode = response !== null ? response.statusCode : 0
        if (err != null ||
           (statusCode === 502 || statusCode === 503 || statusCode === 504)) {
          debug(`Resurrect: connection '${id}' is still dead`)
          this.markDead(connection)
          isAlive = false
        } else {
          debug(`Resurrect: connection '${id}' is now alive`)
          this.markAlive(connection)
        }
        this.emit('resurrect', null, {
          strategy: 'ping',
          name: opts.name,
          request: { id: opts.requestId },
          isAlive,
          connection
        })
        callback(isAlive, connection)
      })
    // optimistic strategy
    } else {
      debug(`Resurrect: optimistic resurrection for connection '${id}'`)
      this.dead.splice(this.dead.indexOf(id), 1)
      connection.status = Connection.statuses.ALIVE
      this.emit('resurrect', null, {
        strategy: 'optimistic',
        name: opts.name,
        request: { id: opts.requestId },
        isAlive: true,
        connection
      })
      callback(true, connection) // eslint-disable-line
    }
  }

  /**
   * Returns an alive connection if present,
   * otherwise returns a dead connection.
   * By default it filters the `master` only nodes.
   * It uses the selector to choose which
   * connection return.
   *
   * @param {object} options (filter and selector)
   * @returns {object|null} connection
   */
  getConnection (opts = {}) {
    const filter = opts.filter || (() => true)
    const selector = opts.selector || (c => c[0])

    this.resurrect({
      now: opts.now,
      requestId: opts.requestId,
      name: opts.name
    })

    const noAliveConnections = this.size === this.dead.length

    // TODO: can we cache this?
    const connections = []
    for (let i = 0; i < this.size; i++) {
      const connection = this.connections[i]
      if (noAliveConnections || connection.status === Connection.statuses.ALIVE) {
        if (filter(connection) === true) {
          connections.push(connection)
        }
      }
    }

    if (connections.length === 0) return null

    return selector(connections)
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    super.empty(() => {
      this.dead = []
      callback()
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (connections) {
    super.update(connections)
    this.dead = []
    return this
  }
}

ConnectionPool.resurrectStrategies = {
  none: 0,
  ping: 1,
  optimistic: 2
}

module.exports = ConnectionPool


/***/ }),

/***/ 3911:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __nccwpck_require__(9233)
const ConnectionPool = __nccwpck_require__(6213)
const CloudConnectionPool = __nccwpck_require__(8730)

module.exports = {
  BaseConnectionPool,
  ConnectionPool,
  CloudConnectionPool
}


/***/ }),

/***/ 6545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(2618);

/***/ }),

/***/ 8104:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var buildFullPath = __nccwpck_require__(1934);
var buildURL = __nccwpck_require__(646);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var httpFollow = __nccwpck_require__(7707).http;
var httpsFollow = __nccwpck_require__(7707).https;
var url = __nccwpck_require__(8835);
var zlib = __nccwpck_require__(8761);
var VERSION = __nccwpck_require__(4322).version;
var createError = __nccwpck_require__(5226);
var enhanceError = __nccwpck_require__(1516);
var defaults = __nccwpck_require__(8190);
var Cancel = __nccwpck_require__(8875);

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }
    var resolve = function resolve(value) {
      done();
      resolvePromise(value);
    };
    var reject = function reject(value) {
      done();
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;
    var headerNames = {};

    Object.keys(headers).forEach(function storeLowerName(name) {
      headerNames[name.toLowerCase()] = name;
    });

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    if ('user-agent' in headerNames) {
      // User-Agent is specified; handle case where no UA header is desired
      if (!headers[headerNames['user-agent']]) {
        delete headers[headerNames['user-agent']];
      }
      // Otherwise, use specified value
    } else {
      // Only set header if it hasn't been set in config
      headers['User-Agent'] = 'axios/' + VERSION;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      if (!headerNames['content-length']) {
        headers['Content-Length'] = data.length;
      }
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth && headerNames.authorization) {
      delete headers[headerNames.authorization];
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        var totalResponseBytes = 0;
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      var timeout = parseInt(config.timeout, 10);

      if (isNaN(timeout)) {
        reject(createError(
          'error trying to parse `config.timeout` to int',
          config,
          'ERR_PARSE_TIMEOUT',
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        req.abort();
        var transitional = config.transitional || defaults.transitional;
        reject(createError(
          'timeout of ' + timeout + 'ms exceeded',
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          req
        ));
      });
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }


    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ 3454:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var cookies = __nccwpck_require__(1545);
var buildURL = __nccwpck_require__(646);
var buildFullPath = __nccwpck_require__(1934);
var parseHeaders = __nccwpck_require__(6455);
var isURLSameOrigin = __nccwpck_require__(3608);
var createError = __nccwpck_require__(5226);
var defaults = __nccwpck_require__(8190);
var Cancel = __nccwpck_require__(8875);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 2618:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var bind = __nccwpck_require__(7065);
var Axios = __nccwpck_require__(8178);
var mergeConfig = __nccwpck_require__(4831);
var defaults = __nccwpck_require__(8190);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __nccwpck_require__(8875);
axios.CancelToken = __nccwpck_require__(1587);
axios.isCancel = __nccwpck_require__(4057);
axios.VERSION = __nccwpck_require__(4322).version;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __nccwpck_require__(4850);

// Expose isAxiosError
axios.isAxiosError = __nccwpck_require__(650);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 8875:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 1587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var Cancel = __nccwpck_require__(8875);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 4057:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 8178:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var buildURL = __nccwpck_require__(646);
var InterceptorManager = __nccwpck_require__(3214);
var dispatchRequest = __nccwpck_require__(5062);
var mergeConfig = __nccwpck_require__(4831);
var validator = __nccwpck_require__(1632);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 3214:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 1934:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isAbsoluteURL = __nccwpck_require__(1301);
var combineURLs = __nccwpck_require__(7189);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5226:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var enhanceError = __nccwpck_require__(1516);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 5062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var transformData = __nccwpck_require__(9812);
var isCancel = __nccwpck_require__(4057);
var defaults = __nccwpck_require__(8190);
var Cancel = __nccwpck_require__(8875);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 1516:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ 4831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ 3211:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var createError = __nccwpck_require__(5226);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 9812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var defaults = __nccwpck_require__(8190);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 8190:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var normalizeHeaderName = __nccwpck_require__(6240);
var enhanceError = __nccwpck_require__(1516);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __nccwpck_require__(3454);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __nccwpck_require__(8104);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 4322:
/***/ ((module) => {

module.exports = {
  "version": "0.24.0"
};

/***/ }),

/***/ 7065:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 646:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7189:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 1545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1301:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 650:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 3608:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 6455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 4850:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 1632:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var VERSION = __nccwpck_require__(4322).version;

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(7065);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 4697:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(4697);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(5332);
}


/***/ }),

/***/ 5332:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(3867);
const util = __nccwpck_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(9318);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 1133:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __nccwpck_require__(8237)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 7707:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(8835);
var URL = url.URL;
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var Writable = __nccwpck_require__(2413).Writable;
var assert = __nccwpck_require__(2357);
var debug = __nccwpck_require__(1133);

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var e = 0; e < events.length; e++) {
    request.on(events[e], eventHandlers[events[e]]);
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = url.parse(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
      url.format(Object.assign(currentUrlParts, { host: currentHost }));

    // Determine the URL of the redirection
    var redirectUrl;
    try {
      redirectUrl = url.resolve(currentUrl, location);
    }
    catch (cause) {
      this.emit("error", new RedirectionError(cause));
      return;
    }

    // Create the redirected request
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop the Authorization header if redirecting to another domain
    if (!(redirectUrlParts.host === currentHost || isSubdomainOf(redirectUrlParts.host, currentHost))) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = { headers: response.headers };
      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      this.emit("error", new RedirectionError(cause));
    }
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header].toString().trim();
      delete headers[header];
    }
  }
  return lastValue;
}

function createErrorType(code, defaultMessage) {
  function CustomError(cause) {
    Error.captureStackTrace(this, this.constructor);
    if (!cause) {
      this.message = defaultMessage;
    }
    else {
      this.message = defaultMessage + ": " + cause.message;
      this.cause = cause;
    }
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var e = 0; e < events.length; e++) {
    request.removeListener(events[e], eventHandlers[events[e]]);
  }
  request.on("error", noop);
  request.abort();
}

function isSubdomainOf(subdomain, domain) {
  const dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 1621:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 4585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const https = __nccwpck_require__(7211)
const http = __nccwpck_require__(8605)
const { URL } = __nccwpck_require__(8835)

class HttpProxyAgent extends http.Agent {
  constructor (options) {
    const { proxy, ...opts } = options
    super(opts)
    this.proxy = typeof proxy === 'string'
      ? new URL(proxy)
      : proxy
  }

  createConnection (options, callback) {
    const requestOptions = {
      method: 'CONNECT',
      host: this.proxy.hostname,
      port: this.proxy.port,
      path: `${options.host}:${options.port}`,
      setHost: false,
      headers: { connection: this.keepAlive ? 'keep-alive' : 'close', host: `${options.host}:${options.port}` },
      agent: false
    }

    if (this.proxy.username || this.proxy.password) {
      const base64 = Buffer.from(`${this.proxy.username || ''}:${this.proxy.password || ''}`).toString('base64')
      requestOptions.headers['proxy-authorization'] = `Basic ${base64}`
    }

    const request = (this.proxy.protocol === 'http:' ? http : https).request(requestOptions)
    request.once('connect', (response, socket, head) => {
      request.removeAllListeners()
      socket.removeAllListeners()
      if (response.statusCode === 200) {
        callback(null, socket)
      } else {
        callback(new Error(`Bad response: ${response.statusCode}`), null)
      }
    })

    request.once('error', err => {
      request.removeAllListeners()
      callback(err, null)
    })

    request.end()
  }
}

class HttpsProxyAgent extends https.Agent {
  constructor (options) {
    const { proxy, ...opts } = options
    super(opts)
    this.proxy = typeof proxy === 'string'
      ? new URL(proxy)
      : proxy
  }

  createConnection (options, callback) {
    const requestOptions = {
      method: 'CONNECT',
      host: this.proxy.hostname,
      port: this.proxy.port,
      path: `${options.host}:${options.port}`,
      setHost: false,
      headers: { connection: this.keepAlive ? 'keep-alive' : 'close', host: `${options.host}:${options.port}` },
      agent: false
    }

    if (this.proxy.username || this.proxy.password) {
      const base64 = Buffer.from(`${this.proxy.username || ''}:${this.proxy.password || ''}`).toString('base64')
      requestOptions.headers['proxy-authorization'] = `Basic ${base64}`
    }

    const request = (this.proxy.protocol === 'http:' ? http : https).request(requestOptions)
    request.once('connect', (response, socket, head) => {
      request.removeAllListeners()
      socket.removeAllListeners()
      if (response.statusCode === 200) {
        const secureSocket = super.createConnection({ ...options, socket })
        callback(null, secureSocket)
      } else {
        callback(new Error(`Bad response: ${response.statusCode}`), null)
      }
    })

    request.once('error', err => {
      request.removeAllListeners()
      callback(err, null)
    })

    request.end()
  }
}

module.exports = {
  HttpProxyAgent,
  HttpsProxyAgent
}


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 707:
/***/ ((module) => {

"use strict";


const hasBuffer = typeof Buffer !== 'undefined'
const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/

function parse (text, reviver, options) {
  // Normalize arguments
  if (options == null) {
    if (reviver !== null && typeof reviver === 'object') {
      options = reviver
      reviver = undefined
    } else {
      options = {}
    }
  }

  const protoAction = options.protoAction || 'error'
  const constructorAction = options.constructorAction || 'error'

  if (hasBuffer && Buffer.isBuffer(text)) {
    text = text.toString()
  }

  // BOM checker
  if (text && text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1)
  }

  // Parse normally, allowing exceptions
  const obj = JSON.parse(text, reviver)

  // options: 'error' (default) / 'remove' / 'ignore'
  if (protoAction === 'ignore' && constructorAction === 'ignore') {
    return obj
  }

  // Ignore null and non-objects
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (protoAction !== 'ignore' && constructorAction !== 'ignore') {
    if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
      return obj
    }
  } else if (protoAction !== 'ignore' && constructorAction === 'ignore') {
    if (suspectProtoRx.test(text) === false) {
      return obj
    }
  } else {
    if (suspectConstructorRx.test(text) === false) {
      return obj
    }
  }

  // Scan result for proto keys
  scan(obj, { protoAction, constructorAction })

  return obj
}

function scan (obj, { protoAction = 'error', constructorAction = 'error' } = {}) {
  let next = [obj]

  while (next.length) {
    const nodes = next
    next = []

    for (const node of nodes) {
      if (protoAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, '__proto__')) { // Avoid calling node.hasOwnProperty directly
        if (protoAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.__proto__ // eslint-disable-line no-proto
      }

      if (constructorAction !== 'ignore' &&
          Object.prototype.hasOwnProperty.call(node, 'constructor') &&
          Object.prototype.hasOwnProperty.call(node.constructor, 'prototype')) { // Avoid calling node.hasOwnProperty directly
        if (constructorAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.constructor
      }

      for (const key in node) {
        const value = node[key]
        if (value && typeof value === 'object') {
          next.push(node[key])
        }
      }
    }
  }
}

function safeParse (text, reviver) {
  try {
    return parse(text, reviver)
  } catch (ignoreError) {
    return null
  }
}

module.exports = {
  parse,
  scan,
  safeParse
}


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const tty = __nccwpck_require__(3867);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 1191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(3109);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map