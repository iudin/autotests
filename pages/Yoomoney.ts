import { PaymentCardData } from 'data';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class YoomoneyPage {
  private static page: YoomoneyPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new YoomoneyPage();
    }
    return this.page;
  }

  testPaymentInformer = locate('.qa-informer-title').inside('div[type="informer"]');

  paymentForm = locate('.qa-payment-option').withAttr({ 'data-qa-payment-option-type': 'anyCard' });
  cardNumberInput = locate('input[name="card-number"]').inside(this.paymentForm);
  expiryMonthInput = locate('input[name="expiry-month"]').inside(this.paymentForm);
  expiryYearInput = locate('input[name="expiry-year"]').inside(this.paymentForm);
  securityCodeInput = locate('input[name="security-code"]').inside(this.paymentForm);
  payButton = locate('button[type="submit"]').inside(this.paymentForm);

  successPageInfo = locate('.qa-final-page');
  successPageTitle = locate('.qa-final-page-island-title').withText('Some text');
  successPageTestInformer = locate('.qa-informer')
    .withText('Some text')
    .inside(this.successPageInfo);
  returnToShopLink = locate('a').withText('Some text');

  async checkIsTestPaymentPage() {
    await I.seeInCurrentUrl('yoomoney.ru/checkout/payments/v2/contract');
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.testPaymentInformer);
    await I.seeElement(this.paymentForm);
  }

  async fillPaymentForm(card: PaymentCardData) {
    await I.scrollTo(this.cardNumberInput);
    await I.fillField(this.cardNumberInput, card.number);
    await I.fillField(this.expiryMonthInput, card.expiryMonth);
    await I.fillField(this.expiryYearInput, card.expiryYear);
    await I.fillField(this.securityCodeInput, secret(card.secretCode));
  }

  async submitPaymentForm() {
    await I.scrollTo(this.payButton);
    await I.click(this.payButton);
    await I.wait(5);
  }

  async checkPaymentSuccess() {
    await I.seeInCurrentUrl('yoomoney.ru/checkout/payments/v2/success');
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.successPageInfo);
    await I.seeElement(this.successPageTitle);
    await I.seeElement(this.successPageTestInformer);
  }

  async returnToShop() {
    await I.scrollTo(this.returnToShopLink);
    await I.click(this.returnToShopLink);
  }
}

export const Yoomoney = YoomoneyPage.getPage();
