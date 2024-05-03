import fetch from 'node-fetch';
import SemanticReleaseError from '@semantic-release/error';

async function retryFn(message, logger, { teamsWebhook, githubToken }) {
    if (retryFn.counter > 3) {
        return;
    }
    retryFn.counter++;
    console.log("Waiting 5 seconds to retry publishing the notification.");
    await new Promise(res => setTimeout(res, 5000));
    await postMessage(message, logger, teamsWebhook, githubToken); // Corrected argument passing
}

retryFn.counter = 1;

export default async function postMessage(message, logger, teamsWebhook, githubToken ) {
    let response;
    let bodyText;
    let isSuccess;
    try {
        // Use fetch to send HTTP request
        response = await fetch(teamsWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message).replace(/'/g, "'\\''"),
        });

        // Read the response body as text
        bodyText = await response.text();

        // Check if the response is successful
        isSuccess = response.ok && bodyText === '1';
    } catch (e) {
        // Handle fetch errors
        console.error('Error:', e.message);
        throw new SemanticReleaseError(e.message, 'FETCH ERROR');
    }

    if (!isSuccess) {
        await retryFn(message, logger, { teamsWebhook, githubToken }); // Corrected argument passing
        logger.log('JSON message format invalid: ' + bodyText);
        throw new SemanticReleaseError(bodyText, 'FETCH ERROR');
    }
    
    return bodyText;
}