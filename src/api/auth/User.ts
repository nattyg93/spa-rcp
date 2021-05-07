import i18n from '@/plugins/vue-i18n';
import { Attr, Model } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class User extends ApplicationRecord {
  static jsonapiType = 'users';

  static async register(email: string, password: string) {
    const user = new User({ email, password });
    await user.save();
    return user;
  }

  static listHeaders() {
    return [
      {
        text: i18n.t('common.labels.id'),
        value: 'id',
        width: 70,
      },
      {
        text: i18n.t('common.labels.email'),
        value: 'email',
      },
      {
        text: i18n.t('users.labels.fullName'),
        value: 'fullName',
      },
    ];
  }

  static scopeFactory() {
    return User.includes([]);
  }

  @Attr() firstName: string;

  @Attr() lastName: string;

  @Attr() email: string;

  // write only
  @Attr() password: string;

  @Attr() currentPassword: string;

  @Attr() picture: string;

  @Attr() roles: string[];

  changePassword(currentPassword: string, newPassword: string) {
    const user = new User({
      id: this.id,
      password: newPassword,
      currentPassword,
    });
    return user.save();
  }

  get fullName() {
    const first = this.firstName || '';
    const last = this.lastName || '';
    if (first || last) {
      return `${first} ${last}`;
    }
    return this.email;
  }
}
