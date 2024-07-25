<script setup lang="ts">

import DiaryInformation from "@/components/diary/DiaryInformation.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonPage,
 IonTextarea,
    IonButton
} from "@ionic/vue";
import router from "@/router";
import {selectTab} from "@/utils/tabs";

const store = useStore();
const diaryContent = computed({
  get: () => store.state.diary.content,
  set: (value) => store.commit('SET_DIARY_CONTENT', value)
});


const text = ref("\"감정\"을 떠올리며\n우리 내려가보자:)");

const switchTab1 = () => {
  router.push({ path: '/diary/create/event', replace: true});
}

const switchTab2 = () => {
  router.push({ path: '/diary/create/emotion', replace: true});

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
          <ion-textarea :auto-grow="true" class="content" placeholder="최대 1000자"
          v-model="diaryContent">
          </ion-textarea>
        </div>
        <div class="button-container">
          <ion-button @click="switchTab1" class="back-btn">
            이전
          </ion-button>
          <ion-button @click="switchTab2" class="next-btn">
            다음
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>
  </ion-page>
</template>

<style scoped>

.content {
  padding-left: 4vw;
  padding-right: 4vw;
  font-size: 5.5vw;
  --highlight-color: black;
}

.button-container {
  padding-top: 1.75vh;
  display: flex;
  justify-content: space-between;

}

.back-btn {
  margin-left: 5.55vw;
  --background: green;
}

.next-btn {
  margin-right: 5.55vw;
  --background: green;
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