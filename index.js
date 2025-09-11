import verifyNotification from './lib/verifyConditions.js';
import successNotify from './lib/success.js';

let verified;

export async function verifyConditions(pluginConfig, context) {
  await verifyNotification(pluginConfig, context);
  verified = true;
}

export async function success(pluginConfig, context) {
  if (!verified) {
    verified = await verifyNotification(pluginConfig, context);
  }

  if (!verified) {
    context.logger.error('Skipping notification due to failed verification of configuration.');
    return;
  }
  return successNotify(pluginConfig, context);
}