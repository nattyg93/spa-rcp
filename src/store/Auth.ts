import { ApplicationRecord, Session, User } from '@/api';
import nextQuery from '@/nextQuery';
import i18n from '@/plugins/vue-i18n';
import store from '@/store';
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';

@Module({ dynamic: true, namespaced: true, name: 'auth', store })
class AuthModule extends VuexModule {
  ready = false;

  user: User | null = null;

  session: Session | null = null;

  loginHooks: Array<
    (loginData: { user: User; session: Session }) => Promise<void>
  > = [];

  logoutHooks: Array<() => Promise<void>> = [];

  canAccessRoute = false;

  updatingDialog = false;

  dashboardRouteKey = 0;

  get isLoggedIn() {
    return !!this.ready && !!this.user && !!this.session;
  }

  get canAccess() {
    return (roles: string[]): boolean => {
      if (roles.length === 0) {
        return true;
      }
      return roles.some(role => !!this.user && this.user.roles.includes(role));
    };
  }

  // mutations

  @Mutation
  setReady() {
    this.ready = true;
  }

  @Mutation
  addLoginHook(
    hook: (loginData: { user: User; session: Session }) => Promise<void>,
  ) {
    this.loginHooks.push(hook);
  }

  @Mutation
  addLogoutHook(hook: () => Promise<void>) {
    this.logoutHooks.push(hook);
  }

  @Mutation
  setUser(user: User | null) {
    this.user = user;
  }

  @Mutation
  setSession(session: Session | null) {
    this.session = session;
  }

  @Mutation
  setCanAccessRoute(val: boolean) {
    this.canAccessRoute = val;
  }

  @Mutation
  bumpDashboardRouteKey() {
    this.dashboardRouteKey += 1;
  }

  // actions

  @Action({ rawError: true })
  clearAuth() {
    this.setSession(null);
    this.setUser(null);
    ApplicationRecord.jwt = undefined;
  }

  @Action({ rawError: true })
  async setUserInfo({ user, session }: { user: User; session: Session }) {
    // user and session
    await this.setUserSession({ user, session });
  }

  @Action({ rawError: true })
  async setUserSession({ user, session }: { user: User; session: Session }) {
    this.setSession(session);
    this.setUser(user);
  }

  @Action({ rawError: true })
  async login({ email, password }: { email: string; password: string }) {
    try {
      const session = new Session({ email, password });
      await session.save();

      if (session && session.id && session.user.id) {
        ApplicationRecord.jwt = session.token;
        const user = (await User.find(session.user.id)).data;

        await this.setUserInfo({ user, session });
        await this.onLogin();
      }
    } catch (e) {
      this.clearAuth();
      throw e;
    }
  }

  @Action({ rawError: true })
  async registerUser({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      const user = new User({ firstName, lastName, email, password });
      await user.save();

      const session = new Session({ email, password });
      await session.save();

      if (session && session.id && session.user.id) {
        ApplicationRecord.jwt = session.token;

        await this.setUserSession({ user, session });
        await this.onLogin();
      }
    } catch (e) {
      this.clearAuth();
      throw e;
    }
  }

  @Action({ rawError: true })
  async getCurrentUser() {
    try {
      const session = (await Session.first()).data;

      if (session && session.id && session.user.id) {
        const user = (await User.find(session.user.id)).data;

        await this.setUserInfo({ user, session });
        await this.onLogin();
      }
    } catch (e) {
      this.clearAuth();
      throw e;
    }
  }

  @Action({ rawError: true })
  async logout() {
    const session = new Session();
    try {
      await session.destroy();
    } finally {
      await this.onLogout();
      ApplicationRecord.jwt = undefined;
      window.location.href = process.env.BASE_URL;
    }
  }

  @Action({ rawError: true })
  async init() {
    try {
      await this.getCurrentUser();
      // logged in
    } catch {
      // not logged in
    } finally {
      // add redirect on 401 middleware
      ApplicationRecord.middlewareStack.afterFilters.push(response => {
        if (response.status === 401) {
          ApplicationRecord.jwt = undefined;
          window.location.href = `${
            process.env.BASE_URL
          }login?next=${nextQuery()}`;
        }
      });
      // check for updating on 403 middleware
      ApplicationRecord.middlewareStack.afterFilters.push(async response => {
        if (response.status === 403) {
          if (this.isLoggedIn) {
            this.bumpDashboardRouteKey();
          }
        }
      });

      // set ready
      this.setReady();
    }
  }

  // call all other modules that need login data
  @Action({ rawError: true })
  async onLogin() {
    const { user, session } = this;
    if (!user || !session) {
      throw new Error(i18n.t('authModule.alerts.missingUserSession') as string);
    }
    await Promise.all(this.loginHooks.map(hook => hook({ user, session })));
  }

  // call all other modules that need logout data
  @Action({ rawError: true })
  async onLogout() {
    await Promise.all(this.logoutHooks.map(hook => hook()));
  }
}

export default getModule(AuthModule, store);
