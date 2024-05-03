import assert from 'assert';
import sinon from 'sinon';
import success from '../lib/success.js'; // Updated import statement
import verifyNotification from '../lib/verifyConditions.js';
import * as testUtils from './testUtils.js';

let postMessageStub;

describe("test conditions and notification", () => {
    beforeEach(() => {
        postMessageStub = sinon.stub();
    });

    it("verify conditions", async () => {
        const packageName = "Internal Test";
        const pluginConfig = testUtils.getBaseConfig(packageName);
        const response = await verifyNotification(pluginConfig, testUtils.getContext());
        assert.deepEqual(response, true);
    });

    it("handle on Success Case", async () => {
        const expectedResult = "1";
        const pluginConfig = testUtils.getBaseConfig("internal testing");
        const response = await success(pluginConfig, testUtils.getContext());
        assert.deepEqual(response, expectedResult);
    });
});
