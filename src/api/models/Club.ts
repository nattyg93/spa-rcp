import i18n from '@/plugins/vue-i18n';
import { Attr, Model } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class Club extends ApplicationRecord {
  static jsonapiType = 'clubs';

  static listHeaders() {
    return [
      {
        text: i18n.t('common.labels.rcId'),
        value: 'rcId',
        width: 70,
      },
      {
        text: i18n.t('clubs.name'),
        value: 'name',
      },
      {
        text: i18n.t('clubs.email'),
        value: 'email',
      },
    ];
  }

  static scopeFactory() {
    return Club.includes([]);
  }

  static getRcUri(rcId: number): string {
    return `https://www.ratingscentral.com/ClubInfo.php?ClubID=${rcId}`;
  }

  get rcUri(): string {
    return Club.getRcUri(this.rcId);
  }

  get province(): string {
    return this.naState ? this.naState : this.worldProvince;
  }

  @Attr() rcId: number;

  @Attr() name: string;

  @Attr() nickname: string;

  @Attr() addressOne: string;

  @Attr() addressTwo: string;

  @Attr() city: string;

  @Attr() naState: string;

  @Attr() worldProvince: string;

  @Attr() postalCode: string;

  @Attr() country: string;

  @Attr() email: string;

  @Attr() website: string;

  @Attr() phone: string;

  @Attr() sport: number;

  @Attr() status: string;
}
