<template>
  <div>
    <v-simple-table class="alt-summary-table">
      <thead>
        <tr>
          <th>
            {{ $t('clubs.summary.title') }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('common.labels.rcId') }}</td>
          <td>
            <a :href="club.rcUri" target="_blank">{{ club.rcId }}</a>
          </td>
        </tr>
        <tr>
          <td>{{ $t('clubs.name') }}</td>
          <td>{{ club.name }}</td>
        </tr>
        <tr>
          <td>{{ $t('clubs.nickname') }}</td>
          <td>{{ club.nickname }}</td>
        </tr>
        <tr>
          <td>{{ $t('clubs.province') }}</td>
          <td>{{ club.province }}</td>
        </tr>
        <tr>
          <td>{{ $t('clubs.country') }}</td>
          <td>{{ club.country }}</td>
        </tr>
        <tr>
          <td>{{ $t('clubs.email') }}</td>
          <td>
            <a v-if="club.email" :href="`mailto:${club.email}`">
              {{ club.email }}
            </a>
          </td>
        </tr>
        <tr>
          <td>{{ $t('clubs.website') }}</td>
          <td>
            <a v-if="club.website" :href="club.website" target="blank">
              {{ club.website }}
            </a>
          </td>
        </tr>
        <tr>
          <td>{{ $t('clubs.phone') }}</td>
          <td>
            <a v-if="club.phone" :href="`tel:${club.phone}`">
              {{ club.phone }}
            </a>
          </td>
        </tr>
        <tr>
          <td>{{ $t('clubs.status') }}</td>
          <td>{{ club.status }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Club } from '@/api';

@Component({})
export default class ClubSummary extends Vue {
  @Prop({ required: true }) readonly club: Club;
}
</script>
