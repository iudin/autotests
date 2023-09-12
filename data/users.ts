export enum UserTypes {
  free = 'free',
  subscriber = 'subscriber',
  author = 'author',
}

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export const toCorpEmail = (name: string) => `${name}@some-url.com`;

export const userTypeToEmail = (type: UserTypes) => `autotest+${type}@some-url.com`;

export const userNamesMap: Record<UserTypes, string> = {
  [UserTypes.free]: 'Free',
  [UserTypes.subscriber]: 'Subscriber',
  [UserTypes.author]: 'Author',
};

export const users = Object.values(UserTypes).map(userTypeToEmail);
