<script setup lang="ts">

import {Diary} from "@/views/diary/DiaryList.vue";
import {
  alertController,
  IonAvatar,
  IonButton,
  IonCard,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSearchbar,
  IonText, IonTextarea,
  IonToolbar,
  modalController
} from "@ionic/vue";
import dotoDiary from '@/assets/diary/doto-diary.png'
import {caretForwardCircleOutline, closeCircleOutline, createOutline} from "ionicons/icons";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {EmotionTag, EventTag} from "@/store";
import {useStore} from "vuex";
import apiClient from "@/axios";
import {Keyboard} from "@capacitor/keyboard";

const props = defineProps<{
  diary: Diary;
}>();

const localDiary = props.diary

const store = useStore();
const emotionTagPatchActive = ref(false);
const eventTagPatchActive = ref(false);
const contentPatchActive = ref(false);
const searchQuery = ref('');



watch(eventTagPatchActive, (newValue) => {
  if (newValue) {
    eventKeyboardEventAdd()
  } else {
    eventKeyboardEventRemove();
  }
})

watch(contentPatchActive, (newValue) => {
  if (newValue) {
    contentKeyboardEventAdd();
  } else {
    contentKeyboardEventRemove();
  }
})

const handleInput = (event: any) => {
  searchQuery.value = event.target.value.toLowerCase();
};

async function clickEmotionTagPatch () {
  emotionTagPatchActive.value = true;
}

async function clickEventTagPatch () {
  eventTagPatchActive.value = true;
}

async function clickContentPatch () {
  contentPatchActive.value = true;
}

async function deleteEventTag (eventTag: EventTag) {
  const index = selectedEventTags.value.findIndex(tag => tag.eventTagNo === eventTag.eventTagNo);

  if (index !== -1) {
    selectedEventTags.value.splice(index, 1);
  }

}


function formatDateString(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
}

interface SearchEventTag {
  eventTagNo: number;
  name: string;
  isMine: boolean;
}

const selectedEmotionTags = ref<EmotionTag[]>([]);
const selectedEventTags = ref<EventTag[]>([]);
const filteredEventTags = ref<SearchEventTag[]>([]);
const userEventTags = ref<EventTag[]>([]);
const diaryContent = ref('');


async function eventTagClick(tag: SearchEventTag) {
  if (selectedEventTags.value.length === 10) {
    const alert = await alertController.create({
      header: '사건태그수정',
      message: `감정태그를 10개초과 추가할 수 없습니다..`,
      buttons: ['확인'],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return
  }

  if (tag.isMine) {
    selectedEventTags.value.push(tag)
    filteredEventTags.value = [];
    searchQuery.value = '';
  } else {
    const alert = await alertController.create({
      header: '사건태그추가',
      message: `${tag.name} 사건태그를 사용가능한 태그로 추가 하시겠습니까?`,
      buttons: [
        {
          text: '취소',
          role: 'cancel',
        },
        {
          text: '확인',
          role: 'confirm',
          handler: async () => {
            const response = await apiClient.post("/api/diary/diary/eventTag",{}, {
              params: {
                eventTagName: tag.name
              },
            });

            if (response.status === 200) {
              selectedEventTags.value.push(tag)
              userEventTags.value.push(tag)
              filteredEventTags.value = [];
              searchQuery.value = '';
            }
          }
        }
      ],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return
  }
}

const filterTags = async () => {
  if (!searchQuery.value) {
    filteredEventTags.value = [];
  } else {
    const response = await apiClient.get("/api/diary/diary/eventTag/search", {
      params: {
        searchQuery: searchQuery.value
      }
    })

    filteredEventTags.value = [...response.data]
    filteredEventTags.value.forEach(eventTag => {
      eventTag.isMine = userEventTags.value.some(userTag => userTag.eventTagNo === eventTag.eventTagNo);
    });
    filteredEventTags.value = filteredEventTags.value.filter(eventTag => {
      return !selectedEventTags.value.some(selectedTag => selectedTag.eventTagNo === eventTag.eventTagNo);
    });
  }
};



watch([searchQuery, userEventTags], filterTags)



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
    return selectedEmotionTags.value.some((selectedTag: EmotionTag) => selectedTag.emotionTagNo === tag.emotionTagNo);
  });
};


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

const toggleTag = async (tag: EmotionTag) => {
  if (tag.emotionTagNo === localDiary.coreEmotionTag.emotionTagNo) {
    const alert = await alertController.create({
      header: '감정태그수정',
      message: `핵심감정태그 ${tag.name}은 수정할 수 없습니다.`,
      buttons: ['확인'],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return
  }

  const tagIndex = selectedEmotionTags.value.findIndex(
      (selectedTag: EmotionTag) => selectedTag.emotionTagNo === tag.emotionTagNo
  );

  if (tagIndex === -1) {
    if (selectedEmotionTags.value.length >= 10) {
      const alert = await alertController.create({
        header: '감정태그수정',
        message: `감정태그를 10개초과 선택할 수 없습니다..`,
        buttons: ['확인'],
        cssClass: 'my-custom-alert-class'
      });
      await alert.present();
      return
    }
    selectedEmotionTags.value.push(tag);
  } else {
    selectedEmotionTags.value.splice(tagIndex, 1);
  }
};

async function cancelContentPatch() {
  diaryContent.value = localDiary.content;
  contentPatchActive.value = false;
}

async function cancelEventPatch() {
  selectedEventTags.value = [];
  searchQuery.value = '';
  localDiary.eventTags.forEach(tag => {
    selectedEventTags.value.push(tag)
  });
  eventTagPatchActive.value = false;
}


async function confirmContentPatch() {

  const alert = await alertController.create({
    header: '일기본문수정',
    message: `일기본문을 해당 내용으로 수정하시겠습니까?`,
    buttons: [
      {
        text: '취소',
        role: 'cancel',
      },
      {
        text: '수정',
        role: 'confirm',
        handler: async () => {

          if (diaryContent.value === localDiary.content) return;

          const response = await apiClient.patch("/api/diary/diary/content",{}, {
            params: {
              diaryNo: localDiary.diaryNo,
              content: diaryContent.value
            },
          });

          if (response.status === 200) {
            localDiary.content = diaryContent.value
            contentPatchActive.value = false;
          }
        }
      }
    ],
    cssClass: "my-custom-alert-class"
  })
  await alert.present();
}

async function confirmEventPatch() {
  if (selectedEventTags.value.length === 0) {
    const alert = await alertController.create({
      header: '사건태그수정',
      message: `선택된 사건태그가 없습니다.`,
      buttons: ['확인'],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return
  }
  const alert = await alertController.create({
    header: '사건태그수정',
    message: `${localDiary.eventTags.map(tag => `#${tag.name}`).join('  ')} 을
     ${selectedEventTags.value.map(tag => `#${tag.name}`).join('  ')} 으로 수정하시겠습니까?`,
    buttons: [
      {
        text: '취소',
        role: 'cancel',
      },
      {
        text: '수정',
        role: 'confirm',
        handler: async () => {

          const response = await apiClient.patch("/api/diary/diary/eventTag",{}, {
            params: {
              diaryNo: localDiary.diaryNo,
              eventTagNo: selectedEventTags.value.map(tag => tag.eventTagNo)
            },
            paramsSerializer: {
              indexes: null
            }
          });

          if (response.status === 200) {
            localDiary.eventTags = selectedEventTags.value
            searchQuery.value = '';
            eventTagPatchActive.value = false;
          }
        }
      }
    ],
    cssClass: "my-custom-alert-class"
  })
  await alert.present();
}

async function cancelEmotionPatch() {
  selectedEmotionTags.value = [];
  localDiary.emotionTags.forEach(tag1 => {
    const emotionTag = store.state.emotionTags.find(tag2 => tag2.emotionTagNo === tag1.emotionTagNo);
    if (emotionTag) {
      selectedEmotionTags.value.push(emotionTag);
    }
  });
  console.log(selectedEmotionTags.value)
  emotionTagPatchActive.value = false;
}
async function confirmEmotionPatch() {
  const alert = await alertController.create({
    header: '감정태그수정',
    message: `${localDiary.emotionTags.map(tag => `#${tag.name}`).join('  ')} 을
     ${selectedEmotionTags.value.map(tag => `#${tag.name}`).join('  ')} 으로 수정하시겠습니까?`,
    buttons: [
      {
        text: '취소',
        role: 'cancel',
      },
      {
        text: '수정',
        role: 'confirm',
        handler: async () => {
          const response = await apiClient.patch("/api/diary/diary/emotionTag",{}, {
            params: {
              diaryNo: localDiary.diaryNo,
              emotionTagNo: selectedEmotionTags.value.map(tag => tag.emotionTagNo)
            },
            paramsSerializer: {
              indexes: null
            }
          });

          if (response.status === 200) {
            localDiary.emotionTags = selectedEmotionTags.value
            emotionTagPatchActive.value = false;
          }
        }
      }
    ],
    cssClass: "my-custom-alert-class"
  })
  await alert.present();
}

async function handleKeyDown(event) {
  if (event.key === 'Enter' || event.keyCode === 13) {
    const index = userEventTags.value.findIndex(userEventTag => userEventTag.name === searchQuery.value)
    if (index !== -1) {
      if (selectedEventTags.value.some(tag => tag.eventTagNo === userEventTags.value[index].eventTagNo)) {
        return
      }
      selectedEventTags.value.push(userEventTags.value[index])
      searchQuery.value = '';
    }
  }
}


onMounted(async () => {
  localDiary.emotionTags.forEach(tag1 => {
    const emotionTag = store.state.emotionTags.find(tag2 => tag2.emotionTagNo === tag1.emotionTagNo);
    if (emotionTag) {
      selectedEmotionTags.value.push(emotionTag);
    }
  });

  diaryContent.value = localDiary.content;

  const response = await apiClient.get('/api/diary/diary/eventTag', {}
  );
  userEventTags.value = response.data;

  selectedEventTags.value = [...localDiary.eventTags]


})
const contentKeyboardWillShowEventListener = ref(null);
const eventKeyboardWillShowEventListener = ref(null);
const contentKeyboardWillHideEventListener = ref(null);

async function eventKeyboardEventAdd() {
  eventKeyboardWillShowEventListener.value = await Keyboard.addListener('keyboardWillShow', (info) => {
    nextTick(() => {
      const searchElement = document.querySelector('#search-bar');
      searchElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    })
  })
}

async function contentKeyboardEventAdd() {
  contentKeyboardWillShowEventListener.value = await Keyboard.addListener('keyboardWillShow', (info) => {
    nextTick(() => {
      const content = document.querySelector('#content');

      setTimeout(() => {
        content.scrollTo({
          top: clickPosition.value.y,
          behavior: 'smooth',
        });
      }, 100);
    })
  })


}
const clickPosition = ref({ x: 0, y: 0 });

const handleClick = (event) => {
  const container = document.querySelector('#content');
  const containerRect = container.getBoundingClientRect();

  const relativeX = event.clientX - containerRect.left;
  const relativeY = event.clientY - containerRect.top;

  clickPosition.value = { x: relativeX, y: relativeY };
};

async function eventKeyboardEventRemove() {
  if (eventKeyboardWillShowEventListener.value) {
    eventKeyboardWillShowEventListener.value.remove();
  }
}

async function contentKeyboardEventRemove() {
  if (contentKeyboardWillShowEventListener.value) {
    contentKeyboardWillShowEventListener.value.remove();
  }
  if (contentKeyboardWillHideEventListener.value) {
    contentKeyboardWillHideEventListener.value.remove();
  }
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
          <ion-item class="diary-item" style="justify-content: flex-start">
            <ion-label v-if="!emotionTagPatchActive" class="item-label-right" slot="end">
              {{ localDiary.emotionTags.map(tag => `#${tag.name}`).join('  ') }}
              <ion-icon class="path-icon" :icon="createOutline" @click="clickEmotionTagPatch"></ion-icon>
            </ion-label>
            <ion-card v-if="emotionTagPatchActive" class="item-label-patch-right" slot="end">
              <ion-card-content style="height: auto">
                <div class="emotion-grid-container">
                  <ion-grid class="emotion-grid" >
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
              <div class="patch-button-container">
                <ion-button @click="cancelEmotionPatch()" class="patch-button">취소</ion-button>
                <ion-button @click="confirmEmotionPatch()" class="patch-button">수정</ion-button>
              </div>
            </ion-card>
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
            <ion-label v-show="!eventTagPatchActive" class="item-label-right" slot="end">
              {{ localDiary.eventTags.map(tag => `#${tag.name}`).join('  ') }}
              <ion-icon class="path-icon" :icon="createOutline" @click="clickEventTagPatch"></ion-icon>
            </ion-label>
            <ion-label v-show="eventTagPatchActive" class="item-label-patch-right" slot="end">
              <ion-grid>
                <ion-row>
                  <ion-col style="padding: 0" v-for="tag in selectedEventTags" :key="tag.eventTagNo" size="auto">
                    <ion-chip class="event-chip">
                      {{ tag.name }}
                      <ion-icon :icon="closeCircleOutline" @click="deleteEventTag(tag)"></ion-icon>
                    </ion-chip>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-searchbar maxlength="10" id="search-bar" placeholder="추가할 태그 검색"
                             :debounce="1000" @ionInput="handleInput($event)"
                             style="--background: white; padding: 0; z-index: 3"
                             :value="searchQuery" @keydown="handleKeyDown">
              </ion-searchbar>
              <ion-card class="event-card">
                <ion-list :inset="true" class="event-list" style="margin-top: 2%">
                  <ion-item @click="eventTagClick(tag)" :button="true" v-for="tag in filteredEventTags" :key="tag.eventTagNo" lines="full">
                    <ion-icon :icon="caretForwardCircleOutline"></ion-icon>
                    <ion-label class="event-label">
                      <strong>{{ tag.name }}</strong>
                      <ion-text v-if="tag.isMine">{{ store.state.name }}의 태그</ion-text>
                      <ion-text v-if="!tag.isMine">사용가능한 태그</ion-text>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card>
              <div class="patch-button-container">
                <ion-button @click="cancelEventPatch()" class="patch-button">취소</ion-button>
                <ion-button @click="confirmEventPatch()" class="patch-button">수정</ion-button>
              </div>
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-avatar aria-hidden="true" slot="start" class="item-avatar">
              <img :src="dotoDiary" alt="">
            </ion-avatar>
            <ion-label class="item-label-left" >
              너의 생각을 듣고 싶어
            </ion-label>
          </ion-item>
          <ion-item class="diary-item">
            <ion-label v-show="!contentPatchActive" class="item-label-right" slot="end" style="text-align: left;   font-family: 'DiaryFont', sans-serif;">
              {{ localDiary.content }}
              <ion-icon class="path-icon" :icon="createOutline" @click="clickContentPatch"></ion-icon>
            </ion-label>
            <ion-label v-show="contentPatchActive" class="item-label-patch-right" slot="end" id="content-label">
              <div class="textarea-container" id="content" @click="handleClick">
                <ion-textarea :auto-grow="true" class="patch-content"
                              v-model="diaryContent" maxlength="1000" >
                </ion-textarea>
              </div>
              <div class="patch-button-container">
                <ion-button @click="cancelContentPatch()" class="patch-button">취소</ion-button>
                <ion-button @click="confirmContentPatch()" class="patch-button">수정</ion-button>
              </div>
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


.textarea-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: none;
}

.textarea-container::-webkit-scrollbar {
  height: 1.5vh;
}

.textarea-container::-webkit-scrollbar-track {
  background: white;
}

.textarea-container::-webkit-scrollbar-thumb {
  background: #0c8c42;
  pointer-events: auto;
}

.patch-content {
  --background: white;
  --border-radius: 20px;
  text-align: left;
  --padding-end: 3vw;
  --padding-start: 3vw;
  height: auto;
  font-family: 'DiaryFont', sans-serif;

}

.event-label {
  margin-left: 6%;
}

.event-list {
  margin: 0;
  padding: 1vh 0 0;
}

ion-label strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}


.event-card {
  border: 0;
  position: relative;
  top: -50px;
  z-index: 2;
  --background: white;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  width: 100%;
  height: auto;
  max-height: 40vh;
}


.event-searchbar {
  z-index: 3;
  width: 100%;
  padding: 0;
  border: 0.8vw solid darkgray;
  --border-radius: 20px;
  border-radius: 20px;
  --background: white;
}


.event-chip {
  --background: white;
  border: 0.8vw solid #A3E2B8FF;
  font-size: 4vw;
  padding-inline-end: 6px;
  min-height: 5vh;
}

.patch-button {
  --background: white;
  border: 0.8vw solid #A3E2B8FF;
  border-radius: 20px;
  --border-radius: 20px;
  font-size: 4vw;
  color: darkslategray;
}

.patch-button-container {
  margin-top: 1vh;
  display: flex;
  width: 90%;
  justify-content: space-between;
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

.path-icon {
  margin-left: 1vw;
  min-width: 5vw;
}

.return-text {
  font-size: 6vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diary-item {
  background: white !important;
  padding: 0 !important;

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
  width: auto;
  max-width: 100%;
  font-size: 4vw;
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
  word-break: break-all;
  overflow-wrap: break-word;
  word-wrap: break-word;
}


.item-label-patch-right {
  flex-direction: column;
  box-shadow: none;
  font-size: 4vw;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding: 1vh;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  --border-radius: 20px 0 20px 20px;
  background: #DEF9EB;
  min-height: 80%;
  margin: 0;
}

.item-avatar {
  background: #A3E2B8FF;
  width: 14vw;
  height: 14vw;
}

.diary-container {
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 95%;
  height: 80%;
  padding-bottom: 30vh;
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
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5vw;
  height: 100%;
  width: 89%;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  border-left: 3vw solid #A3E2B8FF;
  border-right: 3vw solid #A3E2B8FF;
  border-top: 5vw solid #A3E2B8FF;
}

</style>