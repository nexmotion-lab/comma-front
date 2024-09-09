<script setup lang="ts">

import DiaryInformation from "@/components/diary/DiaryInformation.vue";
import {ref, computed, onMounted} from "vue";
import { EmotionTag } from "@/store"
import {
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  alertController,
  IonButton,
  onIonViewWillEnter
} from "@ionic/vue";
import { useStore } from "vuex";
import router from "@/router";
import {selectTab} from "@/utils/tabs";

const store = useStore();
const text = ref("오늘은 어떤 감정을 느꼈어?\n최대 10가지 알려줘!");

const groupedEmotionTags = computed<Record<number, EmotionTag[]>>(() => {
  const groups: Record<number, EmotionTag[]> = {};
  store.state.emotionTags.forEach((tag) => {
    if (!groups[tag.yvalue]) {
      groups[tag.yvalue] = [];
    }
    groups[tag.yvalue].push(tag);
  });

  Object.keys(groups).forEach((key) => {
    groups[parseInt(key)] = groups[parseInt(key)].sort((a, b) => a.xvalue - b.xvalue);
  });

  return groups;
});

const sortedYValues = computed(() => {
  return Object.keys(groupedEmotionTags.value)
      .map(Number)
      .sort((a, b) => b - a);
});

const isSelected = (tag: EmotionTag) => {
  return computed(() => {
    return store.state.diary.selectedEmotionTags.some((selectedTag: EmotionTag) => selectedTag.emotionTagNo === tag.emotionTagNo);
  });
};

const toggleTag = async (tag: EmotionTag) => {
  const result = await store.dispatch('toggleEmotionTag', tag);
  if (!result) {
    const alert = await alertController.create({
      header: '잘못된 선택',
      message: '감정은 최대 10가지만 선택할 수 있어요! 선택한 감정태그를 취소하고 추가로 선택해주세요!',
      buttons: ['확인'],
      cssClass: 'emotion-alert'
    })
    await alert.present();
  }
};



const switchTab1 = () => {
  router.push({ path: '/diary/create/content', replace: true});
}

const switchTab2 = () => {
  router.push({ path: '/diary/create/coreEmotion', replace: true});
}

const isSetCoreEmotionTag = computed(() => {
  return store.state.diary.selectedEmotionTags.length >= 1;
})

const chipStyle = (tag : EmotionTag) => {
  let color = 'black';
  if (isSelected(tag).value) {
    if (tag.xvalue < 0 ) {
      color = 'white';
    }
  }

  return {
    border: `0.8vw solid ${tag.color}`,
    backgroundColor: isSelected(tag).value ? tag.color : 'white',
    color: color
  }
}

</script>


<template>
  <ion-page class="tab-page">
    <DiaryInformation :text="text"></DiaryInformation>
    <ion-card class="emotion-content">
      <ion-card-header class="tab-card"></ion-card-header>
      <ion-card-content class="tab-card-content">
        <div class="emotion-grid-container">
          <ion-grid class="emotion-grid">
            <ion-row v-for="y in sortedYValues" :key="y" class="emotion-row">
              <ion-col v-for="tag in groupedEmotionTags[y]" :key="tag.xvalue" size="auto" class="emotion-tag-col">
                <ion-chip :style="chipStyle(tag)"
                          class="emotion-tag" @click="toggleTag(tag)">
                  {{ tag.name }}
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </ion-card-content>
      <div class="button-container">
        <ion-button @click="switchTab1" class="next-btn">
          이전
        </ion-button>
        <ion-button @click="switchTab2" class="next-btn" :disabled="!isSetCoreEmotionTag">
          다음
        </ion-button>
      </div>
    </ion-card>
  </ion-page>
</template>

<style scoped>
.tab-page {
  justify-content: flex-start;
}

.button-container {
  display: flex;
  justify-content: space-between;
  padding: 0 5vw;
}

.next-btn {
  align-self: flex-end;
  margin-top: auto;
  --background: white;
  font-size: 4vw;
  color: #000;
  border: 0.8vw solid #A3E2B8FF;
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
}

.tab-card-content {
  height: auto;
}

.emotion-grid-container {
  display: block; /* Flexbox 대신 block으로 변경하여 레이아웃 문제 해결 */
  overflow-x: auto; /* X축의 스크롤을 유지 */
  white-space: nowrap; /* 한 줄로 표시되도록 설정 */
  -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤링 활성화 */
  padding-left: 10px; /* 스크롤 시작 위치 확보를 위한 왼쪽 패딩 */
}


.emotion-grid {
  display: flex;
  flex-direction: column;
}

.emotion-row {
  display: inline-block; /* 요소를 한 줄로 표시하도록 변경 */
  width: auto; /* 자동 너비로 설정 */
  white-space: nowrap; /* 텍스트가 한 줄로 표시되도록 설정 */
}

.emotion-tag {
  display: inline-block; /* Chip을 한 줄로 나열하기 위해 inline-block 사용 */
  padding: 0;
  padding-left: 2vw;
  padding-right: 2vw;
  min-width: max-content;
  font-size: 5vw;
  --background: white;
}




.emotion-tag-col {
  padding: 0;
  flex: 0 0 auto;
}

</style>