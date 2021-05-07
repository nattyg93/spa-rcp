<template>
  <v-menu offset-y left dense :min-width="menuWidth" :max-width="menuWidth">
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom color="grey darken-4">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :small="!xSmall"
            :x-small="xSmall"
            fab
            elevation="0"
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
            :disabled="disabled"
          >
            <v-icon :color="iconColour">
              {{ icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ tooltip }}</span>
      </v-tooltip>
    </template>
    <v-list :dense="menuDense" class="tmb-list">
      <slot></slot>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class TableMenuButton extends Vue {
  @Prop({ required: true }) icon: string;

  @Prop({ required: true }) tooltip: string;

  @Prop({ type: Boolean, default: false }) readonly xSmall: boolean;

  @Prop({ type: Boolean, default: true }) readonly menuDense: boolean;

  @Prop({ type: Boolean, default: false }) readonly disabled: boolean;

  @Prop({ type: Boolean, default: false }) readonly isActive: boolean;

  @Prop() readonly menuWidth: number;

  get iconColour() {
    return this.isActive ? 'primary' : 'grey darken-1';
  }
}
</script>

<style lang="scss">
.tmb-list {
  .v-list-item .v-list-item__title {
    font-weight: 400;
  }
}
</style>
