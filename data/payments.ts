export interface PaymentCardData {
  system: 'MasterCard' | 'Visa';
  number: string;
  expiryMonth: string;
  expiryYear: string;
  secretCode: string;
}

export const defaultMastercard: PaymentCardData = {
  system: 'MasterCard',
  number: '5555555555554444',
  expiryMonth: '01',
  expiryYear: '30',
  secretCode: '123',
};
