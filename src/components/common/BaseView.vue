<template>
  <ion-page class="page">
    <ion-content class="custom-content" :scroll-y="false">
      <div class="content"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonPage, IonContent } from "@ionic/vue";

</script>

<style scoped>

.page {
  position: absolute;
  display: block;
  overflow: visible;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.custom-content {
  --background: #f0fff7; /* 원하는 배경색 설정 */
}

.content {
  padding: 10px;
  height: 110%;
}
</style>
