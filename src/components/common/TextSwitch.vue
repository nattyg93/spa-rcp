<template>
  <v-item-group class="text-switch" mandatory v-model="index">
    <div class="text-switch__slider" ref="slider" :style="sliderStyle"></div>
    <v-item
      v-slot="{ active, toggle }"
      v-for="(item, i) in items"
      :key="i"
      ref="items"
    >
      <div
        @click="toggle"
        class="text-switch__item"
        :class="{ 'text-switch__item--active': active }"
      >
        {{ item.text }}
      </div>
    </v-item>
  </v-item-group>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, VModel } from 'vue-property-decorator';

@Component({})
export default class TextSwitch extends Vue {
  @VModel({ type: Number, required: true }) index!: number;

  @Prop() readonly items: Array<{ text: string; value: string }>;

  x = 0;

  y = 0;

  w = 0;

  h = 0;

  get elements() {
    return this.$refs.items as Vue[];
  }

  get sliderStyle() {
    return `left: ${this.x}px; top: ${this.y}px; width: ${this.w}px; height: ${this.h}px;`;
  }

  setSliderSize() {
    const el = this.elements[this.index].$el as HTMLElement;
    this.x = el.offsetLeft;
    this.y = el.offsetTop;
    this.w = el.offsetWidth;
    this.h = el.offsetHeight;
  }

  mounted() {
    window.setTimeout(this.setSliderSize, 200);
    window.addEventListener('resize', this.setSliderSize);
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.setSliderSize);
  }

  @Watch('index')
  indexChanged() {
    this.setSliderSize();
  }
}
</script>
