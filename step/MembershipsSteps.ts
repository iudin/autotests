import { assert } from 'chai';
import { Memberships } from 'pages';
import { PaymentCardData, ProjectData } from 'data';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

export class MembershipsSteps {
  static async checkProjectActiveSubscription(project: ProjectData, amount: number) {
    await I.amOnPage(`${BASE_URL}/subscribe`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Memberships.activeSubscriptionsTitle);
    const row = locate('tr')
      .withAttr({ 'data-id': `${project.id}`, 'data-status': 'active', 'data-amount': `${amount}` })
      .inside(Memberships.tableBody);
    await I.seeElement(row);
    await I.seeElement(locate('td').withText('Some text'));
    await I.seeElement(locate('td').withText('Some text'));
    await I.seeElement(locate('td').withText('Some text'));

    const projectLink = locate('a.project_title').inside(row);
    const title = await I.grabTextFrom(projectLink);
    const href = await I.grabAttributeFrom(projectLink, 'href');

    assert.strictEqual(
      title.trim(),
      project.name,
      `Название проекта не совпадает с ${project.name}`
    );
    assert.include(href, project.url, `Ссылка на проект не совпадает с ${project.url}`);
  }

  static async checkEventsInfo(project: ProjectData) {
    await I.amOnPage(`${BASE_URL}/events`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Memberships.eventsTitle);
    const row = locate('tr.short').inside(Memberships.tableBody);
    await I.seeElement(row);
    await I.seeElement(locate('td').withText(project.name));
  }

  static async checkBillingInfo(project: ProjectData, amount: number) {
    await I.amOnPage(`${BASE_URL}/billing`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Memberships.billingTitle);
    const row = locate('tr.payment_succeeded').inside(Memberships.tableBody);
    await I.seeElement(row);
    await I.seeElement(locate('td').withText(`${amount}`));

    const projectLink = locate('a').inside('td').inside(row);
    const title = await I.grabTextFrom(projectLink);
    const href = await I.grabAttributeFrom(projectLink, 'href');

    assert.strictEqual(
      title.trim(),
      project.name,
      `Название проекта не совпадает с ${project.name}`
    );
    assert.include(href, project.url, `Ссылка на проект не совпадает с ${project.url}`);
  }

  static async checkPaymentInfo(card: PaymentCardData) {
    await I.amOnPage(`${BASE_URL}/payment`);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Memberships.paymentTitle);
    const row = locate('tr').withAttr({ 'data-system': 'system' }).inside(Memberships.tableBody);

    await I.seeElement(row);
    await I.see(card.system, row);
    await I.see(card.number.slice(-4), row);
    await I.see('Some text', row);
    await I.see(card.expiryMonth, row);
    await I.see(card.expiryYear, row);
  }
}
