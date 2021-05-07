<template>
  <v-tooltip bottom color="grey darken-4">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        :right="right"
        :small="small"
        :color="color"
        v-on="on"
        v-bind="attrs"
      >
        {{ icon }}
      </v-icon>
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class AlertTooltip extends Vue {
  @Prop({ default: '' }) readonly color: string;

  @Prop({ default: 'mdi-alert-circle' }) readonly icon: string;

  @Prop({ default: false }) readonly right: boolean;

  @Prop({ default: false }) readonly small: boolean;
}
</script>
