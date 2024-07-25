<script setup lang="ts">
import {IonPage, IonContent, IonButton, IonLabel} from "@ionic/vue";
import mainIcon from "@/assets/main_icon.png"

</script>

<template>
<ion-page>
  <ion-content style="--background: var(--background-color)">
    <div class="main-container">
      <img :src="mainIcon" style="padding-top: 10vh; width: 80vw">
      <ion-label style="font-size: 9vw">
        나만의 감정일기
      </ion-label>
      <ion-button style="width: 40vw; height: 6vh; margin-top: 5vh; --background: #FCD665; color: black;">
        시작하기
      </ion-button>
    </div>
  </ion-content>
</ion-page>
</template>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
}

</style>