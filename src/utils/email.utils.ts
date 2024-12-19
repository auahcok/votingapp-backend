import ejs from 'ejs';
import { emailTemplates } from '../../templates/reset-password';

export type EmailTemplates = {
  'reset-password': {
    resetLink: string;
    userName: string;
  };
};

export const renderTemplate = <T extends keyof EmailTemplates>(
  template: T,
  payload: EmailTemplates[T],
): string => {
  const emailTemplate = emailTemplates[template];
  const compiledTemplate = ejs.compile(emailTemplate);
  return compiledTemplate(payload);
};
