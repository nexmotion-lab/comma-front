<script setup lang="ts">

import DiaryInformation from "@/components/diary/DiaryInformation.vue";
import {computed, ref} from "vue";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  alertController
} from "@ionic/vue";
import {useStore} from "vuex";
import {EmotionTag} from "@/store";
import {useIonRouter} from "@ionic/vue";
import {selectTab} from "@/utils/tabs";
import apiClient from "@/axios";

const store = useStore();
const router = useIonRouter();

const text = ref("선택한 감정중 어떤 감정이\n제일 기억에 남아?");

const selectedEmotionTags = computed(() => {
  return store.state.diary.selectedEmotionTags
});

const isSelected = (tag: EmotionTag) => {
  return computed(() => {
    return store.state.diary.coreEmotionTag.emotion_tag_no === tag.emotion_tag_no;
  })
}

const setEmotionTag = async (tag: EmotionTag) => {
  await store.dispatch('setCoreEmotionTag', tag)
}

const switchTab = () => {
  router.push({ path: '/diary/create/emotion', replace: true});
}

const createDiary = async () => {
  const diary = computed(() => store.state.diary);
  let message = '';
  if (diary.value.selectedEventTags.length === 0) {
    message += '사건 태그를 선택해 주세요.\n';
  }
  if (diary.value.selectedEmotionTags === 0) {
    message += '감정 태그를 선택해 주세요.\n';
  }
  if (!diary.value.content) {
    message += '일기 내용을 작성해주세요.\n';
  }
  if (!diary.value.coreEmotionTag) {
    message += '핵심 감정을 선택해 주세요.\n';
  }

  if (message) {
    const alert = await alertController.create({
      header: '입력오류',
      message: message,
      buttons: ['확인'],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return;
  }

  const response = await apiClient.post('/api/diary/diary', {
    content: diary.value.content,
    coreEmotionTagId : diary.value.coreEmotionTag.emotion_tag_no,
    eventTagIds: diary.value.selectedEventTags.map(tag => tag.eventTagNo),
    emotionTagIds: diary.value.selectedEmotionTags.map(tag => tag.emotion_tag_no)
  }, {


  });

  if (response.status === 200) {
    await store.dispatch("setIsDiaryWrite", true);
    router.replace("/diary/finish")
  }
}



</script>


<template>
  <ion-page>
    <DiaryInformation :text="text">
    </DiaryInformation>
    <ion-card class="emotion-content">
      <ion-card-header class="tab-card"></ion-card-header>
      <ion-card-content class="tab-card-content">
        <div class="emotion-grid-container">
          <ion-grid class="core-grid">
            <ion-row class="core-row">
              <ion-col v-for="tag in selectedEmotionTags" :key="tag.emotion_tag_no" size="auto" class="core-col">
                <ion-chip :style="{ border: `0.8vw solid ${tag.color}`,
                backgroundColor: isSelected(tag).value ? tag.color : 'white'}"
                @click="setEmotionTag(tag)" class="core-chip">
                  {{ tag.name }}
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </ion-card-content>
      <div class="button-container">
        <ion-button @click="switchTab" class="back-btn">
          이전
        </ion-button>
        <ion-button class="create-btn" @click="createDiary">
          저장
        </ion-button>
      </div>
    </ion-card>
  </ion-page>
</template>

<style scoped>

.button-container {
  padding-top: 1.8vh;
  display: flex;
  justify-content: space-between;

}

.create-btn {
  margin-right: 5.55vw;
  --background: green;

}

.back-btn {
  margin-left: 5.55vw;
  --background: green;
}

.core-row {
  justify-content: center;
}

.core-chip {
  font-size: 5vw;
}

.core-col {
  padding-left: 4vw;
  padding-right: 4vw;
}


.tab-card {
  --background: #A3E2B8FF;
}

.emotion-content {
  border-radius: 30px;
  --background: white;
  height: 60vh;
}

.tab-card-content {
  height: auto;
  padding: 0;
}

.emotion-grid-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 45vh;
}

.emotion-grid-container::-webkit-scrollbar {
  height: 1.5vh;
}

.emotion-grid-container::-webkit-scrollbar-track {
  background: white;
}

.emotion-grid-container::-webkit-scrollbar-thumb {
  background: #0c8c42;
  pointer-events: auto;
}

</style>