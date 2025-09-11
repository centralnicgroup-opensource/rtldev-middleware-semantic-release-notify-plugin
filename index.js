import verifyNotification from './lib/verifyConditions.js';
import successNotify from './lib/success.js';

let verified;

export async function verifyConditions(pluginConfig, context) {
  await verifyNotification(pluginConfig, context);
  verified = true;
}

export async function success(pluginConfig, context) {
  if (!verified) {
    try {
      await verifyNotification(pluginConfig, context);
      verified = true;
    } catch (error) {
      context.logger.log('Warning: Configuration verification failed, skipping Teams notification:', error.message);
      return;
    }
  }

  try {
    return await successNotify(pluginConfig, context);
  } catch (error) {
    // Never fail the semantic release due to notification issues - just log warnings
    context.logger.log('Warning: Teams notification failed, but continuing with release:', error.message);
    return;
  }
}