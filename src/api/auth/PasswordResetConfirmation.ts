import { Model, Attr } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class PasswordResetConfirmation extends ApplicationRecord {
  static jsonapiType = 'password-reset-confirmations';

  static setPassword({
    uid,
    token,
    newPassword1,
    newPassword2,
    firstName,
    lastName,
  }: {
    uid: string;
    token: string;
    newPassword1: string;
    newPassword2: string;
    firstName?: string;
    lastName?: string;
  }) {
    const passConfirm = new PasswordResetConfirmation({
      uid,
      token,
      newPassword1,
      newPassword2,
      firstName,
      lastName,
    });
    return passConfirm.save();
  }

  @Attr() uid: string;

  @Attr() token: string;

  @Attr() newPassword1: string;

  @Attr() newPassword2: string;

  @Attr() firstName: string;

  @Attr() lastName: string;
}
