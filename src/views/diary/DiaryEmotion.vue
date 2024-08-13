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
    return store.state.diary.selectedEmotionTags.some((selectedTag: EmotionTag) => selectedTag.emotion_tag_no === tag.emotion_tag_no);
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

onIonViewWillEnter(() => {
  requestAnimationFrame(() => {
    const element = document.querySelector(".emotion-grid-container");
    if (element) {
      element.scrollLeft = 400;
      console.log(element.scrollLeft);
    }
  });
});

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
        <ion-button @click="switchTab1" class="back-btn">
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
}

.emotion-grid-container {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.emotion-grid {
  display: flex;
  flex-direction: column;
}

.emotion-row {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: center;
}

.emotion-tag {
  padding: 0;
  padding-left: 2vw;
  padding-right: 2vw;
  min-width: max-content;
  font-size: 5vw;
  --background: white;
}

.emotion-grid-container::-webkit-scrollbar {
  height: 1.5vh;
}

.emotion-grid-container::-webkit-scrollbar-track {
  background: #A3E2B8FF;
  border-radius: 20px;
}

.emotion-grid-container::-webkit-scrollbar-thumb {
  background: #0c8c42;
  border-radius: 6px;
  pointer-events: auto;
}



.emotion-tag-col {
  padding: 0;
  flex: 0 0 auto;
}

</style>