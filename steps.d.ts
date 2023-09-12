/// <reference types='codeceptjs' />
type steps_file = typeof import('steps_file');
type Pages = typeof import('pages');

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
    login: (name: string) => void;
    check: (name: string) => void;
  }
  interface Methods extends PlaywrightTs {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
