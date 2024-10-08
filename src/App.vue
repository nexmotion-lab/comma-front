<template>
  <ion-app>
    <ion-router-outlet/>
    <BaseBottomBar v-if="!$route.meta.hideBottomBar"></BaseBottomBar>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
</script>
