<template>
  <v-dialog v-model="show" width="380">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text v-html="description"></v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="(button, i) in buttons"
          :key="i"
          :color="button.color"
          :outlined="button.outlined"
          :text="button.text"
          :depressed="!button.text"
          @click="onClick(button)"
        >
          {{ button.title }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import i18n from '@/plugins/vue-i18n';

@Component({ components: {} })
export default class ConfirmDialog extends Vue {
  @Prop({ default: i18n.t('confirmDialog.defaultTitle') })
  readonly title: string;

  @Prop({ default: i18n.t('confirmDialog.defaultDescription') })
  readonly description: string;

  @Prop({ default: true })
  readonly dark: boolean;

  @Prop({
    default: () => [
      {
        key: 'cancel',
        title: i18n.t('common.cancel'),
        color: 'grey',
        text: true,
      },
      {
        key: 'confirm',
        title: i18n.t('common.confirm'),
        color: 'secondary',
        outlined: false,
      },
    ],
  })
  readonly buttons: ButtonInterface[];

  value = true;

  get show() {
    return this.value;
  }

  set show(v) {
    this.$emit('close');
    this.value = v;
  }

  onClick(button: ButtonInterface) {
    this.$emit('select', button.key);
    this.value = false;
  }
}
</script>
