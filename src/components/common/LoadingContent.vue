<script setup lang="ts">

import {IonContent} from "@ionic/vue";
</script>

<template>
  <ion-content scroll-y="false" class="loading-content">
    <div class="container">
      <ion-spinner name="lines-sharp-small"></ion-spinner>

    </div>
  </ion-content>
</template>

<style scoped>


ion-content {
  --background: var(--background-color);

  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--loading-height, 100vh);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

ion-spinner {
  width: 10vh;
  height: 10vh;
}

</style>