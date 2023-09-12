import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class ThanksPaymentPage {
  private static page: ThanksPaymentPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new ThanksPaymentPage();
    }
    return this.page;
  }

  thanksBlock = locate('article');
  returnToProjectButton = locate('a.btn').withText('Some text').inside(this.thanksBlock);

  async returnToProject() {
    await I.seeInCurrentUrl(`${BASE_URL}/after-payment`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.thanksBlock);
    await I.seeElement(this.returnToProjectButton);
    await I.click(this.returnToProjectButton);
  }
}

export const ThanksPayment = ThanksPaymentPage.getPage();
