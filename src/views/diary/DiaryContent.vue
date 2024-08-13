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
  IonButton, onIonViewWillEnter, onIonViewWillLeave
} from "@ionic/vue";
import router from "@/router";
import {selectTab} from "@/utils/tabs";
import {Keyboard} from "@capacitor/keyboard";

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

const textarearef = ref<HTMLElement | null>(null);
const adjustTextareaHeight = (keyboardHeight: number) => {
  const textarea = textarearef.value
  console.log(textarea)
  if (textarea) {
    console.log(textarea.style.height)
    textarea.style.height = `20vh`;
    console.log(textarea.style.height)
  }
};

const resetTextareaHeight = () => {
  const textarea = textarearef.value

  if (textarea) {
    textarea.style.height = '45vh';
  }
};

onIonViewWillEnter(() => {
  Keyboard.addListener('keyboardWillShow', (info) => {
    console.log("실행")
    adjustTextareaHeight(info.keyboardHeight);
  });

  Keyboard.addListener('keyboardWillHide', () => {
    resetTextareaHeight();
  });
})

onIonViewWillLeave(() => {
  Keyboard.removeAllListeners();
})

</script>


<template>
  <ion-page>
    <DiaryInformation :text="text">
    </DiaryInformation>
    <ion-card class="emotion-content">
      <ion-card-header class="tab-card"></ion-card-header>
      <ion-card-content class="tab-card-content">
        <div class="emotion-grid-container" ref="textarearef">
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



.button-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8vh;
  display: flex;
  justify-content: space-between;
  padding: 0 5.55vw; /* 버튼이 카드의 양쪽 끝에 정렬되도록 패딩 설정 */
}

.content {
  padding-left: 4vw;
  padding-right: 4vw;
  font-size: 5.5vw;
  --highlight-color: black;
}

.button-container {
  display: flex;
  justify-content: space-between;

}

.back-btn {
  --background: green;
}

.next-btn {
  --background: green;
}


.tab-card {
  --background: #A3E2B8FF;
}

.emotion-content {
  border-radius: 30px;
  --background: white;
  height: 60vh;
  position: relative;
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