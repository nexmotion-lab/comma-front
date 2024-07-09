<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style>
ion-app {
  --ion-background-color: #f0fff7; /* 전역 배경색 설정 */
}
</style>
