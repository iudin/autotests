import { Allure, User } from 'helpers';
import { defaultMastercard, projects } from 'data';
import { Signup, Main, Memberships } from 'pages';
import { AuthSteps, PaymentSteps } from 'step';
import { BASE_URL } from 'tests/constants';

Feature('Working with balance');

const project = projects.project3;

Before(async ({ I }) => {
  await Allure.createStepsChain()
    .step('Регистрация нового пользователя', async () => {
      await I.amOnPage(`${BASE_URL}/signup`);
      const user = User.create();
      await AuthSteps.auth(Signup, user);
      await I.wait(3);
    })
    .step('Переход на страницу баланса', async () => {
      await I.amOnPage(`${BASE_URL}/balance`);
    })
    .run();
});

After(async ({ I }) => {
  await Allure.createStepsChain()
    .step('Переход на главную страницу и проверка баланса', async () => {
      await I.amOnPage(BASE_URL);
      const currentAmount = await Main.getBalanceFromProfileMenu();
      if (currentAmount) {
        await Allure.createStepsChain()
          .step('Обнуление баланса через единоразовый платеж', async () => {
            await PaymentSteps.makeOneTimeDonationFromBalance(projects.project2, currentAmount);
          })
          .run();
      }
    })
    .step('Очищение кук', async () => {
      await I.clearCookie();
    })
    .run();
});

Scenario('Top up balance and subscribe to project', async () => {
  await Allure.createStepsChain()
    .step('Пополнение баланса с новой карты', async () => {
      await PaymentSteps.topUpBalanceFromNewCard(defaultMastercard);
    })
    .step('Подписка на проект через оплату с баланса', async () => {
      await PaymentSteps.makeSubscriptionFromBalance(project);
    })
    .run();
});

Scenario('Attach and delete payment card', async ({ I }) => {
  await Allure.createStepsChain()
    .step('Привязка новой банковской карты', async () => {
      await PaymentSteps.attachNewCard(defaultMastercard);
    })
    .step('Удаление карты из списка методов платежа', async () => {
      await Memberships.deletePaymentMethod();
    })
    .step('Проверка отсутствия привязки банковской карты', async () => {
      await I.amOnPage(`${BASE_URL}/balance`);
      await Memberships.checkIsMembershipsPage();
      await I.scrollTo(Memberships.balanceAutoTopUpCheckbox);
      await I.seeElement(Memberships.notHaveCardText);
    })
    .run();
});
