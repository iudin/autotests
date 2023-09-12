import { assert } from 'chai';
import { Project, Checkout, Yoomoney, ThanksPayment, Memberships, Main } from 'pages';
import { MainSteps, MembershipsSteps } from 'step';
import { ProjectData, PaymentCardData } from 'data';
import { Allure } from 'helpers';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

export class PaymentSteps {
  static async makeOneTimeDonationFromNewCard(project: ProjectData, card: PaymentCardData) {
    await Allure.createStepsChain()
      .step('Переход на страницу проекта, на который пользователь не подписан', async () => {
        await I.amOnPage(project.url);
        await I.seeElement(Project.lockMessage);
      })
      .step('Выбор единоразового платежа в уровнях подписки', async () => {
        await Project.goToOneTimeDonation();
      })
      .step('Переход на страницу оформления заказа', async () => {
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Checkout.oneTimeDonation);
        await Checkout.checkIsOneTimeDonationPage();
        await Checkout.checkProject(project);
      })
      .step('Заполнение и отправка формы единоразового платежа', async () => {
        await Checkout.sendSimplePaymentForm();
        await I.wait(3);
      })
      .step('Переход на страницу платежной системы', async () => {
        await Yoomoney.checkIsTestPaymentPage();
      })
      .step('Заполнение и отправка формы с данными банковской карты', async () => {
        await Yoomoney.fillPaymentForm(card);
        await Yoomoney.submitPaymentForm();
      })
      .step('Переход на страницу успешного платежа', async () => {
        await Yoomoney.checkPaymentSuccess();
        const returnLink = await I.grabAttributeFrom(Yoomoney.returnToShopLink, 'href');
        assert.include(returnLink, `${BASE_URL}/project/${project.id}/waiting`);
      })
      .step('Возврат на сайт', async () => {
        await Yoomoney.returnToShop();
      })
      .step('Переход на страницу благодарности за платеж', async () => {
        await ThanksPayment.returnToProject();
      })
      .step('Переход обратно на страницу проекта', async () => {
        await I.seeInCurrentUrl(project.url);
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Project.lockMessage);
      })
      .run();
  }

  static async topUpBalanceFromNewCard(card: PaymentCardData, initialBalance = 0, amount = 1000) {
    await Allure.createStepsChain()
      .step('Проверка нахождения на странице подписок', async () => {
        await Memberships.checkIsMembershipsPage();
      })
      .step('Проверка начального значения баланса', async () => {
        await MainSteps.checkBalanceInProfileMenu(initialBalance);
      })
      .step('Открытие модального окна для пополнения баланса с банковской карты', async () => {
        await Memberships.openTopUpModal();
      })
      .step('Заполнение и отправка формы пополнения баланса', async () => {
        await Memberships.sendTopUpForm(amount);
        await I.wait(3);
      })
      .step('Переход на страницу платежной системы', async () => {
        await Yoomoney.checkIsTestPaymentPage();
      })
      .step('Заполнение и отправка формы с данными банковской карты', async () => {
        await Yoomoney.fillPaymentForm(card);
        await Yoomoney.submitPaymentForm();
      })
      .step('Переход на страницу успешного платежа', async () => {
        await Yoomoney.checkPaymentSuccess();
      })
      .step('Возврат на сайт', async () => {
        await Yoomoney.returnToShop();
      })
      .step('Проверка нахождения на странице подписок', async () => {
        await Memberships.checkIsMembershipsPage();
      })
      .step('Проверка увеличения значения баланса на сумму пополнения', async () => {
        await MainSteps.checkBalanceInProfileMenu(initialBalance + amount);
      })
      .run();
  }

  static async makeOneTimeDonationFromBalance(project: ProjectData, amount = 1000) {
    let currentAmount: number;
    await Allure.createStepsChain()
      .step('Переход на страницу проекта, на который пользователь не подписан', async () => {
        await I.amOnPage(project.url);
        await I.seeElement(Project.lockMessage);
      })
      .step('Cохранение начального значения баланса', async () => {
        currentAmount = await Main.getBalanceFromProfileMenu();
      })
      .step('Выбор единоразового платежа в уровнях подписки', async () => {
        await Project.goToOneTimeDonation();
      })
      .step('Переход на страницу оформления заказа', async () => {
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Checkout.oneTimeDonation);
        await Checkout.checkIsOneTimeDonationPage();
        await Checkout.checkProject(project);
      })
      .step('Заполнение и отправка формы единоразового платежа', async () => {
        await Checkout.payFromBalance(amount);
        await I.wait(3);
      })
      .step('Переход на страницу благодарности за платеж', async () => {
        await ThanksPayment.returnToProject();
      })
      .step('Переход обратно на страницу проекта', async () => {
        await I.seeInCurrentUrl(project.url);
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Project.lockMessage);
      })
      .step('Проверка уменьшения значения баланса на сумму списания', async () => {
        await MainSteps.checkBalanceInProfileMenu(currentAmount - amount);
      })
      .run();
  }

  static async makeSubscriptionFromBalance(project: ProjectData) {
    let currentAmount: number, amount: number;
    await Allure.createStepsChain()
      .step('Переход на страницу проекта, на который пользователь не подписан', async () => {
        await I.amOnPage(project.url);
      })
      .step('Cохранение начального значения баланса', async () => {
        currentAmount = await Main.getBalanceFromProfileMenu();
      })
      .step('Выбор уровня подписки', async () => {
        await Project.goToSubscriptionByLevelName(project.levels[0]);
      })
      .step('Переход на страницу оформления заказа', async () => {
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Checkout.monthlySubscription);
        await Checkout.checkProject(project);
      })
      .step('Сохранение суммы подписки', async () => {
        amount = await Checkout.getSubscriptionAmount();
      })
      .step('Заполнение и отправка формы платежа', async () => {
        await Checkout.payFromBalance();
        await I.wait(3);
      })
      .step('Переход на страницу благодарности за платеж', async () => {
        await ThanksPayment.returnToProject();
      })
      .step('Переход обратно на страницу проекта', async () => {
        await I.seeInCurrentUrl(project.url);
        await Project.checkProjectIsAvailable(project);
      })
      .step('Проверка уменьшения значения баланса на сумму подписки', async () => {
        await MainSteps.checkBalanceInProfileMenu(currentAmount - amount);
      })
      .step('Проверка наличия проекта в списке активных подписок', async () => {
        await MembershipsSteps.checkProjectActiveSubscription(project, amount);
      })
      .step('Проверка наличия подписки на проект в списке событий', async () => {
        await MembershipsSteps.checkEventsInfo(project);
      })
      .step('Проверка наличия подписки на проект в истории платежей', async () => {
        await MembershipsSteps.checkBillingInfo(project, amount);
      })
      .run();
  }

  static async attachNewCard(card: PaymentCardData) {
    await Allure.createStepsChain()
      .step('Проверка нахождения на странице подписок', async () => {
        await Memberships.checkIsMembershipsPage();
      })
      .step('Проверка отсутствия привязанной банковской карты', async () => {
        await I.seeElement(Memberships.notHaveCardText);
      })
      .step('Открытие модального окна привязки карты и отправка формы', async () => {
        await Memberships.goToAttachNewCard();
        await I.wait(3);
      })
      .step('Переход на страницу платежной системы', async () => {
        await Yoomoney.checkIsTestPaymentPage();
      })
      .step('Заполнение и отправка формы с данными банковской карты', async () => {
        await Yoomoney.fillPaymentForm(card);
        await Yoomoney.submitPaymentForm();
      })
      .step('Переход на страницу успешного платежа', async () => {
        await Yoomoney.checkPaymentSuccess();
      })
      .step('Возврат на сайт', async () => {
        await Yoomoney.returnToShop();
        await I.wait(3);
      })
      .step('Переход на страницу подписок', async () => {
        await I.amOnPage(`${BASE_URL}/balance`);
        await Memberships.checkIsMembershipsPage();
      })
      .step('Проверка наличия банковской карты для автопополнения баланса', async () => {
        await I.scrollTo(Memberships.balanceAutoTopUpCheckbox);
        await I.seeElement(Memberships.haveCardText);
      })
      .step('Проверка наличия привязанной банковской карты в методах оплаты', async () => {
        await MembershipsSteps.checkPaymentInfo(card);
      })
      .run();
  }
}
