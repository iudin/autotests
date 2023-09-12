class SuccessfulRegistrationPage {
  private static page: SuccessfulRegistrationPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new SuccessfulRegistrationPage();
    }
    return this.page;
  }

  title = 'Some text';
  successPageClass = locate('.success');
  returnToMain = locate('.page .btn');
}

export const SuccessfulRegistration = SuccessfulRegistrationPage.getPage();
