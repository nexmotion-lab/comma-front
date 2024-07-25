<script setup lang="ts">

import {Diary} from "@/views/diary/DiaryList.vue";
import {
  IonLabel, IonFooter, IonToolbar, IonContent, IonCard, IonText,
  IonList, IonItem, IonAvatar, modalController
} from "@ionic/vue";
import dotoDiary from '@/assets/diary/doto-diary.png'

const props = defineProps<{
  diary: Diary;
}>();

function formatDateString(dateString) {
  // 날짜 문자열을 분리하여 연, 월, 일 값을 추출합니다.
  const [year, month, day] = dateString.split('-');

  // 원하는 형식으로 조합하여 반환합니다.
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
}

const modalBack = () => modalController.dismiss();


</script>

<template>
  <ion-content scroll-y="false">
    <ion-card class="date-modal-card">
      <ion-text class="date-text">
        {{ formatDateString(diary.dateCreated.split('T')[0]) }}
      </ion-text>
      <div class="diary-container">
        <ion-list lines="none">
          <ion-item class="diary-item">
            <ion-avatar aria-hidden="true" slot="start" class="item-avatar">
              <img :src="dotoDiary" alt="">
            </ion-avatar>
            <ion-label class="item-label-left">
              오늘 하루는 어땠어?
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-label class="item-label-right" slot="end">
              {{ diary.emotionTags.map(tag => `#${tag.name}`).join('  ') }}
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-avatar aria-hidden="true" slot="start" class="item-avatar">
              <img :src="dotoDiary" alt="">
            </ion-avatar>
            <ion-label class="item-label-left">
              무슨 일이 있었는지 <br> 궁금해!
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-label class="item-label-right" slot="end">
              {{ diary.eventTags.map(tag => `#${tag.name}`).join('  ') }}
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-avatar aria-hidden="true" slot="start" class="item-avatar">
              <img :src="dotoDiary" alt="">
            </ion-avatar>
            <ion-label class="item-label-left">
              너의 생각을 듣고 싶어
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-label class="item-label-right" slot="end">
              {{ diary.content }}
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
    </ion-card>
  </ion-content>
  <ion-footer>
    <ion-toolbar>
      <ion-label class="return-text" @click="modalBack">
        돌아가기
      </ion-label>
    </ion-toolbar>
  </ion-footer>
</template>

<style scoped>

.return-text {
  font-size: 6vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diary-item {
  background: white!important;
  padding: 0!important;
}

.item-label-left {
  font-size: 4vw;
  display: flex;
  text-align: center;
  justify-content: center;
  padding-top: 1vh;
  padding-bottom: 1vh;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #A3E2B8FF;
  min-height: 60%;
}

.item-label-right {
  font-size: 4vw;
  width: auto;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 1vh;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #DEF9EB;
  min-height: 80%;
}

.item-avatar {
  background: #A3E2B8FF;
  width: 14vw;
  height: 14vw;
}

.diary-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 95%;
  height: 85%;
}

.date-text {
  font-size: 7vw;
  margin-top: 2vh;
  padding-bottom: 1vh;
  padding-left: 10%;
  padding-right: 10%;
  border-bottom: 0.5vh solid #A3E2B8FF;
}

ion-content {
  --background: #DEF9EB
}

.date-modal-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5vw;
  height: 70vh;
  border-radius: 30px;
  border-left: 3vw solid #A3E2B8FF;
  border-right: 3vw solid #A3E2B8FF;
  border-top: 5vw solid #A3E2B8FF;
}

</style>