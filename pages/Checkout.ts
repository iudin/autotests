import { ProjectData } from 'data';

const { I } = inject();

class CheckoutPage {
  private static page: CheckoutPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new CheckoutPage();
    }
    return this.page;
  }

  projectData = locate('.project-data');
  projectTitle = locate('h1').inside(this.projectData);

  checkoutDescription = locate('.checkout-desc');
  oneTimeDonation = locate('h5').withText('Some text');
  monthlySubscription = locate('h5').withText('Some text');
  noAccessToPaidContent = locate('p').withText('Some text');

  paymentForm = locate('.project-desc');
  amountInput = locate('input[name="free-payment"]').inside(this.paymentForm);
  subscriptionAmountInput = locate('input[name="custom-payment"]').inside(this.paymentForm);
  cardsSelector = locate('select[name="payment-cards"]').inside(this.paymentForm);
  termsAgreeCheckbox = locate('#agree').inside(this.paymentForm);
  payButton = locate('#pay').withText('Some text');

  async checkProject(project: ProjectData) {
    await I.seeInCurrentUrl(project.url);
    await I.seeElement(this.projectTitle.withText('Some text'));
  }

  async checkIsOneTimeDonationPage() {
    await I.seeInCurrentUrl('lid=op');
    await I.seeElement(this.oneTimeDonation);
    await I.seeElement(this.noAccessToPaidContent);
  }

  async sendSimplePaymentForm() {
    await I.scrollTo(this.paymentForm);
    await I.selectOption(this.cardsSelector, 'Some text');
    await I.click(this.termsAgreeCheckbox);
    await I.click(this.payButton);
  }

  async payFromBalance(amount?: number) {
    await I.scrollTo(this.paymentForm);
    if (amount) {
      await I.clearField(this.amountInput);
      await I.fillField(this.amountInput, amount);
    }
    await I.selectOption(this.cardsSelector, 'Some text');
    await I.click(this.termsAgreeCheckbox);
    await I.click(this.payButton);
  }

  async getSubscriptionAmount() {
    const amount = await I.grabAttributeFrom(this.subscriptionAmountInput, 'value');
    return Number(amount);
  }
}

export const Checkout = CheckoutPage.getPage();
