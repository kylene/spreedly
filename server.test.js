import axios from 'axios';

describe("Request Process", () => {
    test("Single request completes successfully", async () => {
        const requestData = {
            account: 'testaccount@email.com'
        }

        const response = await axios.post('http://localhost:8081/queueJob', requestData)

        expect(response.data.state).toEqual("completed");
    });

    test("50 requests complete successfully", async () => {
        const requestData = {
            account: 'testaccount@email.com'
        }

        const requests = new Array(50).fill(axios.post('http://localhost:8081/queueJob', requestData))

        const startTime = Date.now();
        const responses = await Promise.all(requests)
        const endTime = Date.now();
        const timeElapsed = (endTime - startTime) / 1000;

        expect(responses.filter(response => response.data.state !== "completed").length).toEqual(0);
        expect(timeElapsed).toBeLessThan(5);
    });

    test("1000 requests complete successfully", async () => {
        const requestData = {
            account: 'testaccount@email.com'
        }

        const requests = new Array(1000).fill(axios.post('http://localhost:8081/queueJob', requestData))

        const startTime = Date.now();
        const responses = await Promise.all(requests)
        const endTime = Date.now();
        const timeElapsed = (endTime - startTime) / 1000;

        expect(responses.filter(response => response.data.state !== "completed").length).toEqual(0);
        expect(timeElapsed).toBeLessThan(5);
    });
});