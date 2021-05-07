<template>
  <div class="drag-accordion">
    <nested-drag :items="items" :disabled="disableDrag" @move="moveItem">
      <template v-slot:default="attrs">
        <div @click="setAccordion(attrs.item)" class="drag-accordion__heading">
          <v-icon
            left
            class="flex-shrink-0"
            :class="{
              'drag-accordion__indicator--active': attrs.item === selected,
            }"
          >
            mdi-chevron-down
          </v-icon>
          <slot v-bind="attrs"></slot>
        </div>
      </template>
      <template v-slot:content="attrs">
        <v-expand-transition>
          <div v-show="attrs.item === selected">
            <div class="drag-accordion__content">
              <slot name="content" v-bind="attrs"></slot>
            </div>
          </div>
        </v-expand-transition>
      </template>
    </nested-drag>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NestedDrag from '@/components/common/NestedDrag.vue';

@Component({
  components: {
    NestedDrag,
  },
})
export default class DragAccordion extends Vue {
  @Prop({ default: () => [] }) readonly items: object[];

  @Prop({ default: false }) readonly disableDrag: boolean;

  selected: object | null = null;

  moveItem(movedItem: object, parentId: string | null, newIndex: number) {
    this.$emit('move', movedItem, parentId, newIndex);
  }

  setAccordion(item: object) {
    this.selected = this.selected === item ? null : item;
  }
}
</script>

<style lang="scss" scoped>
.drag-accordion__heading {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.drag-accordion__content {
  padding-top: 1rem;
}
.drag-accordion__indicator--active {
  transform: rotate(-180deg);
}
</style>
