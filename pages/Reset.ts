import { User } from 'helpers';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class ResetPage {
  private static page: ResetPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new ResetPage();
    }
    return this.page;
  }

  submit = locate('input[type="submit"]');
  regEmailInput = locate('input[name="email"]');
  regPasswordInput = locate('input[name="password"]');

  async submitEmail(user: User) {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.regEmailInput);
    await I.fillField(this.regEmailInput, user.email);
    await I.click(this.submit);
  }

  async submitPassword(user: User) {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.regPasswordInput);
    await I.fillField(this.regPasswordInput, user.password);
    await I.click(this.submit);
  }
}

export const Reset = ResetPage.getPage();
