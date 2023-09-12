import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();
export class UtilSteps {
  static async approveActionByEmailLink(email: string, page: string) {
    let pageWithAction = page;
    if (page === null) {
      pageWithAction = UtilSteps.createLinkForUsersEmail(email);
    }
    await I.wait(3);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).amOnPage(pageWithAction);
    const button = locate("//a[contains(text(), 'Some text')]");
    await I.waitForElement(button, 15);
    await I.click(button);
    await I.wait(5);
    return pageWithAction;
  }

  static createLinkForUsersEmail(email: string) {
    const date = new Date()
      .toISOString()
      .substring(0, 16)
      .replace(/[\-:T]/gi, '');
    const username = email.split('@')[0].replace('+', '_');
    return `${BASE_URL}/mail-html/${username}_some-url.com/${date}-1.html`;
  }
}
