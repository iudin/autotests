import { assert } from 'chai';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class MembershipsPage {
  private static page: MembershipsPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new MembershipsPage();
    }
    return this.page;
  }

  title = locate('h1').withText('Some text');
  tabs = locate('h1 + .box');
  balanceTab = locate('a').withAttr({ href: '/balance/' }).withText('Some text').inside(this.tabs);
  activeSubscriptionsTab = locate('a')
    .withAttr({ href: '/subscribe/' })
    .withText('Some text')
    .inside(this.tabs);
  followedProjectsTab = locate('a')
    .withAttr({ href: '/follow/' })
    .withText('Some text')
    .inside(this.tabs);
  eventsTab = locate('a').withAttr({ href: '/events/' }).withText('Some text').inside(this.tabs);
  paymentsHistoryTab = locate('a')
    .withAttr({ href: '/billing/' })
    .withText('Some text')
    .inside(this.tabs);
  paymentMethodsTab = locate('a')
    .withAttr({ href: '/payment/' })
    .withText('Some text')
    .inside(this.tabs);

  balanceTitle = locate('.u-title').withText('Some text');
  topUpButton = locate('#balance').withText('Some text');
  balanceAutoTopUpCheckbox = locate('#balance');
  haveCardText = locate('.card').withText('Some text');
  notHaveCardText = locate('.no-card').withText('Some text');

  topUpModal = locate('.wrap').withAttr({ 'data-window': 'add' });
  cardsSelector = locate('select[name="cards"]').inside(this.topUpModal);
  amountInput = locate('input[name="free-payment"]').inside(this.topUpModal);
  topUpTermsAgreeCheckbox = locate('#balance_terms').inside(this.topUpModal);
  payButton = locate('#balance_pay').withAttr({ value: 'Пополнить' }).inside(this.topUpModal);

  editCardModal = locate('.window-wrap').withAttr({ 'data-window': 'edit' });
  editCardTermsAgreeCheckbox = locate('#terms').inside(this.editCardModal);
  editCardButton = locate('#pay').withText('Some text');

  attachCardModal = locate('.wrap').withAttr({ 'data-window': 'attach' });
  addNewPaymentMethod = locate('a').withText('Some text').inside(this.attachCardModal);

  activeSubscriptionsTitle = locate('.title').withText('Some text');
  tableBody = locate('#list');

  eventsTitle = locate('.title').withText('Some text');
  billingTitle = locate('.title').withText('Some text');
  paymentTitle = locate('.title').withText('Some text');

  async checkIsMembershipsPage() {
    await I.seeInCurrentUrl('/url');
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.title, 3);
    await I.seeElement(this.tabs);
  }

  async openTopUpModal() {
    await I.scrollTo(this.topUpButton);
    await I.click(this.topUpButton);
    await I.waitForVisible(this.topUpModal);
  }

  async sendTopUpForm(amount: number) {
    await I.selectOption(this.cardsSelector, 'Some text');
    await I.clearField(this.amountInput);
    await I.fillField(this.amountInput, amount);
    await I.click(this.topUpTermsAgreeCheckbox);
    await I.click(this.payButton);
  }

  async goToAttachNewCard() {
    await I.scrollTo(this.balanceAutoTopUpCheckbox);
    await I.click(this.balanceAutoTopUpCheckbox);
    await I.waitForVisible(this.editCardModal);

    await I.click(this.editCardTermsAgreeCheckbox);
    await I.click(this.editCardButton);
    await I.waitForVisible(this.attachCardModal);

    await I.click(this.addNewPaymentMethod);
  }

  async deletePaymentMethod() {
    await I.amOnPage(`${BASE_URL}/payment`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.paymentTitle);

    const row = locate('tr').withAttr({ 'data-system': 'system' }).inside(this.tableBody);
    const menuTrigger = locate('a.nav').inside(row);
    const menuPopper = locate('.nav').inside(row);
    const deleteMethodButton = locate('a').withText('Some text');

    await I.moveCursorTo(menuTrigger);
    await I.moveCursorTo(menuPopper);

    await I.usePlaywrightTo('check and close alert dialog', async ({ page }) => {
      try {
        page.on('dialog', (dialog) => {
          dialog.accept();
        });
      } catch (error) {
        assert.fail('alert dialog error', error);
      }
    });
    await I.click(deleteMethodButton);
    await I.wait(1);
  }
}

export const Memberships = MembershipsPage.getPage();
