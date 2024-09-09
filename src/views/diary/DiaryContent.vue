<script setup lang="ts">

import DiaryInformation from "@/components/diary/DiaryInformation.vue";
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import {useStore} from "vuex";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonPage,
  IonTextarea,
  IonButton, onIonViewWillEnter, onIonViewWillLeave
} from "@ionic/vue";
import router from "@/router";
import {Keyboard} from "@capacitor/keyboard";
import {PluginListenerHandle} from "@capacitor/core";

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
        <div class="emotion-grid-container" ref="containerRef" >
          <ion-textarea :auto-grow="true" class="content" placeholder="최대 1000자"
          v-model="diaryContent" maxlength="1000">
          </ion-textarea>
        </div>
        <div class="button-container">
          <ion-button @click="switchTab1" class="next-btn">
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


.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 2vh;
  padding: 0 5vw;
}

.content {
  padding-left: 4vw;
  padding-right: 4vw;
  font-size: 5.5vw;
  --highlight-color: black;
  font-family: 'DiaryFont', sans-serif;
  --padding-bottom: 30vh;
}



.next-btn {
  align-self: flex-end;
  margin-top: auto;
  --background: white;
  color: #000;
  border: .8vw solid #A3E2B8FF;
  --padding-end: 0.8em;
  --padding-start: 0.8em;
  --padding-top: 0;
  --padding-bottom: 0;
  border-radius: 20px;
  --border-radius: 20px;
  --background-activated: #A3E2B8FF;
  --background-hover: #A3E2B8FF;
  --background-focused: #A3E2B8FF;
}



.tab-card {
  --background: #A3E2B8FF;
}

.emotion-content {
  border-radius: 30px;
  --background: white;
  height: 60vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.tab-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}
.emotion-grid-container {
  flex: 1;
  overflow-y: auto;
  position: relative;
  max-height: 40vh;
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