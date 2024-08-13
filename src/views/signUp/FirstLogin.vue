<script setup lang="ts">
import {IonPage, IonContent, IonButton, IonLabel, useIonRouter, onIonViewWillEnter} from "@ionic/vue";
import mainIcon from "@/assets/main_icon.png"
import {useRouter} from "vue-router";
import * as url from "url";
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
        title: '감정일기',
        body: '오늘 하루는 어땠어? 가',
        schedule: {
          every: 'day',
          at: new Date(new Date().setHours(22, 0, 0, 0)), // 저녁 10시
          allowWhileIdle: true,
        },
        sound: undefined
      },
      {
        id: 2,
        title: '생일 축하 알림',
        body: '생일을 축하드립니다!',
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
        title: '매월 1일 알림',
        body: '이것은 매월 1일에 오는 알림입니다.',
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
  console.log('New notifications scheduled');
  console.log((await LocalNotifications.getPending()).notifications)

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