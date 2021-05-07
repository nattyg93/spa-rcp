<template>
  <div class="datetime__container">
    <div class="datetime__field">
      <v-menu
        v-model="dateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        :nudge-top="20"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="formattedDate"
            :label="label"
            append-icon="mdi-calendar-blank-outline"
            readonly
            outlined
            :hide-details="hideDetails"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <div class="pt-2 pb-2 white">
          <v-date-picker no-title v-model="date"></v-date-picker>
        </div>
      </v-menu>
    </div>
    <div class="datetime__field">
      <v-text-field
        v-model="time"
        outlined
        type="time"
        :hide-details="hideDetails"
      ></v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import i18n from '@/plugins/vue-i18n';

import dayjs from 'dayjs';

@Component({})
export default class DatetimeSelect extends Vue {
  @Prop({ default: i18n.t('common.labels.date') }) readonly label: string;

  @Prop({ required: true }) readonly value: string;

  @Prop({ default: false }) readonly hideDetails: boolean;

  dateMenu = false;

  timeMenu = false;

  date = '';

  time = '';

  get datetime() {
    if (this.date && this.time) {
      const [year, month, day] = this.date.split('-');
      const [hour, minute] = this.time.split(':');
      const dt = dayjs(
        new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          parseInt(hour, 10),
          parseInt(minute, 10),
        ),
      );
      return dt.toISOString();
    }
    return '';
  }

  get formattedDate() {
    return this.date ? dayjs(this.date).format('MMMM D, YYYY') : '';
  }

  mounted() {
    if (this.value) {
      const dt = dayjs(this.value);
      if (dt.isValid()) {
        this.date = dt.format('YYYY-MM-DD');
        this.time = dt.format('HH:mm');
      }
    }
  }

  @Watch('value', { immediate: true })
  valueChanged() {
    if (this.value) {
      const dt = dayjs(this.value);
      if (dt.isValid()) {
        this.date = dt.format('YYYY-MM-DD');
        this.time = dt.format('HH:mm');
      }
    }
  }

  @Watch('datetime')
  datetimeChanged() {
    this.$emit('input', this.datetime);
  }
}
</script>

<style lang="scss" scoped>
.datetime {
  &__container {
    display: flex;
  }

  &__field {
    flex: 1 1 0;

    & + & {
      margin-left: 1rem;
    }
  }
}
</style>
