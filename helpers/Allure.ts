export enum Severity {
  blocker = 'blocker',
  critical = 'critical',
  normal = 'normal',
  minor = 'minor',
}

interface AllureStep {
  name: string;
  callback: () => Promise<void>;
}

const allure = codeceptjs.container.plugins('allure');

class StepsChain {
  private steps: AllureStep[] = [];

  constructor(private removeChain: () => void) {}

  step(name: string, callback: () => Promise<void>): StepsChain {
    this.steps.push({ name, callback });
    return this;
  }

  async run() {
    for (const { name, callback } of this.steps) {
      await allure.createStep(name, callback);
    }
    this.steps = [];
    this.removeChain();
  }
}

class Allure {
  private stepsChains: StepsChain[] = [];

  severity(severity: Severity): Allure {
    allure.severity(severity);
    return this;
  }

  issue(issue: string): Allure {
    allure.issue(issue);
    return this;
  }

  description(description: string): Allure {
    allure.setDescription(description, 'text/plain');
    return this;
  }

  createStepsChain(): StepsChain {
    const chain = new StepsChain(() => this.stepsChains.pop());
    this.stepsChains.push(chain);
    return chain;
  }
}

export default new Allure();
