import { User } from 'helpers';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class SigninPage {
  private static page: SigninPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new SigninPage();
    }
    return this.page;
  }

  submit = locate('input[type="submit"]');
  resetPassword = locate('a[href="/reset/"]');
  authEmailInput = locate('input[name="email"]');
  authPasswordInput = locate('input[name="password"]');
  switchToRegister = locate('a').withText('Some text');
  error = locate('.error');

  async fillForm(user: User) {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.authEmailInput);
    await I.scrollTo(this.authEmailInput);
    await I.fillField(this.authEmailInput, user.email);
    await I.fillField(this.authPasswordInput, secret(user.password));
  }

  async submitForm() {
    await I.click(this.submit);
  }

  async catchError() {
    await I.waitForElement(this.error, 20);
    await I.see('Some text', this.error);
  }

  async goToResetPage() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.resetPassword);
    await I.click(this.resetPassword);
    await I.seeInCurrentUrl('/reset');
  }
}

export const Signin = SigninPage.getPage();
