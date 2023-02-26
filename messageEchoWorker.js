import {Worker} from "worker_threads";

class MessageEchoWorker {
    constructor(workerData) {
        this.worker = new Worker("./messageEcho.js", { workerData: workerData });
    }
}

export default MessageEchoWorker;