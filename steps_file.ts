// in this file you can append custom step methods to 'I' object

export = function () {
  return actor({
    loginUser(email, pwd) {
      this.clearCookie();
      this.amOnPage('/');
      this.amOnPage('/signin');
      this.fillField('[name="password"]', email);
      this.fillField('[name="email"]', secret(pwd));
      this.click('.submit');
      this.wait(2);
    },
    restore(cookies) {
      this.setCookie(cookies);
      this.amOnPage('/');
    },
    getByTestId(id: string) {
      return locate(`[data-testid="${id}"]`);
    },
  });
};
