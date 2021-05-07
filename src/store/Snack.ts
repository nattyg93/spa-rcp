import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import { JsonapiError } from 'spraypaint';
import store from '@/store';

@Module({ dynamic: true, namespaced: true, name: 'snack', store })
class SnackModule extends VuexModule {
  errors: JsonapiError[] = [];

  snackText = '';

  snackType: 'error' | 'warning' | 'success' | 'none' = 'none';

  @Mutation
  setError({ text, errors }: { text: string; errors: JsonapiError[] }) {
    this.snackText = text;
    this.errors = errors;
    this.snackType = 'error';
  }

  @Mutation
  setWarning(errors: JsonapiError[]) {
    this.snackText = 'Whoops';
    this.errors = errors;
    this.snackType = 'warning';
  }

  @Mutation
  setSuccess(text: string) {
    this.snackText = text;
    this.errors = [];
    this.snackType = 'success';
  }
}

export default getModule(SnackModule, store);
