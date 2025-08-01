import {setDependency} from '@stashl/iocdi';
import type {EmailConfig} from './types';

export function initializeEmail() {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_APP_PASSWORD, process.env.EMAIL_FROM);

  const emailConfig: EmailConfig = {
    gmail: {
      user: process.env.EMAIL_USER || '',
      appPassword: process.env.EMAIL_APP_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || '',
  };

  setDependency('emailConfig', emailConfig);
}
