import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import {getCallbackResponse, queueJob, updateWorker} from './proxy.js';
const app = express();
app.use(express.json());

app.post('/queueJob', async function (req, res) {
    // Validate the request
    const account = req.body.account;

    if(!account) {
        res.status(400).send("Account required.");
    }

    let code;
    let data;

    try {
        // send a request to the server to queue the job
        const job = await queueJob(account);

        // await the callback response while the job processes asynchronously on the server
        const callbackResponse = await getCallbackResponse(job);

        code = callbackResponse.code;
        data = callbackResponse.data;
    } catch(e) {
        code = 500;
        data = e.message;
    }

    res.status(code).send(data);
})

app.post('/updateJob', function (req, res) {
    // update the worker to notify the /queueJob process
    updateWorker(req.body)

    res.status(200).send();
})

const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})

export default app;