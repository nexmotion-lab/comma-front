<script setup lang="ts">
import {IonPage, IonContent, IonButton, IonLabel, useIonRouter, onIonViewWillEnter} from "@ionic/vue";
import mainIcon from "@/assets/main_icon.png"

import {LocalNotifications} from "@capacitor/local-notifications";
import store from "@/store";

const router = useIonRouter();

onIonViewWillEnter(async () => {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') {
    return;
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: '오늘의 쉼표, 다이어리',
        body: '오늘 어떤 일이 있었어? 아직 일기를 작성하지 않았다면 일기작성하자!',
        schedule: {
          every: 'day',
          at: new Date(new Date().setHours(21, 0, 0, 0)),
          allowWhileIdle: true,
        },
        sound: undefined
      },
      {
        id: 2,
        title: '오늘의 쉼표, 다이어리',
        body: '생일을 축하해! 오늘 하루 행복한 일들만 가득하길 바랄게!',
        schedule: {
          repeats: true,
          on: {
            month: parseInt(store.state.birthday.split('-')[1], 10), // 월
            day: parseInt(store.state.birthday.split('-')[2], 10), // 일
            hour: 10,
          },
          allowWhileIdle: true,
        },
        sound: undefined
      },
      {
        id: 3,
        title: '오늘의 쉼표, 다이어리',
        body: '감정그래프가 완성됬어! 지난달 나의 감정은 어땠을지 확인해봐!',
        schedule: {
          repeats: true,
          on: {
            day: 1,
          },
          allowWhileIdle: true,
        },
        sound: undefined
      },
    ],
  });

})

</script>


<template>
<ion-page>
  <ion-content style="--background: var(--background-color)">
    <div class="main-container">
      <img :src="mainIcon" style="padding-top: 10vh; width: 80vw">
      <ion-label style="font-size: 9vw">
        나만의 감정일기
      </ion-label>
      <ion-button style="width: 40vw; height: 6vh; margin-top: 5vh; --background: #FCD665; color: black;" @click="router.replace({path: '/home'})">
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