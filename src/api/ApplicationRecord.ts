import { apiBase, apiNamespace, useCookies } from '@/config';
import Cookies from 'js-cookie';
import { cloneDeep } from 'lodash';
import { MiddlewareStack, Model, Scope, SpraypaintBase } from 'spraypaint';

@Model()
export default class ApplicationRecord extends SpraypaintBase {
  static baseUrl = apiBase;

  static apiNamespace = apiNamespace;

  static url(id?: string | number): string {
    // add Django's trailing slash
    return `${super.url(id)}/`;
  }

  static generateAuthHeader(token: string) {
    return `Token ${token}`;
  }

  static setJWT(jwt: string | undefined) {
    if (useCookies) {
      return;
    }
    if (jwt) {
      Cookies.set('token', jwt);
    } else {
      Cookies.remove('token');
    }
  }

  static getJWT(): string | undefined {
    if (useCookies) {
      return undefined;
    }
    return Cookies.get('token');
  }

  static listHeaders(): object[] {
    throw new Error('add list headers to Class');
  }

  static scopeFactory(): Scope<ApplicationRecord> {
    throw new Error('add scope factory to Class');
  }

  // hack to keep reactivity
  rollback() {
    // eslint-disable-next-line
    Object.entries((this as any)._originalAttributes).forEach(entry => {
      (this as { [key: string]: unknown })[entry[0]] = cloneDeep(entry[1]);
    });
  }
}

const middlewareStack = new MiddlewareStack();

// add jsonAPI errors to response
middlewareStack.afterFilters.push(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: ResponseExt, json: { [index: string]: any }) => {
    response.errors = json.errors || [];
  },
);

middlewareStack.beforeFilters.push((url, options) => {
  const csrf = Cookies.get('csrftoken');
  if (csrf) {
    (options.headers as HeadersExt)['X-CSRFTOKEN'] = csrf;
  }
  options.credentials = useCookies ? 'include' : 'omit';
});

ApplicationRecord.middlewareStack = middlewareStack;
