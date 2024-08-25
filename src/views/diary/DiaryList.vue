<script setup lang="ts">

import BaseHeader from "@/components/common/BaseHeader.vue";
import {
  IonPage,
  IonIcon,
  IonContent,
  IonItem,
  IonModal,
  IonDatetime,
  IonLabel,
  alertController,
  IonRow,
  IonGrid,
  IonCol,
  IonChip,
  IonCard,
  IonFooter,
  IonToolbar,
  IonRouterOutlet,
  IonSearchbar,
  IonList,
  IonAvatar,
  InfiniteScrollCustomEvent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave
} from "@ionic/vue";
import {searchCircleOutline, filter, swapVertical, infinite} from "ionicons/icons";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {al} from "vitest/dist/reporters-5f784f42";
import {EventTag, EmotionTag} from "@/store";
import {useStore} from "vuex";
import apiClient from "@/axios";
import DiaryDetail from "@/components/diary/DiaryDetail.vue";
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import router from "@/router";
import {useRoute} from "vue-router";
import LoadingContent from "@/components/common/LoadingContent.vue";


const getFormattedDateDot = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}.${month}.${day}`;
};

const getFormattedDateMinus = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const getCurrentAndPreviousMonthDate = () => {
  const currentDate = new Date();
  const koreaCurrentDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

  console.log(koreaCurrentDate)
  const formattedCurrentDate = getFormattedDateDot(koreaCurrentDate);

  const previousMonthDate = new Date();
  const koreaPreviousMonthDate = new Date(previousMonthDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

  koreaPreviousMonthDate.setMonth(koreaPreviousMonthDate.getMonth() - 1);
  const formattedPreviousMonthDate = getFormattedDateDot(koreaPreviousMonthDate);

  return {
    currentDate: formattedCurrentDate,
    previousMonthDate: formattedPreviousMonthDate,
  };
};

const convertDateFormat = (dateString) => {
  const [year, month, day] = dateString.split('.');
  return `${year}-${month}-${day}`;
};

const convertDateFormatToDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${year}.${month}.${day}`;
};

const dates = ref({
  startDate: getCurrentAndPreviousMonthDate().previousMonthDate,
  lastDate: getCurrentAndPreviousMonthDate().currentDate
});

const dateModal = ref();
const startDateModal = ref();
const endDateModal = ref();
const filterModal = ref();
const startDate = ref(convertDateFormat(dates.value.startDate));
const lastDate = ref(convertDateFormat(dates.value.lastDate));
const isLoading = ref(true);

let originalStartDate = startDate.value;
let originalLastDate = lastDate.value;

const dateCancel = () => {
  startDate.value = originalStartDate;
  lastDate.value = originalLastDate;
  if (dateModal.value === 'startDateModal') {
    startDateModal.value.$el.dismiss();
  } else if (dateModal.value === 'endDateModal') {
    endDateModal.value.$el.dismiss();
  }
};

const dateConfirm = async () => {
  if (new Date(lastDate.value) < new Date(startDate.value)) {
    const alert = await alertController.create({
      header: '설정오류',
      message: '종료일자가 시작일자보다 적을 수 없습니다. ',
      buttons: ['확인'],
      cssClass: 'my-custom-alert-class'
    });
    await alert.present();
    return;
  }
  dates.value.startDate = convertDateFormatToDisplay(startDate.value);
  dates.value.lastDate = convertDateFormatToDisplay(lastDate.value);
  originalStartDate = startDate.value;
  originalLastDate = lastDate.value;
  if (dateModal.value === 'startDateModal') {
    startDateModal.value.$el.dismiss();
  } else if (dateModal.value === 'endDateModal') {
    endDateModal.value.$el.dismiss();
  }
  diaries.length = 0;
  lastDiaryNo.value = null;
  const infiniteScroll = document.querySelector('ion-infinite-scroll');
  if (infiniteScroll) {
    infiniteScroll.disabled = false;
  }
  getDiaries(null, 20);
};

const openStartDateModal = () => {
  dateModal.value = 'startDateModal';
};

const openEndDateModal = () => {
  dateModal.value = 'endDateModal';
};


const formattedStartDate = computed(() => {
  return convertDateFormatToDisplay(startDate.value);
});

const formattedLastDate = computed(() => {
  return convertDateFormatToDisplay(lastDate.value);
});

async function dateChange(event) {
  if (event.detail.value) {
    if (event.target.id === 'startDate') {
      startDate.value = event.detail.value;
    } else if (event.target.id === 'lastDate') {
      lastDate.value = event.detail.value;
    }
  }
}

//emotion

const store = useStore();

const selectedEmotionTags = ref<EmotionTag[]>([]);
const filterEmotionTags = ref<EmotionTag[]>([]);


const groupedEmotionTags = computed<Record<string, EmotionTag[]>>(() => {
  const groups: Record<string, EmotionTag[]> = {
    '--': [],
    '++': [],
    '-+': [],
    '+-': []
  };

  store.state.emotionTags.forEach((tag: EmotionTag) => {
    const x = tag.xvalue;
    const y = tag.yvalue;
    if (x < 0 && y < 0) {
      groups['--'].push(tag);
    } else if (x > 0 && y > 0) {
      groups['++'].push(tag);
    } else if (x < 0 && y > 0) {
      groups['-+'].push(tag);
    } else if (x > 0 && y < 0) {
      groups['+-'].push(tag);
    }
  });

  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => a.xvalue - b.xvalue);
  });

  return groups;
});

const isSelected = (tag: EmotionTag) => {
  return computed(() => {
    return selectedEmotionTags.value.some((selectedTag: EmotionTag) => selectedTag.emotionTagNo === tag.emotionTagNo);
  });
};

const toggleTag = async (tag: EmotionTag) => {

  const tagIndex = selectedEmotionTags.value.findIndex(
      (selectedTag: EmotionTag) => selectedTag.emotionTagNo === tag.emotionTagNo
  );

  if (tagIndex === -1) {
      selectedEmotionTags.value.push(tag);
  } else {
    selectedEmotionTags.value.splice(tagIndex, 1);
  }
};

const filterCancel = () => {
  selectedEmotionTags.value = [...filterEmotionTags.value];
  selectedEventTags.value = [...filterEventTags.value];
  filterModal.value.$el.dismiss();
};

const filterConfirm = () => {
  filterEmotionTags.value = [...selectedEmotionTags.value];
  filterEventTags.value = [...selectedEventTags.value];
  filterModal.value.$el.dismiss();
  diaries.length = 0;
  lastDiaryNo.value = null;
  const infiniteScroll = document.querySelector('ion-infinite-scroll');
  if (infiniteScroll) {
    infiniteScroll.disabled = false;
  }
  getDiaries(null, 20);
};



const eventTags = ref<EventTag[]>([]);
const selectedEventTags = ref<EventTag[]>([]);
const filterEventTags = ref<EventTag[]>([]);

const eventToggleTag = async (tag: EventTag) => {
  const tagIndex = selectedEventTags.value.findIndex(
      (selectedTag) => selectedTag.eventTagNo === tag.eventTagNo
  );
  if (tagIndex === -1) {
    selectedEventTags.value.push(tag);
  } else {
    selectedEventTags.value.splice(tagIndex, 1);
  }
};

const route = useRoute();
const diaries = reactive<Diary[]>([]);

const eventIsSelected = (tag: EventTag) => {
  return computed(() => {
    return selectedEventTags.value.some((selectedTag: EventTag) => selectedTag.eventTagNo === tag.eventTagNo);
  });
};

onIonViewWillEnter(async () => {
  try {
    console.log(dates.value.lastDate)
    await emotionQuery();

    const response = await apiClient.get('/api/diary/diary/eventTag', {

    });

    eventTags.value = response.data;
    await eventQuery();

    await getDiaries(null, 20);
  } catch (error) {
    console.error('Failed to fetch event tags:', error);
  }
})

onIonViewWillLeave(() => {
  console.log('나감')
  selectedEventTags.value = [];
  filterEventTags.value = [];
  selectedEmotionTags.value = [];
  filterEmotionTags.value = [];
  diaries.splice(0, diaries.length);
})

async function emotionQuery() {
  const queryEmotionTag = route.query.emotionTag;
  const queryYearMonth = route.query.yearMonth;
  if (queryEmotionTag && queryYearMonth) {
    await toggleTag(store.state.emotionTags.find(tag => tag.emotion_tag_no === parseInt(queryEmotionTag as string)));
    filterEmotionTags.value = [...selectedEmotionTags.value];
    const yearMonthString = queryYearMonth as string;
    const [year, month] = yearMonthString.split('-').map(Number);

    startDate.value = getFormattedDateMinus(new Date(year, month - 1, 1));
    lastDate.value = getFormattedDateMinus(new Date(year, month, 0));
    
    

    originalStartDate = startDate.value
    originalLastDate = lastDate.value

    dates.value.startDate = convertDateFormatToDisplay(originalStartDate);
    dates.value.lastDate = convertDateFormatToDisplay(originalLastDate);
  }
}

async function eventQuery() {
  const queryEventTag = route.query.eventTagName;
  const queryYearMonth = route.query.yearMonth;
  if (queryEventTag && queryYearMonth) {
    const eventTag = eventTags.value.find(tag => tag.name == queryEventTag);
    if (eventTag != undefined){
      await eventToggleTag(eventTag)
    }
    filterEventTags.value = [...selectedEventTags.value];
    console.log(filterEventTags.value);
    const yearMonthString = queryYearMonth as string;
    const [year, month] = yearMonthString.split('-').map(Number);

    // 해당 월의 첫 번째 날짜
    startDate.value = getFormattedDateMinus(new Date(year, month - 1, 1));
    // 해당 월의 마지막 날짜
    lastDate.value = getFormattedDateMinus(new Date(year, month, 0));



    originalStartDate = startDate.value
    originalLastDate = lastDate.value

    dates.value.startDate = convertDateFormatToDisplay(originalStartDate);
    dates.value.lastDate = convertDateFormatToDisplay(originalLastDate);
  }}



export interface Diary {
  diaryNo: number;
  content: string;
  dateCreated: string;
  coreEmotionTag: DiaryEmotionTag;
  eventTags: EventTag[];
  emotionTags: DiaryEmotionTag[];
}

interface DiaryEmotionTag {
  emotionTagNo: number;
  name: string;
}

const lastDiaryNo = ref<number | null>(null);



async function getDiaries(lastNo:number | null, size:number | null, event?: InfiniteScrollCustomEvent) {

  try {
    isLoading.value = true;
    const response = await apiClient.get('/api/diary/diary', {
      params: {
        lastNo: lastNo,
        size: size,
        startDate: originalStartDate,
        endDate: originalLastDate,
        eventTagIds: filterEventTags.value.map(tag => tag.eventTagNo),
        emotionTagIds: filterEmotionTags.value.map(tag => tag.emotionTagNo),
        orderByDesc: orderByDesc.value
      },
      paramsSerializer: {
        indexes: null,
      }
    });

    console.log(response.data.length);

    if (response.data.length > 0) {
      diaries.push(...response.data);
      lastDiaryNo.value = response.data[response.data.length - 1].diaryNo;
    }
    isLoading.value = false;
    return response.data.length;
  } catch (error) {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
}
const isEmotionContainerVisible = ref(true);
const isEventContainerVisible = ref(false);

const showEmotionContainer = () => {
  isEmotionContainerVisible.value = true;
  isEventContainerVisible.value = false;
};

const showEventContainer = () => {
  isEmotionContainerVisible.value = false;
  isEventContainerVisible.value = true;
};

const listTag = (diary : Diary) => {
  const list = [];
  diary.eventTags.forEach(tag => list.push(`#${tag.name}`));
  list.push(`#${diary.coreEmotionTag.name}`);
  diary.emotionTags.forEach(tag => list.push(`#${tag.name}`));
  return list.join(' ');
}

const emotionChipStyle = (tag : EmotionTag) => {
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
const searchQuery = ref('');
const filteredTags = ref<EventTag[]>([]);
const handleInput = (event: any) => {
  searchQuery.value = event.target.value.toLowerCase();
  console.log(searchQuery)
};
const filterTags = () => {
  if (!searchQuery.value) {
    filteredTags.value = eventTags.value;
  } else {
    filteredTags.value = eventTags.value.filter(tag => tag.name.toLowerCase().includes(searchQuery.value));
  }
  console.log(filteredTags)
};



const diaryInfinite = async (ev: InfiniteScrollCustomEvent) => {
  console.log("event");
   const result = await getDiaries(lastDiaryNo.value, 20, ev);
  setTimeout(() => {
    ev.target.complete();
    if (result === 0) {
      ev.target.disabled = true;
    }
  }, 1000);
};

const orderByDesc = ref<boolean>(true);

const listReverse = () => {
  orderByDesc.value = !orderByDesc.value;
  diaries.reverse();
  if (diaries.length > 0) {
    lastDiaryNo.value = diaries[diaries.length - 1].diaryNo;
  } else {
    lastDiaryNo.value = null;
  }
  const infiniteScroll = document.querySelector('ion-infinite-scroll');
  if (infiniteScroll) {
    infiniteScroll.disabled = false;
  }
}

const openDiary = async (diaryNo: number) => {
  const diary = diaries.find(d => d.diaryNo === diaryNo);
  if (diary) {
    const modal = await modalController.create({
      component: DiaryDetail,
      componentProps: {
        diary: diary
      },
      cssClass: 'diary-modal'
    });

    modal.onDidDismiss().then(({data}) => {
      if (data && data.updatedDiary) {
        updateDiary(data.updatedDiary);
      }
    })

    await modal.present();
  } else {
    console.error('Diary not found');
  }
};

function updateDiary(updatedDiary) {
  const index = diaries.findIndex(d => d.diaryNo === updatedDiary.diaryNo);
  if (index !== -1) {
    diaries[index] = updatedDiary;
  }
}

watch([searchQuery, eventTags], filterTags)

</script>

<template>
  <ion-page>
    <BaseHeader></BaseHeader>
    <ion-content scroll-y="false" id="main">
      <div class="search-container">
      <ion-item class="filter-bar">
        <ion-icon aria-hidden="true" :icon="searchCircleOutline" slot="start" class="search-icon"></ion-icon>
        <ion-label class="date" id="startDateLabel" @click="openStartDateModal">
          {{ dates.startDate }} ~
        </ion-label>
        <ion-label class="date" id="endDateLabel" @click="openEndDateModal">
          {{ dates.lastDate }}
        </ion-label>
        <ion-icon :icon="filter" style="font-size: 7vw; padding-right: 1vw" id="filter"></ion-icon>
        <ion-icon :icon="swapVertical" style="font-size: 7vw" @click="listReverse"
                  :color="orderByDesc ? '' : 'primary'"
        ></ion-icon>
      </ion-item>
      </div>
      <div class="list-container">
        <LoadingContent v-show="isLoading"></LoadingContent>
        <ion-content v-show="!isLoading" role="feed" class="list-content">
      <ion-list class="list-list">
        <ion-item role="article" v-for="diary in diaries" :key="diary.diaryNo"
                  class="list-item" lines="none" @click="openDiary(diary.diaryNo)">
          <ion-label class="list-label">
            <p class="list-day">{{convertDateFormatToDisplay(diary.dateCreated.split('T')[0])}}</p>
            <div class="tags-container">
              <p class="list-tag">{{ listTag(diary) }}</p>
            </div>
          </ion-label>
          <ion-avatar class="list-color" :style="{background: store.getters.getEmotionColor(diary.coreEmotionTag.emotionTagNo)}">
          </ion-avatar>
        </ion-item>
      </ion-list>
        <ion-infinite-scroll @ionInfinite="diaryInfinite">
          <ion-infinite-scroll-content
              loading-spinner="lines"
              loading-text="로딩중"
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>
        </ion-content>
      </div>
    </ion-content>
    <BaseBottomBar></BaseBottomBar>
    <!-- Start Date Modal -->
    <ion-modal ref="startDateModal" trigger="startDateLabel" class="date-modal">
      <ion-content class="date-modal-content" scroll-y="false">
        <ion-card class="date-modal-card">
          <ion-label class="date-text">시작일</ion-label>
          <ion-datetime id="startDate" :value="startDate" presentation="date" :prefer-wheel="true"
                        locale="ko-KR" @ionChange="dateChange">
          </ion-datetime>
        </ion-card>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-label class="cancel-text" @click="dateCancel">취소</ion-label>
          <ion-label class="confirm-text" @click="dateConfirm">확인</ion-label>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>

    <!-- End Date Modal -->
    <ion-modal ref="endDateModal" trigger="endDateLabel" class="date-modal">
      <ion-content class="date-modal-content" scroll-y="false">
        <ion-card class="date-modal-card">
          <ion-label class="date-text">종료일</ion-label>
          <ion-datetime id="lastDate" :value="lastDate" @ionChange="dateChange"
                        locale="ko-KR" presentation="date" :prefer-wheel="true">
          </ion-datetime>
        </ion-card>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-label class="cancel-text" @click="dateCancel">취소</ion-label>
          <ion-label class="confirm-text" @click="dateConfirm">확인</ion-label>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>

    <ion-modal trigger="filter" class="filter-modal" ref="filterModal">
      <ion-content class="filter-modal-content" scroll-y="false">
        <ion-card class="filter-modal-card">
          <div class="filter-text-container">
            <ion-label :style="{ color: isEmotionContainerVisible ? 'blue' : 'black' }" class="date-text" @click="showEmotionContainer">#감정</ion-label>
            <ion-label :style="{ color: isEventContainerVisible ? 'blue' : 'black' }" class="date-text" @click="showEventContainer">#사건</ion-label>
          </div>
          <div v-show="isEmotionContainerVisible" class="emotion-container">
            <ion-grid class="emotion-grid">
              <ion-row v-for="(tags, group) in groupedEmotionTags" :key="group" class="emotion-row">
                <ion-col v-for="tag in tags" :key="tag.emotion_tag_no" size="auto" class="emotion-tag-col">
                  <ion-chip :style="emotionChipStyle(tag)"
                            class="emotion-tag" @click="toggleTag(tag)">
                    {{ tag.name }}
                  </ion-chip>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
          <div v-show="isEventContainerVisible" class="event-grid-container">
            <ion-searchbar animated="true" placeholder="태그 검색" class="event-searchbar"
                           :debounce="200" @ionInput="handleInput($event)">
            </ion-searchbar>
            <ion-grid class="event-grid">
              <ion-row class="event-row">
                <ion-col v-for="tag in filteredTags" :key="tag.eventTagNo" size="auto" class="event-col">
                  <ion-chip class="event-chip" @click="eventToggleTag(tag)" :style="{ backgroundColor: eventIsSelected(tag).value ? '#A3E2B8FF' : 'white' }">
                    {{ tag.name }}
                  </ion-chip>
                </ion-col>
              </ion-row>
            </ion-grid>
          </div>
        </ion-card>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-label class="cancel-text" @click="filterCancel">취소</ion-label>
          <ion-label class="confirm-text" @click="filterConfirm">확인</ion-label>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  </ion-page>
</template>

<style scoped>


.filter-text-container {
  display: flex;

}

.event-searchbar {
  width: auto;
  padding: 0;
  border: 0.8vw solid darkgray;
  --background: white;
  position: sticky;
  top: 0;
  z-index: 1;

}

.tags-container {
  display: flex;
  margin-top: 1vh;
  width: 50vw;
  white-space: nowrap;
}


.list-label {
  margin-left: 5%;
}

.list-tag {
  font-size: 4vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.list-day {
  font-size: 6.5vw;
}



.list-container {
  margin-top: 1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  height: 80%;
}

.list-list {
  margin-top: 1vh;
  margin-left: 2vw;
  width: 95%;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-content {
  display: flex;
  padding-left: 2vw;
  --background: var(--background-color);
}

.list-color {
  width: 17vw;
  height: 17vw;
}


.list-item {
  --border-radius: 30px;
  --border-style: solid;
  --border-width: 1px;
  width: 95%;
}

.list-item::part(native) {
  height: 12vh;
  margin-bottom: 1vh;
}

.event-grid-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 80%;
  scrollbar-width: none;
}

.event-grid-container::-webkit-scrollbar {
  display: none;
}

.event-chip {
  --background: white;
  border: 0.8vw solid #A3E2B8FF;
  font-size: 4vw;

}

.event-col {
  padding: 0;
}

.event-row {
  justify-content: center;
}


.emotion-tag-col {
  padding: 0;
  flex: 0 0 auto;
}

.emotion-tag {
  padding: 0;
  padding-left: 2vw;
  padding-right: 2vw;
  min-width: max-content;
  font-size: 5vw;
  --background: white;
}

.emotion-grid {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
}

.emotion-grid::-webkit-scrollbar {
  display: none;
}

.emotion-row {
  display: flex;
  justify-content: center;
}

.emotion-container {
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  overflow-y: auto;

}

.cancel-text {
  font-size: 7vw;
  padding-left: 20vw;
}
.confirm-text {
  font-size: 7vw;
  padding-left: 22vw;
}
.date-text {
  font-size: 7vw;
  padding-top: 3vh;
  padding-bottom: 3vh;

}

.date-modal-content {
  --background: #DEF9EB
}

ion-datetime {
  --wheel-fade-background-rgb: none;
}



ion-datetime::part(wheel-item) {
  font-size: 7vw;
}



.filter-modal-card {
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

.filter-modal {
  --height: 70%;
  --border-radius: 40px;
  --width: 90%;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
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

.date-modal {
  --height: 45%;
  --border-radius: 40px;
  --width: 90%;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-content#main {
  --background: var(--background-color);
  justify-content: center;
  display: flex;
}

.search-icon {
  font-size: 9vw;
  margin: 0;
}

.date {
  font-size: 1.1rem;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  margin-left: 0;
}


.search-container {
  justify-content: center;
  display: flex;
}

ion-item::part(native) {
  padding-left: 1vw;
}

.filter-bar {
  width: 90vw;
  margin-top: 1vh;
  border-radius: 15px;
  border: 1.3vw solid #A3E2B8FF;
  text-align: center;
  max-height: 10vh;
}

</style>