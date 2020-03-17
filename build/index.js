#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const postman_sync_1 = require("./postman-sync");
function main() {
    const parser = yargs_1.default
        .scriptName("pm-sync")
        .usage("$0 <cmd> [args]")
        .command("push [dir]", "push collections from <dir> to postman", yargs => yargs.positional("dir", {
        type: "string",
        default: ".",
        describe: "working directory"
    }), async function (argv) {
        console.log(`pushing collections from '${argv.dir}'`);
        try {
            const sync = new postman_sync_1.PostmanSync();
            await sync.push(argv.dir);
        }
        catch (err) {
            console.error(err.message);
        }
        console.log("done");
    })
        .command("pull [dir]", "pull collections from postman to <dir>", yargs => yargs.positional("dir", {
        type: "string",
        default: ".",
        describe: "working directory"
    }), async function (argv) {
        console.log(`pulling collections in '${argv.dir}'`);
        try {
            const sync = new postman_sync_1.PostmanSync();
            await sync.pull(argv.dir);
        }
        catch (err) {
            console.error(err.message);
        }
        console.log("done");
    })
        .command("set-api-key [key]", "sets postman api key", yargs => yargs
        .positional("key", {
        type: "string",
        default: ".",
        describe: "postman API key"
    })
        .demandOption("key"), async function (argv) {
        const sync = new postman_sync_1.PostmanSync();
        await sync.setApiKey(argv.key);
    })
        .demandCommand()
        .help();
    const argv = parser.argv;
    return 0;
}
exports.main = main;
process.exitCode = main();
