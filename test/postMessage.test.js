import assert from 'assert';
import nock from 'nock';
import postMessage from '../lib/postMessage.js';
import SemanticReleaseError from '@semantic-release/error';

const teamsWebhook =
    "https://centralnic.webhook.office.com/webhookb2/c295524b-ddc6-480d-b7af-bc1d0bb7ce6d@b4f6acc5-a1a2-441f-ab33-4584863ff079/IncomingWebhook/f26b299d529a4f838c45c2e28312ef07/5dc662cd-7b04-481a-8e6c-720aa39fc7b6";

async function postWebhook(url) {
    url = url || teamsWebhook;
    await postMessage("", { log: () => undefined }, { teamsWebhook: url });
}

describe("test postMessage with webhook", () => {
    it('should pass if response is 200 "1"', async () => {
        nock(teamsWebhook).post("/").reply(200, "1");
        assert.ifError(await postWebhook());
    });

    it('should fail if response text is not "1"', async () => {
        const response = "not 1";
        nock(teamsWebhook).post("/").reply(200, response);
        await assert.rejects(postWebhook(), new SemanticReleaseError(response, "FETCH ERROR"));
    });

    // it("should fail if response status code is not 200", async () => {
    //     const response = "error message";
    //     nock(teamsWebhook).post("/").reply(500, response);
    //     await assert.rejects(postWebhook(), new SemanticReleaseError(response, "FETCH ERROR"));
    // });

    // it("should fail if incorrect url", async () => {
    //     const incorrectUrl = "https://sekhfskdfdjksfkjdhfsd.com";
    //     await assert.rejects(postWebhook(incorrectUrl), {
    //         name: "SemanticReleaseError",
    //         code: "FETCH ERROR",
    //         details: undefined,
    //         message: /ENOTFOUND/,
    //         semanticRelease: true,
    //     });
    // });
});
