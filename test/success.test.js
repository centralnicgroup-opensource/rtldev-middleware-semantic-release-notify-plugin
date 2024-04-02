import assert from 'assert';
import sinon from 'sinon';
import success from '../lib/success.js'; // Updated import statement
import * as testUtils from './testUtils.js';

let postMessageStub;

describe("test success", () => {
    beforeEach(() => {
        postMessageStub = sinon.stub();
    });

    it("should handle onSuccessFunction", async () => {
        const packageName = "Internal Test";
        const expectedResult = "1";
        const pluginConfig = testUtils.getBaseConfig(packageName);
        const onSuccessFunction = (pluginConfig, context) => {
            return expectedResult;
        };

        pluginConfig.onSuccessFunction = onSuccessFunction;

        const response = await success(pluginConfig, testUtils.getContext());

        //const actualResult = postMessageStub.getCall(0).args[0];
        console.log("hey\n\n")
        console.log(response)
        // assert.deepStrictEqual(actualResult, expectedResult);
    });
});
