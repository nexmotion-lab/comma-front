<template>
  <BaseView />
  <ion-page class="custom-page">
    <!-- 날짜 모달 start   -->
    <ion-modal ref="dateModal" trigger="open-date-modal" class="date-modal">
      <ion-content class="date-modal-content" scroll-y="false">
        <ion-card class="date-modal-card">
          <ion-datetime
              presentation="month-year"
              :min="minDate"
              :max="maxDate"
              :value="tempSelectedDate"
              @ionChange="handleDateChange"
              :prefer-wheel="true"
          ></ion-datetime>
        </ion-card>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-label class="cancel-text" @click="dateCancel">취소</ion-label>
          <ion-label class="confirm-text" @click="dateConfirm">확인</ion-label>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>

    <!-- 날짜 모달 end   -->

    <!--   선택된 감정관 연관된 사건을 보여주는 모달 부분 start -->
    <ion-modal id="events-list-modal" ref="eventsListModal">
      <ion-card class="events-modal-wrapper">
        <div class="events-modal-header">
          <ion-card class="events-bubble">
            <p class="events-modal-date"><strong>{{ selectedYear }}</strong>년 <strong>{{ selectedMonth }}월</strong> </p>
            <p class="emotions-modal-title">(<span class="nickname">{{nickname}}</span>)가 (<span class="keyword">{{selectedEmotion}}</span>)와 함께 자주 쓴 사건 태그야!</p>
          </ion-card>
        </div>
        <div class="modal-img">
          <ion-img :src="DoreImg" style="width: 80%"></ion-img>
        </div>
        <ion-card class="events-modal-content-wrapper">
          <ion-list lines="none" class="events-list">
            <ion-item class="event-item" v-for="(event, index) in eventData" :key="index" @click="goToDiary">
              <ion-label class="event-title">
                <span>{{ index + 1 }}. {{ event.name }}</span>
              </ion-label>
              <ion-label class="event-count">{{ event.count }}회</ion-label>
              <div class="event-bar" :style="{ backgroundColor: event.color}"></div>
            </ion-item>
          </ion-list>
          <div class="events-modal-content-footer">
            <button class="more-button"  @click="dismissEventsListModal"><strong>←</strong> 돌아가기</button>
          </div>
        </ion-card>
      </ion-card>
    </ion-modal>
    <!--    선택된 감정관 연관된 사건을 보여주는 모달 부분 end -->

    <!-- 조회된 전체 감정 리스트 출력 모달 부분 start-->
    <ion-modal id="emotions-list-modal" ref="emotionsListModal">
      <ion-card class="emotions-modal-wrapper">
        <div class="emotions-modal-header">
          <ion-card class="emotions-bubble">
            <p class="emotions-modal-date"><strong>{{ selectedYear }}</strong>년 <strong>{{ selectedMonth }}월</strong> </p>
            <p class="emotions-modal-title"><strong>({{nickname}})</strong>가 많이 선택한 감정들을 정리해봤어!</p>
          </ion-card>
        </div>
        <div class="modal-img">
          <ion-img :src="DoreImg" style="width: 80%"></ion-img>
        </div>
        <ion-card class="emotions-modal-content-wrapper">
          <ion-list lines="none" class="emotions-list">
            <ion-item class="emotion-item" v-for="(emotion, index) in emotions" :key="index" @click="goToDiary">
              <ion-label class="emotion-title">
                <span>{{ index + 1 }}. {{ emotion.name }}</span>
              </ion-label>
              <ion-label class="emotion-count">{{ emotion.count }}회</ion-label>
              <div class="emotion-bar" :style="{ backgroundColor: getEmotionColor(emotion.name) }"></div>
            </ion-item>
          </ion-list>
          <div class="emotions-modal-content-footer">
            <button class="more-button"  @click="dismissEmotionsListModal"><strong>←</strong> 돌아가기</button>
          </div>
        </ion-card>
      </ion-card>
    </ion-modal>
    <!-- 조회된 전체 감정 리스트 출력 모달 부분 end -->
    <SettingModal :isVisible="showSettingModal" @close="closeSettingModal" />

    <!--  header 설정 버튼 부분 start  -->
    <BaseHeader></BaseHeader>
    <!--  header 설정 버튼 부분 end  -->

    <!--    감정 지도 통계 content 부분 start   -->
    <ion-card class="home">
      <ion-card-header class="content-header">
        <ion-card-title id="open-date-modal" @click="showDateModal">{{ selectedDate }} 감정지도</ion-card-title>
      </ion-card-header>

      <!--      버블차트 부분    -->
      <div class="chart-wrapper">
        <EmotionChart
            @bubble-click="handleBubbleClick"
            :selectedYear="selectedYear"
            :selectedMonth="selectedMonth"
            :emotions="emotions"
        />
      </div>

      <!--  emotionsList 부분 start  -->
      <div class="topEmotions-list-wrapper">
        <ion-label class="topEmotions-question" color="dark">
          이번 달 (닉네임)가 가장 많이 선택한 감정은?
        </ion-label>
        <ion-list class="topEmotions-list" lines="none">
          <ion-item class="topEmotions-item" v-for="(emotion, index) in topEmotions" :key="index">
            <ion-label class="topEmotion-title">
              <span>{{ index + 1 }}. {{ emotion.name }}</span>
            </ion-label>
            <ion-label class="topEmotion-count">{{ emotion.count }}회</ion-label>
            <ion-label class="topEmotion-bar">
              <span class="topEmotion-bar-dot" :style="{ backgroundColor: getEmotionColor(emotion.name) }"></span>
            </ion-label>
          </ion-item>
        </ion-list>
        <div>
          <button class="more-button" @click="openEmotionsListModal">더 보기 →</button>
        </div>
      </div>
    </ion-card>
    <!--  emotionsList 부분 end  -->

    <!--  감정 지도 통계 content부분 end  -->
    <BaseBottomBar />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import axios from 'axios';
import { useStore } from 'vuex';
import EmotionChart from "@/components/EmotionChart.vue";
import BaseView from '@/components/common/BaseView.vue';
import BaseBottomBar from '@/components/common/BaseBottomBar.vue';
import {IonPage, IonHeader,IonCard, IonModal, IonImg, IonList, IonItem ,IonContent, IonCardTitle ,IonCardHeader, IonButton, IonDatetime,IonToolbar} from "@ionic/vue";
import {useRouter} from "vue-router";
import SettingModal from "@/components/SettingModal.vue";
import {IonFooter} from "@ionic/vue";
import {EmotionTag} from "@/store";
import apiClient from "@/axios";
import DoreImg from "@/assets/statistics/statistics_dore.png"
import BaseHeader from "@/components/common/BaseHeader.vue";
export default defineComponent({
  name: "StatisticMain",
  components: {
    BaseHeader,
    IonPage, IonHeader, IonCard,  IonModal, IonImg, IonList, IonItem, IonCardTitle,IonCardHeader, IonButton, IonDatetime,IonToolbar, IonContent, IonFooter,
    EmotionChart,
    BaseView,
    BaseBottomBar,
    SettingModal
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const dateModal = ref<any>();
    const eventsListModal = ref<any>(false);
    const emotionsListModal = ref<any>(null)
    const minDate = ref("2020-01");
    const maxDate = ref("2025-12");
    const now = new Date();
    const selectedYear = ref(String(now.getFullYear()));
    const selectedMonth = ref(String(now.getMonth() + 1).padStart(2, '0'));
    const selectedDate = ref(`${selectedYear.value}.${selectedMonth.value}.`);
    const tempSelectedDate = ref(`${selectedYear.value}-${selectedMonth.value}`)
    const selectedEmotion = ref("");
    const selectedEmotionId = ref(""); // 선택된 감정의 ID를 저장할 상태
    const emotions = ref<(EmotionTag & { count: number })[]>([]);
    const topEmotions = ref<(EmotionTag & { count: number })[]>([]);
    const eventData = ref([] as { name: string; count: number; color: string }[]); // 이벤트 데이터를 저장할 상태
    const showSettingModal = ref(false);
    const originalSelectedDate = ref(tempSelectedDate.value);
    const nickname = ref("홍길동");

    const openSettingModal = () => {
      showSettingModal.value = true;
    };

    const closeSettingModal = () => {
      showSettingModal.value = false;
    };

    const showDateModal = () => {
      if(dateModal.value){
        dateModal.value.$el.present();
      }
    }

    const dateCancel = () => {
      tempSelectedDate.value = originalSelectedDate.value;
      if (dateModal.value){
        dateModal.value.$el.dismiss();
      }
    };

    const dateConfirm = async () => {
      const [year, month] = tempSelectedDate.value.split("-");
      selectedYear.value = year;
      selectedMonth.value = month;
      selectedDate.value = `${selectedYear.value}.${selectedMonth.value}.`;

      if (dateModal.value){
        dateModal.value.$el.dismiss();
      }
    };


    const fetchEmotions = async () => {
      try {
        const yearMonth = `${selectedYear.value}-${selectedMonth.value}`;
        const response = await apiClient.get('/api/diary/statistics/emotion', {
          params: {
            yearMonth,
          },
        });

        const data = response.data;
        const fetchedEmotions = Object.keys(data).map(key => {
          const nameMatch = key.match(/name=([^,)]+)/);
          const name = nameMatch ? nameMatch[1] : 'Unknown';
          const count = data[key];
          const emotionTag = store.state.emotionTags.find(e => e.name === name);
          return{ ...emotionTag, count, id: key.match(/emotionTagNo=(\d+)/)?.[1] ?? null };
        });

        // 감정을 사분면에 따라 분류
        const quadrants = [[], [], [], []] as (EmotionTag & { count: number, id: number })[][];
        fetchedEmotions.forEach(emotion => {
          if (emotion.xvalue > 0 && emotion.yvalue > 0) quadrants[0].push(emotion);
          else if (emotion.xvalue > 0 && emotion.yvalue < 0) quadrants[1].push(emotion);
          else if (emotion.xvalue < 0 && emotion.yvalue > 0) quadrants[2].push(emotion);
          else quadrants[3].push(emotion);
        });

        // 각 사분면을 순차적으로 돌며 빈도수에 따라 정렬된 배열 생성
        const sortedEmotions = [] as (EmotionTag & { count: number, id: number })[];
        const quadrantsOrder = [0, 3, 1, 2];

        quadrantsOrder.forEach(quadrantIndex => {
          const quadrant = quadrants[quadrantIndex];
          quadrant.forEach(emotion => {
            // 현재 감정을 삽입할 위치를 찾음
            let inserted = false;
            for (let i = 0; i < sortedEmotions.length; i++) {
              if (emotion.count > sortedEmotions[i].count) {
                sortedEmotions.splice(i, 0, emotion);
                inserted = true;
                break;
              } else if (emotion.count === sortedEmotions[i].count) {
                // 빈도수가 같은 경우 사분면 우선순위 고려
                const currentQuadrantIndex = quadrantsOrder.findIndex(qIndex => quadrants[qIndex].some(e => e.name === sortedEmotions[i].name));
                if (currentQuadrantIndex > quadrantIndex) {
                  sortedEmotions.splice(i, 0, emotion);
                  inserted = true;
                  break;
                }
              }
            }
            // 삽입되지 않았으면 배열 끝에 추가
            if (!inserted) {
              sortedEmotions.push(emotion);
            }
          });
        });

        // 최종적으로 상위 N개의 감정을 추출
        const topNEmotions = sortedEmotions.slice(0, 3); // 상위 3개만 추출 (필요에 따라 조정 가능)

        emotions.value = sortedEmotions;
        topEmotions.value = topNEmotions as (EmotionTag & { count: number })[]; // 최종 상위 N개만 저장
      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    };

    const fetchEvents = async () => {
      try {
        const yearMonth = `${selectedYear.value}-${selectedMonth.value}`;
        const response = await axios.get('http://192.168.0.154:8092/api/v1/statistics/event', {
          params: {
            yearMonth,
            emotionId: selectedEmotionId.value // 선택된 감정의 ID 추가
          },
        });

        const data = response.data;
        const fetchedEvents = Object.keys(data).map(key => {
          // 키에서 name 값을 추출하고 괄호를 제거
          const nameMatch = key.match(/name=([^,)]+)/);
          const name = nameMatch ? nameMatch[1] : 'Unknown';
          const count = data[key];
          const color = '#A3E2B8'; // 기본 색상 설정 또는 데이터에서 가져오기
          return { name, count, color };
        });
        console.log(fetchedEvents);
        eventData.value = fetchedEvents;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    onMounted(() => {
      fetchEmotions();
    });

    watch([selectedYear, selectedMonth], () => {
      fetchEmotions();
    });

    const handleDateChange = (event: any) => {
      tempSelectedDate.value = event.detail.value;
    };


    const handleBubbleClick = (emotion: string, emotionId: number) => {
      selectedEmotion.value = emotion;
      selectedEmotionId.value = emotionId; // 선택된 감정의 ID 저장
      if(eventsListModal.value) {
        eventsListModal.value.$el.present();
      }
      fetchEvents(); // 모달이 열릴 때 이벤트 데이터를 가져옵니다.
    };

    const dismissEventsListModal = () =>{
      if(eventsListModal.value){
        eventsListModal.value.$el.dismiss();
      }
    };

    const getEmotionColor = (emotionName: string) => {
      const emotion = store.state.emotionTags.find(e => e.name === emotionName);
      return emotion ? emotion.color : '#000000'; // 기본 색상 설정
    };

    const openEmotionsListModal = () =>{
      if(emotionsListModal.value) {
        emotionsListModal.value.$el.present();
      }
    };

    const dismissEmotionsListModal = () =>{
      if(emotionsListModal.value){
        emotionsListModal.value.$el.dismiss();
      }
    };

    const goToDiary = () => {
      router.push('');
    };

    return {
      nickname,
      showSettingModal,
      closeSettingModal,
      openSettingModal,
      dateModal,
      showDateModal,
      dismissEventsListModal,
      eventsListModal,
      emotionsListModal,
      openEmotionsListModal,
      dismissEmotionsListModal,
      selectedYear,
      selectedMonth,
      selectedDate,
      dateConfirm,
      dateCancel,
      minDate,
      maxDate,
      tempSelectedDate,
      handleDateChange,
      selectedEmotion,
      selectedEmotionId, // 선택된 감정의 ID 추가
      emotions,
      eventData, // 이벤트 데이터 추가
      handleBubbleClick,
      getEmotionColor, // 감정 색상 가져오기 함수 추가
      topEmotions,
      goToDiary,
      DoreImg,
    };
  },
});
</script>

<style scoped>
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

.date-modal {
  --height: 28%;
  --border-radius: 40px;
  --width: 90%;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

.date-modal-content {
  --background: #DEF9EB
}

ion-datetime::part(wheel-item) {
  font-size: 7vw;
}
ion-datetime {
  --wheel-fade-background-rgb: none;
}

ion-toolbar{
  text-align: center;
}

.cancel-text {
  font-size: 6vw;
  padding-right: 12vw;
}

.confirm-text {
  font-size: 6vw;
  padding-left: 12vw;
}


/* emotions-List-modal, events-List-modal css start */
ion-modal#emotions-list-modal, ion-modal#events-list-modal {
  --width: 90%;
  --min-width: 20vh;
  --height: fit-content;
  --border-radius: 2vh;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --background-color: white;
}

.emotions-modal-wrapper, .events-modal-wrapper{
  margin: 1vh;
  padding: 1vh;
  border : 1vh solid #A3E2B8;
  border-radius: 2vh;

}

.emotions-modal-header, .events-modal-header{
  display:flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3vh;
}

.emotions-bubble, .events-bubble{
  padding: 0 1vh;
  width: 80%;
  border : 0.4vh solid black;
  border-radius: 3vh;
}

.emotions-list, .events-list{
  max-height: 30vh; /* 원하는 최대 높이로 설정 */
  overflow-y: auto; /* 최대 높이를 초과할 경우 스크롤 활성화 */
  justify-content: space-between ;
  background-color: transparent;
}

.emotion-item , .event-item{
  display: flex;
  align-items: center;
  --min-height: 7vh;
  justify-content: space-between;
  margin: 1.4vh 0.5vh 1.8vh 0.5vh;
  font-size: 2.1vh;
  border-radius: 0.5vh;
  --inner-padding-start: 0.1vh;
  --inner-padding-end: 0;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
}


.modal-img{
  display: flex;
  justify-content: center;
}

.emotions-modal-content-wrapper, .events-modal-content-wrapper{
  padding: 1vh;
  margin: 0 0.3vh;
  background-color: #acefc1;
  max-height: 50vh;
}

.emotions-modal-content-footer, .events-modal-content-footer{
  margin-top: 1.5vh;
}

.emotion-title, .event-title{
  flex : 4;
}

.emotion-bar, .event-bar {
  flex : 1.1;
  height: 100%;
}
.keyword{
  padding: 0.5vh;
  font-weight: bold;
  font-size: 3.8vw;
}

/* emotions-List-modal css end */

/* main template start */

.custom-page{
  justify-content: normal;
  border-radius: 20px;
}

.nickname{
  padding: 0.5vh;
  font-weight: bold;
  font-size: 4vw;
}

.home {
  text-align: center;
  padding: 1vh;
  background-color: #ffffff;
  border-radius: 2vh;
}

.content-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh;
  border-bottom: 0.3vh solid #A3E2B8;
}

.content-header h1 {
  font-size: 2.5vh;
  color: #000000;
  cursor: pointer;
}

.chart-wrapper {
  width: 100%;
  height: 45vh;
  position: relative;
}

.topEmotions-question{
  font-size: 2vh;
  font-weight: bold;
}
.topEmotions-list{
  --inner-padding-start: 0;
  --inner-padding-end: 0;
}

.topEmotions-item{
  font-size: 2.1vh;
  --inner-padding-top: 0;
  --inner-padding-end: 0;
}

.topEmotions-list-wrapper {
  margin-top: 2vh;
  text-align: left;
  padding: 0 1vh;
}

.topEmotions-list-wrapper p {
  font-size: 2vh;
  margin :0;
}
.topEmotion-title {
  flex: 4;
}

.topEmotion-count {
  flex: 1;
}

.topEmotion-bar {
  flex: 1.5;
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  margin-left: 10px; /* 왼쪽 여백 추가 */
}

.topEmotion-bar-dot {
  height: 3vh; /* 고정된 높이 설정 */
  width: 3vh; /* 고정된 너비 설정 */
  border-radius: 50%; /* 완전히 둥글게 만들기 위해 50%로 설정 */
}

.more-button {
  display: block;
  margin: 0.8vh auto;
  padding: 0.7vh;
  background-color: transparent;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-weight: bold
}

</style>