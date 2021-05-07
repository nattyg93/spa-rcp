<template>
  <v-tooltip bottom color="grey darken-4">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :small="!xSmall"
        :x-small="xSmall"
        fab
        elevation="0"
        v-on="on"
        v-bind="attrs"
        @click="$emit('click', $event)"
        :disabled="disabled"
      >
        <v-icon color="grey darken-1">
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class TableActionButton extends Vue {
  @Prop({ required: true }) icon: string;

  @Prop({ required: true }) tooltip: string;

  @Prop({ type: Boolean, default: false }) readonly xSmall: boolean;

  @Prop({ type: Boolean, default: false }) readonly disabled: boolean;
}
</script>
