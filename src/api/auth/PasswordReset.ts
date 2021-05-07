import { Model, Attr } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class PasswordReset extends ApplicationRecord {
  static jsonapiType = 'password-resets';

  static async resetPassword(email: string) {
    const passReset = new PasswordReset({ email });
    return passReset.save();
  }

  @Attr() email: string;
}
