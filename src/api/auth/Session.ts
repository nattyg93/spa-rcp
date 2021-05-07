import { Model, Attr, HasOne } from 'spraypaint';
import ApplicationRecord from '../ApplicationRecord';
import User from './User';

@Model()
export default class Session extends ApplicationRecord {
  static jsonapiType = 'sessions';

  @Attr() email: string;

  @Attr() password: string;

  @Attr() token: string;

  @HasOne() user: User;
}
