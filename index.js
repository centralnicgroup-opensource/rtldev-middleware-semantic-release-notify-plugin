import verifyNotification from './lib/verifyConditions.js';
import successNotify from './lib/success.js';

let verified;

export async function verifyConditions(pluginConfig, context) {
  await verifyNotification(pluginConfig, context);
  verified = true;
}

export async function success(pluginConfig, context) {
  if (!verified) {
    await verifyNotification(pluginConfig, context);
    verified = true;
  }

  return successNotify(pluginConfig, context);
}