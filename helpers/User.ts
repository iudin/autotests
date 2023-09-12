import { generate } from 'randomstring';
import { UserData, UserTypes, toCorpEmail, userNamesMap, userTypeToEmail } from 'data/users';

export class User {
  private constructor(private data: UserData) {}

  static create = (type?: UserTypes): User => {
    if (!type) {
      const name = generate(7);
      return new User({ name, email: toCorpEmail(name), password: name });
    }
    const name = userNamesMap[type];
    const email = userTypeToEmail(type);
    return new User({ name, email, password: email });
  };

  get name() {
    return this.data.name;
  }

  get email() {
    return this.data.email;
  }

  get password() {
    return this.data.password;
  }

  wrongEmail() {
    this.data.email = this.email.replace('@some-url.com', '');
    return this;
  }

  changePassword(newPassword: string) {
    this.data.password = newPassword;
    return this;
  }
}
