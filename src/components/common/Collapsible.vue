<template>
  <div class="collapsible">
    <div
      class="collapsible__header"
      :class="{ 'collapsible__header--active': visible }"
      @click="visible = !visible"
    >
      <div class="title-underlined pt-2 pb-2">
        <div class="d-flex align-center">
          <v-icon left class="collapsible__indicator">mdi-chevron-right</v-icon>
          <slot name="title">
            <div>
              {{ title }}
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div class="collapsible__content-wrapper">
      <v-expand-transition>
        <div class="collapsible__content" v-show="visible">
          <div class="pt-4">
            <slot></slot>
          </div>
        </div>
      </v-expand-transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class Collapsible extends Vue {
  @Prop({ default: false }) readonly defaultValue: boolean;

  @Prop({ default: '' }) readonly title: string;

  visible = false;

  created() {
    this.visible = this.defaultValue;
  }
}
</script>

<style lang="scss" scoped>
.collapsible {
  &__header {
    cursor: pointer;
  }
  &__header--active &__indicator {
    transform: rotate(90deg);
  }
}
</style>
