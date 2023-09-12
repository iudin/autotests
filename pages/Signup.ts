import { User } from 'helpers';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class SignupPage {
  private static page: SignupPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new SignupPage();
    }
    return this.page;
  }

  submit = locate('input[type="submit"]');
  regNameInput = locate('input[name="name"]');
  regEmailInput = locate('input[name="email"]');
  regPasswordInput = locate('input[name="password"]');
  termsAgreeCheckbox = locate('#terms_agree');
  switchToAuth = locate('a').withText('Some text');

  async fillForm(user: User) {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.regNameInput);
    await I.scrollTo(this.regNameInput);
    await I.fillField(this.regNameInput, user.name);
    await I.fillField(this.regEmailInput, user.email);
    await I.fillField(this.regPasswordInput, secret(user.password));
    await I.checkOption(this.termsAgreeCheckbox);
  }

  async submitForm() {
    await I.click(this.submit);
  }
}

export const Signup = SignupPage.getPage();
