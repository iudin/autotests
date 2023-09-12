export const BASE_URL = 'https://some-url.com';
export const TEST_MAILER_TIMEOUT = 60;
export const MIN_RETRY_TIMEOUT = 2000; //milliseconds
export const NUMBER_OF_RETRIES = 3;

export const PAGE_LOADING_RETRY_PARAMS = {
  retries: NUMBER_OF_RETRIES,
  minTimeout: MIN_RETRY_TIMEOUT,
};
