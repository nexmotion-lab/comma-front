<template>
  <ion-page>
  <BaseHeader></BaseHeader>
  <BaseView/>
  <ion-content class="custom-content" scroll-y="false">
    <ion-card class="ion-card">
      <ion-card-header class="ion-header">
        <ion-label id="calendarLabel" class="select-date">
          {{ selectDate }}
        </ion-label>
        <ion-modal ref="datemodal" trigger="calendarLabel" class="date-modal" :keep-contents-mounted="true" >
          <ion-content scroll-y="none" class="date-modal-content">
          <ion-card class="date-modal-card">
          <ion-datetime id="datetime" ref="datetime" :value="selectDate" locale="ko-KR"
                        presentation="month-year" @ionChange="dateChange"
                        ></ion-datetime>
          </ion-card>
          </ion-content>
          <ion-footer class="modal-footer">
              <ion-label class="cancel-text" @click="dateCancel">취소</ion-label>
              <ion-label class="confirm-text" @click="dateConfirm">확인</ion-label>
          </ion-footer>
        </ion-modal>
      </ion-card-header>
      <ion-card-content style="padding-bottom: 30vh;">
        <LoadingContent v-show="isLoading" style="--background-color: white; --loading-height: 70vh;"></LoadingContent>
        <ion-grid v-show="!isLoading">
          <ion-row>
            <ion-col v-for="day in daysOfWeek" :key="day" class="day-header">
              {{ day }}
            </ion-col>
          </ion-row>
          <ion-row v-for="(week, index) in calendar" :key="index">
            <ion-col v-for="date in week" :key="date.date" class="day-cell" :class="{ 'bold' : date.isCurrentMonth }">
                <span class="date">{{ date.day }}</span>
                <svg @click="onDateClick(date)" v-if="date.emotionTagNo" :style="{ fill: getEmotionColor(date.emotionTagNo) }" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 324.000000 320.000000"
                     preserveAspectRatio="xMidYMid meet" class="svg-transform">
                  <g transform="translate(0.000000,320.000000) scale(0.100000,-0.100000)" stroke="none">
                    <path d="M1712 3124 c-164 -82 -199 -289 -70 -410 132 -125 334 -90 413 72 28
56 27 165 -2 220 -26 48 -92 110 -139 130 -55 23 -142 18 -202 -12z"/>
                    <path d="M859 2984 c-59 -18 -131 -81 -159 -140 -32 -66 -30 -160 4 -219 97
-164 307 -190 433 -52 121 132 77 324 -92 403 -57 27 -117 30 -186 8z"/>
                    <path d="M2554 2791 c-119 -30 -207 -161 -189 -279 18 -121 123 -213 243 -213
148 -1 255 104 256 251 0 71 -13 106 -66 165 -57 66 -160 98 -244 76z"/>
                    <path d="M244 2466 c-114 -38 -187 -111 -208 -213 -27 -122 78 -262 219 -294
96 -21 223 29 280 111 36 53 58 126 50 175 -22 147 -205 265 -341 221z"/>
                    <path d="M1455 2409 c-252 -30 -473 -135 -640 -305 -363 -369 -326 -920 82
-1245 155 -123 288 -180 533 -228 76 -15 48 -66 -138 -250 -109 -109 -141
-160 -142 -223 0 -110 82 -142 255 -98 123 31 340 155 615 349 319 226 500
476 562 779 21 104 22 117 10 278 -13 193 -35 294 -89 403 -183 369 -613 591
-1048 540z"/>
                    <path d="M2912 2125 c-85 -37 -128 -94 -139 -185 -11 -97 73 -207 174 -226
128 -24 254 79 255 209 1 150 -156 260 -290 202z"/>
                  </g>
                </svg>
                <ion-icon v-else :icon="ellipse" class="icon"></ion-icon>

            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
  </ion-page>
</template>



<script setup lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import {
  IonModal,
  IonDatetime,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonDatetimeButton
  ,
  IonPopover,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonFooter, IonToolbar, IonContent, modalController, onIonViewWillEnter,
} from '@ionic/vue';
import { ellipse } from 'ionicons/icons';
import axios from 'axios';
import BaseView from "@/components/common/BaseView.vue";
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import BaseHeader from "@/components/common/BaseHeader.vue";
import {useStore} from 'vuex';
import apiClient from "@/axios";
import DiaryDetail from "@/components/diary/DiaryDetail.vue";
import {Diary} from "@/views/diary/DiaryList.vue";
import LoadingContent from "@/components/common/LoadingContent.vue";

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const selectedDate = ref(new Date());

const store = useStore()

const isLoading = ref(true);


interface CalendarDate {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  emotionTagNo: number | null;
}

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  return `${year}-${month}`;
};

const datetime = ref();
const datemodal = ref();
const originalDate = ref(getFormattedDate(new Date()));
const selectDate = ref(originalDate.value);

const dateCancel = () => {
  selectDate.value = originalDate.value
  datemodal.value.$el.dismiss();
}
const dateConfirm = () => {
  originalDate.value = selectDate.value
  const date = new Date(selectDate.value);
  onDateSelected(date)
  datemodal.value.$el.dismiss()
};

async function dateChange(event) {
  if (event.detail.value) {
    selectDate.value = event.detail.value;
  }
}

type CalendarWeek = CalendarDate[];

const calendar = ref<CalendarWeek[]>([]);

async function generateCalendar(year: number, month: number) {
  isLoading.value = true;
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 이전 달의 날짜 계산
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevDays = startDay;

  // 다음 달의 시작 날짜 계산
  const nextMonthStart = 42 - (startDay + daysInMonth);

  let calendarArray: CalendarDate[] = [];

  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  const response = await apiClient.get(`/api/diary/calendar`, {
    params: {
      yearMonth: yearMonth
    }
  });

  const emotionTags = response.data;
  console.log(emotionTags)

  function getEmotionTagForDate(date: string): number | null {
    return emotionTags[date] || null;
  }

  for (let i = prevDays; i > 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i + 1);
    calendarArray.push({
      day: date.getDate(),
      date,
      isCurrentMonth: false,
      emotionTagNo: getEmotionTagForDate(date.toISOString().split('T')[0])
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = new Date(year, month, day+1).toISOString().split('T')[0];
    calendarArray.push({
      day,
      date,
      isCurrentMonth: true,
      emotionTagNo: getEmotionTagForDate(dateString)
    });
  }

  for (let i = 1; i <= nextMonthStart; i++) {
    const date = new Date(year, month + 1, i);
    calendarArray.push({
      day: date.getDate(),
      date,
      isCurrentMonth: false,
      emotionTagNo: getEmotionTagForDate(date.toISOString().split('T')[0])
    });

  }

  console.log(calendarArray)
  return chunkArray(calendarArray, 7);
}


function chunkArray<T>(arr: T[], size: number): T[][] {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  isLoading.value = false;
  return res;
}

async function onDateSelected(date: Date) {
  const newCalendar = await generateCalendar(date.getFullYear(), date.getMonth());
  calendar.value = newCalendar;
}

const diary = ref<Diary[]>([])

const openDiary = async (date: Date) => {

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const response = await apiClient.get<Diary[]>('/api/diary/diary', {
    params: {
      startDate: formattedDate,
      endDate: formattedDate,
      orderByDesc: true,
    }
  });

  if (response.data) {
    diary.value = response.data
    const modal = await modalController.create({
      component: DiaryDetail,
      componentProps: {
        diary: diary.value[0]
      },
      cssClass: 'diary-modal'
    });
    await modal.present();
  }

};

async function onDateClick(date: CalendarDate) {
  if (date.isCurrentMonth) {

    await openDiary(date.date);
  }
}


function getEmotionColor(emotionTagNo: number | null): string {
  return store.getters.getEmotionColor(emotionTagNo);
}

onIonViewWillEnter(async () => {

  await generateCalendar(selectedDate.value.getFullYear(), selectedDate.value.getMonth()).then(data => {
    calendar.value = data;
  });

})




</script>

<style scoped>

.modal-footer {
  display: flex;
  justify-content: space-evenly;
  padding-top: 1vh;
  padding-bottom: 1vh;
  background: white;
}

ion-datetime::part(wheel-item) {
  font-size: 7vw;
}
ion-datetime {
  --wheel-fade-background-rgb: none;
}


.date-modal {
  --height: 28%;
  --border-radius: 40px;
  --width: 90%;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --background: var(--background-color);

}



.custom-content {
  --background: #f0fff7;
}

.select-date {
  text-align: center;
  font-weight: bold;
  font-size: 9vw;
  padding-top: 3vh;
}

.day-header {
  text-align: center;
  font-weight: bold;
  font-size: 6vw;
  padding: 3vh 0;
}

.day-cell {
  text-align: center;
  padding: 0.5vw;
  position: relative;
  cursor: pointer;
}

.day-cell:nth-child(7n) {
  border-right: none;
}

.date {
  display: block;
  margin-bottom: 5px;
  font-size: 4vw;
}

.bold {
  font-weight: bold;
}

.icon {
  width: 10vw;
  color: #bbbaba;
  height: 10vw;
}




.date-modal-card {
  display: flex;
  flex-direction: column;
  margin: 5vw;
  height: fit-content;
  border-radius: 30px;
  border-left: 3vw solid #A3E2B8FF;
  border-right: 3vw solid #A3E2B8FF;
  border-top: 3vw solid #A3E2B8FF;
}

.cancel-text {
  font-size: 6vw;
}
.confirm-text {
  font-size: 6vw;
}

.date-modal-content {
  --background: #DEF9EB
}

.ion-header {
  padding: 0;
}


ion-datetime::part(wheel-item) {
  font-size: 7vw;
}


.ion-card {
  border-radius: 20px;
}

.svg-transform {
  transform: translateY(3px);
}

</style>