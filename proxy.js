import axios from 'axios';
import MessageEchoWorker from "./messageEchoWorker.js";

export const workers = {};
const JOB_STATUS_RUNNING = "running";

export const queueJob = async (account) => {
    const response = await axios.post(`http://${process.env.JOB_SERVER_URL}`, {
        account: account,
        wait: false,
        callback: `https://${process.env.PROXY_SERVER_URL}/updateJob`
    })

    const jobResponse = response.data;

    if(response.status !== 200 || !jobResponse.id || jobResponse.state !== JOB_STATUS_RUNNING) {
        throw new Error("Error queuing job.")
    }

    return jobResponse;
}

export const getCallbackResponse = (job) => {
    return new Promise((resolve) => {
        // create a worker thread that will keep the current request alive
        // until an update comes back from the server through /updateJob
        const messageEchoWorker = new MessageEchoWorker(job);

        // add a listener to send a success response when an update message
        // comes back from the worker through /updateJob
        messageEchoWorker.worker.on("message", (data) => {
            resolve({ code: 200, data: data });
        });

        // add a listener to send an error response when an error comes back from the worker
        messageEchoWorker.worker.on("error", (msg) => {
            resolve({ code: 500, data: `Error: ${msg}` });
        });

        // add a listener to delete the worker from the workers object when it exits
        messageEchoWorker.worker.on("exit", (code) => {
            delete workers[job.id];
        });

        workers[job.id] = messageEchoWorker.worker;
    });
}

export const updateWorker = (job) => {
    const worker = workers[job.id];

    if(!worker) {
        throw new Error("No worker found.")
    }

    // update the worker that the job has completed (or failed)
    worker.postMessage(job);
}