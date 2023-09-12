import { Reset, Main, Signin } from 'pages';
import { UtilSteps } from 'step';
import { User } from 'helpers';

const { I } = inject();

interface AuthPage {
  fillForm: (user: User) => Promise<void>;
  submitForm: () => Promise<void>;
}

export class AuthSteps {
  static async auth(page: AuthPage, user: User) {
    await page.fillForm(user);
    await page.submitForm();
  }

  static async resetPassword(user: User, page: string) {
    await Reset.submitEmail(user);
    const pageWithAction = await UtilSteps.approveActionByEmailLink(user.email, page);
    await I.switchToNextTab();
    await Reset.submitPassword(user);
    return pageWithAction;
  }

  static async goToResetPageFromMainPageBurger() {
    await Main.goToSigninPageThroughBurger();
    await I.seeInCurrentUrl('/signin');
    await Signin.goToResetPage();
    await I.seeInCurrentUrl('/reset');
  }
}
