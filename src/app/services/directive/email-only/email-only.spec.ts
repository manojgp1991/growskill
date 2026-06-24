import { EmailOnly } from './email-only';

describe('EmailOnly', () => {
  it('should create an instance', () => {
    const directive = new EmailOnly();
    expect(directive).toBeTruthy();
  });
});
