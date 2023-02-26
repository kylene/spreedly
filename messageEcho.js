import { parentPort } from "worker_threads";
import { exit } from 'node:process';

parentPort.on("message", (message) => {
    parentPort.postMessage(message);
    exit();
});

setTimeout(() => {
    throw new Error("Max wait time exceeded.")
}, 30000)