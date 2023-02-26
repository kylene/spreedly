import {queueJob} from "./proxy.js";
import { jest } from '@jest/globals';
import axios from "axios";

jest.mock('axios', () => {
    return {
        post: jest.fn((_url, _body) => {
            return new Promise((resolve) => {
                const url = _url;
                const body = _body;
                resolve(true)
            })
        })
    };
});

describe("queueJob()", () => {
    test("Job queues successfully => job payload is returned", async () => {
        expect.assertions(1);
        const queueJobResponse = { data: { id: "1234", state: "running" }}
        console.debug(axios.post);
        axios.post.mockResolvedValueOnce(queueJobResponse);
        const result = await queueJob("testaccount@email.com")

        expect(result).toEqual(queueJobResponse);
    });

    test("Queue job request returns non-200 status code => error is thrown", async () => {
        expect.assertions(1);
        const queueJobResponse = { status: 500 };
        axios.post.mockResolvedValue(queueJobResponse);

        await expect(queueJob('testaccount@email.com')).rejects.toEqual({
            error: 'User with 3 not found.',
        });
    });

    test("Queue job request returns no job ID => error is thrown", () => {

    });

    test("Queue job request returns error status => error is thrown", () => {

    });
});