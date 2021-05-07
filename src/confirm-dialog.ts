import { Vue } from 'vue-property-decorator';

import vuetify from '@/plugins/vuetify';

import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const ConfirmDialogClass = Vue.extend(ConfirmDialog);

export default function confirmDialog(
  propsData: {
    title?: string;
    description?: string;
    buttons?: ButtonInterface[];
  } = {},
): Promise<string | null> {
  return new Promise(resolve => {
    const dialog = new ConfirmDialogClass({
      vuetify,
      propsData,
    });
    dialog.$on('close', () => {
      dialog.$destroy();
      resolve(null);
    });
    dialog.$on('select', (button: string) => {
      dialog.$destroy();
      resolve(button);
    });
    dialog.$mount();
  });
}
