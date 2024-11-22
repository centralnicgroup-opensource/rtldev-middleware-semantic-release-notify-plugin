import fetch from 'node-fetch';
import SemanticReleaseError from '@semantic-release/error';

export default async function postMessage(message, logger, teamsWebhook, githubToken ) {
    let response;
    let bodyText;
    let isSuccess;
    let attempts = 0;

    while (attempts < 3) {
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

            if (isSuccess) {
                return bodyText;
            } else {
                logger.log('JSON message format invalid: ' + bodyText);
            }
        } catch (e) {
            // Handle fetch errors
            console.error('Error:', e.message);
            logger.log('Attempt ' + (attempts + 1) + ' failed: ' + e.message);
        }

        attempts++;
        if (attempts < 3) {
            console.log("Waiting 5 seconds to retry publishing the notification.");
            await new Promise(res => setTimeout(res, 5000));
        }
    }

    throw new SemanticReleaseError(bodyText || 'Failed to send message after 3 attempts', 'FETCH ERROR');
}