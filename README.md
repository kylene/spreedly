# Spreedly Work Sample

## Overview
This is an async proxy service that enables the Spreedly job server to be able to interact asynchronously with the Spreedly job client.

## Getting Started
Run the server with the `npm start` command. The proxy service uses a `.env` file to configure URLs for the job server and the callback URL.

## Testing
Tests can be run using `npm test`. Integration tests will require the proxy service to be running on a separate server and will send real requests to the Spreedly job server.

## Error Handling
Server-side errors while queueing a job should be covered by the try/catch block in the `/queueJob` route and payload validation of the queue job response in the `queueJob()` function in `proxy.js`. Having a way to retry failures when queuing a job would be an opportunity for optimization on subsequent passes.

Errors while processing in the callback from the server should be handled by the worker's `onError` handler. Additionally, in the event that the job server does not execute the callback within 30 seconds the worker will throw an error and terminate the process. 

All of these errors are currently returned to the client as generic 500 errors with a message. In future iterations, returning more detailed or granular error codes and messages would be better practice and make troubleshooting on the client-side easier. Implementing robust logging would be helpful as well.

## Scaling
### Vertical
The proxy runs on Node.js worker threads, which are limited to the number of system threads available for processing. Scaling vertically by increasing the number of threads, connections, and memory available at the hardware level would maximize processing power. Code-wise, implementing a worker pool model would reduce the overhead of spawning a new worker thread for each request which would result in some optimization.

### Horizontal
To scale horizontally and run multiple instances of the proxy service, there will need to be some single point of entry (potentially something like an AWS API Gateway) that can then either delegate requests to the various instances or push them to some sort of queue (like AWS SQS) that would allow the instances to process them as they are available. The latter approach of using a service like a queue would allow for retries in the event of errors along the process.