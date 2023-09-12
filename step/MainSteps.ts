import { assert } from 'chai';
import { Main } from 'pages';
import { User } from 'helpers';

export class MainSteps {
  static async userOnPage(user: User) {
    const userName = await Main.getUserName();
    assert.include(userName, user.name, `Имя юзера ${user.name} не найдено в заголовке страницы`);
  }

  static async checkBalanceInProfileMenu(amount: number) {
    const currentAmount = await Main.getBalanceFromProfileMenu();
    assert.strictEqual(
      currentAmount,
      amount,
      `Сумма баланса ${currentAmount} не совпадает с ожидаемой: ${amount}`
    );
  }
}
