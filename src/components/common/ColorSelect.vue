<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined rounded color="grey" v-bind="attrs" v-on="on">
        <v-icon left :color="color">mdi-brightness-1</v-icon>
        {{ $t('colorSelect.label') }}
        <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-color-picker
      hide-canvas
      hide-inputs
      show-swatches
      hide-mode-switch
      hide-sliders
      swatches-max-height="200"
      v-model="color"
      class="pt-2 pb-2"
    ></v-color-picker>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, VModel } from 'vue-property-decorator';

@Component({})
export default class ColorSelect extends Vue {
  @VModel({ type: String }) color: string;
}
</script>
