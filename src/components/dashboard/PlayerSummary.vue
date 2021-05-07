<template>
  <div>
    <v-simple-table class="alt-summary-table">
      <thead>
        <tr>
          <th>
            {{ $t('players.summary.title') }}
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('common.labels.rcId') }}</td>
          <td>
            <a :href="player.rcUri" target="_blank">{{ player.rcId }}</a>
          </td>
        </tr>
        <tr>
          <td>{{ $t('players.name') }}</td>
          <td>{{ player.name }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.playerRating') }}</td>
          <td>{{ player.playerRating }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.primaryClub') }}</td>
          <td>
            <router-link
              :to="{
                name: 'club-overview',
                params: { itemId: player.rcPrimaryClubId },
              }"
            >
              {{ player.rcPrimaryClubId }}
            </router-link>
          </td>
        </tr>
        <tr>
          <td>{{ $t('players.province') }}</td>
          <td>{{ player.province }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.country') }}</td>
          <td>{{ player.country }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.email') }}</td>
          <td>{{ player.email }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.dob') }}</td>
          <td>{{ player.birth }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.gender') }}</td>
          <td>{{ player.gender }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.usattId') }}</td>
          <td>{{ player.usattId != 0 ? player.usattId : '' }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.ttaId') }}</td>
          <td>{{ player.ttaId != 0 ? player.ttaId : '' }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.ittfId') }}</td>
          <td>{{ player.ittfId != 0 ? player.ittfId : '' }}</td>
        </tr>
        <tr>
          <td>{{ $t('players.deceased') }}</td>
          <td>
            {{ player.deceased ? $t('players.yes') : $t('players.no') }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Player, Club } from '@/api';

@Component({})
export default class PlayerSummary extends Vue {
  @Prop({ required: true }) readonly player: Player;

  get primaryClubRcUri(): string {
    return Club.getRcUri(this.player.rcPrimaryClubId);
  }
}
</script>
