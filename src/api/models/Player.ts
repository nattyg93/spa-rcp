import i18n from '@/plugins/vue-i18n';
import { Attr, Model } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';

@Model()
export default class Player extends ApplicationRecord {
  static jsonapiType = 'players';

  static listHeaders() {
    return [
      {
        text: i18n.t('common.labels.rcId'),
        value: 'rcId',
        width: 70,
      },
      {
        text: i18n.t('players.playerRating'),
        value: 'playerRating',
        width: 150,
      },
      {
        text: i18n.t('players.name'),
        value: 'name',
      },
      {
        text: i18n.t('players.primaryClub'),
        value: 'rcPrimaryClubId',
      },
      {
        text: i18n.t('players.lastPlayed'),
        value: 'lastPlayed',
      },
    ];
  }

  static scopeFactory() {
    return Player.includes([]);
  }

  get rcUri(): string {
    return `https://www.ratingscentral.com/Player.php?PlayerID=${this.rcId}`;
  }

  get playerRating(): string {
    return `${this.rating} ± ${this.stDev}`;
  }

  get province(): string {
    return this.naState ? this.naState : this.worldProvince;
  }

  @Attr() rcId: number;

  @Attr() rating: number;

  @Attr() stDev: number;

  @Attr() lastPlayed: string;

  @Attr() rcPrimaryClubId: number;

  @Attr() name: string;

  @Attr() addressOne: string;

  @Attr() addressTwo: string;

  @Attr() city: string;

  @Attr() naState: string;

  @Attr() worldProvince: string;

  @Attr() postalCode: string;

  @Attr() country: string;

  @Attr() email: string;

  @Attr() birth: string;

  @Attr() gender: string;

  @Attr() sport: number;

  @Attr() usattId: number;

  @Attr() ttaId: number;

  @Attr() ittfId: number;

  @Attr() deceased: boolean;
}
