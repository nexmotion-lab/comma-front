<template>
  <BaseView />
  <ion-page class="custom-page">

<!--    날짜 선택 부분 start  -->
  <div v-if="showDateModal" class="date-modal">
    <div class="date-modal-content">
      <div class="date-picker">
        <div class="date-column">
          <ul>
            <li
                v-for="year in years"
                :key="year"
                :class="{ selected: year === tempSelectedYear }"
                @click="tempSelectedYear = year"
            >
              {{ year }}
            </li>
          </ul>
        </div>
        <div class="label-column">
          <p>년</p>
        </div>
        <div class="date-column">
          <ul>
            <li
                v-for="month in months"
                :key="month"
                :class="{ selected: month === tempSelectedMonth }"
                @click="tempSelectedMonth = month"
            >
              {{ month }}
            </li>
          </ul>
        </div>
        <div class="label-column">
          <p>월</p>
        </div>
      </div>
      <div class="date-modal-buttons">
        <button @click="cancelDate">취소</button>
        <button @click="confirmDate">확인</button>
      </div>
    </div>
  </div>

<!--    날짜 선택 부분 end  -->

<!--    선택된 감정관 연관된 사건을 보여주는 모달 부분 start -->
    <ion-modal id="events-list-modal" ref="eventsListModal">
      <ion-card class="events-modal-wrapper">
        <div class="events-modal-header">
          <ion-card class="events-bubble">
            <p class="events-modal-date"><strong>{{ selectedYear }}</strong>년 <strong>{{ selectedMonth }}월</strong> </p>
            <p class="emotions-modal-title">'닉네임'가 '{{selectedEmotion}}'와 함께 자주 쓴 사건 태그야!</p>
          </ion-card>
        </div>
        <div class="modal-img">
          <ion-img src="/src/assets/statistics/statistics_dore.png" style="width: 80%"></ion-img>
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
            <p class="emotions-modal-title">(닉네임)가 많이 선택한 감정들을 정리해봤어!</p>
          </ion-card>
        </div>
        <div class="modal-img">
          <ion-img src="/src/assets/statistics/statistics_dore.png" style="width: 80%"></ion-img>
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

<!--  header 설정 버튼 부분-->
    <ion-header class="header ion-no-border">
      <div class="setting-container" @click="showModal = true">
        <ion-img src="/public/select.png" class="setting-img"/>
      </div>

      <!-- 닉네임 영역 -->
      <div class="nickname-container">
        <ion-chip color="medium"><ion-text class="nickname" color="success">{{ nickname }}</ion-text></ion-chip>
      </div>
      <SettingModal :isVisible="showModal" @close="showModal = false" /></ion-header>

<!--    감정 지도 통계 content 부분-->
    <ion-card class="home">
      <ion-card-header class="content-header">
        <ion-card-title @click="showDateModal = true">{{ selectedDate }}</ion-card-title>
      </ion-card-header>

<!--      버블차트 부분    -->
      <div class="chart-wrapper">
        <EmotionChart
          @bubble-click="handleBubbleClick"
          :selectedYear="selectedYear"
          :selectedMonth="selectedMonth"
        />
      </div>

<!--  emotionsList 부분 -->
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
          </ion-item>
        </ion-list>
        <div>
        <button class="more-button" @click="openEmotionsListModal">더 보기 →</button>
        </div>
      </div>
    </ion-card>

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
import {IonPage, IonHeader,IonCard, IonModal, IonImg, IonList, IonItem , IonCardTitle ,IonCardHeader, IonButton} from "@ionic/vue";
import {useRouter} from "vue-router";
import SettingModal from "@/components/SettingModal.vue";
export default defineComponent({
  name: "StaticHome",
  components: {
    IonPage, IonHeader, IonCard,  IonModal, IonImg, IonList, IonItem, IonCardTitle,IonCardHeader, IonButton,
    EmotionChart,
    BaseView,
    BaseBottomBar,
    SettingModal
  },
  data(){
    return{
      showModal: false,
      nickname:"아아아아아"
    }
  }
  ,
  setup() {
    const router = useRouter();
    const store = useStore();
    const showDateModal = ref(false);
    const eventsListModal = ref<any>(false);
    const emotionsListModal = ref<any>(null)
    const years = ref(["2020", "2021", "2022", "2023", "2024", "2025"]);
    const months = ref(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]);
    const selectedYear = ref("2024");
    const selectedMonth = ref("06");
    const selectedDate = ref("2024.06. 감정지도");
    const tempSelectedYear = ref(selectedYear.value);
    const tempSelectedMonth = ref(selectedMonth.value);
    const selectedEmotion = ref("");
    const selectedEmotionId = ref(""); // 선택된 감정의 ID를 저장할 상태
    const emotions = ref([] as { name: string; count: number }[]);
    const topEmotions = ref([] as { name: string; count: number }[]);
    const eventData = ref([] as { name: string; count: number; color: string }[]); // 이벤트 데이터를 저장할 상태

    const fetchEmotions = async () => {
      try {
        const yearMonth = `${selectedYear.value}-${selectedMonth.value}`;
        const response = await axios.get('http://192.168.0.154:8092/api/v1/statistics/emotion', {
          params: {
            yearMonth,
          },
          headers: {
            'X-User-Id': '4',
          },
        });

        const data = response.data;
        const fetchedEmotions = Object.keys(data).map(key => {
          // 키에서 name 값을 추출하고 괄호를 제거
          const nameMatch = key.match(/name=([^,)]+)/);
          const name = nameMatch ? nameMatch[1] : 'Unknown';
          const count = data[key];
          const color = store.state.emotionTags.find(e => e.name === name)?.color || '#000000'; // Vuex 스토어에서 색상 가져오기
          return { name, count, color };
        }).sort((a, b) => b.count-a.count);

        console.log(fetchedEmotions);
        emotions.value = fetchedEmotions;
        topEmotions.value = fetchedEmotions.slice(0, 3); // 상위 3개만 저장
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
          headers: {
            'X-User-Id': '4',
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

    const selectYear = (year: string) => {
      tempSelectedYear.value = year;
    };

    const selectMonth = (month: string) => {
      tempSelectedMonth.value = month;
    };

    const confirmDate = () => {
      selectedYear.value = tempSelectedYear.value;
      selectedMonth.value = tempSelectedMonth.value;
      selectedDate.value = `${selectedYear.value}.${selectedMonth.value}. 감정지도`;
      showDateModal.value = false;
    };

    const cancelDate = () => {
      showDateModal.value = false;
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
      showDateModal,
      dismissEventsListModal,
      eventsListModal,
      emotionsListModal,
      openEmotionsListModal,
      dismissEmotionsListModal,
      years,
      months,
      selectedYear,
      selectedMonth,
      selectedDate,
      tempSelectedYear,
      tempSelectedMonth,
      selectedEmotion,
      selectedEmotionId, // 선택된 감정의 ID 추가
      emotions,
      eventData, // 이벤트 데이터 추가
      selectYear,
      selectMonth,
      confirmDate,
      cancelDate,
      handleBubbleClick,
      getEmotionColor, // 감정 색상 가져오기 함수 추가
      topEmotions,
      goToDiary
    };
  },
});
</script>

<style scoped>

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

/* emotions-List-modal css end */

/* main template start */

.custom-page{
  justify-content: normal;
  border-radius: 20px;
}

.header{
  display: inline-flex;
  align-items: center;
  left: 1vw;
  height: 5%;
  padding: 4.5vh 0 1.2vh 0;
}
.nickname-container{
  justify-content: space-between;
}

.nickname{
  padding: 0.5vh;
  font-weight: bold;
  font-size: 4vw;
}

.setting-container{
  justify-content: space-between;
  width: 60px;
}

.setting-img{
  width: auto;
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
  padding: 1.6vh;
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

.date-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.date-modal-content {
  background-color: #ffffff;
  padding: 2vh;
  border-radius: 1vh;
  text-align: center;
  width: 80%;
  max-width: 30vh;
  border: 0.2vh solid #a0c4ff;
  z-index: 1001;
}



.date-picker {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2vh;
}

.date-column {
  flex: 1;
  text-align: center;
  overflow-y: auto;
  height: 15vh;
}

.label-column {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4vh;
}

.label-column p {
  margin: 0;
  font-size: 1.8vh;
}

.date-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.date-column li {
  margin: 1vh 0;
  font-size: 1.8vh;
  cursor: pointer;
}

.date-column li.selected {
  font-weight: bold;
  color: #f0a500;
}

.date-modal-buttons {
  display: flex;
  justify-content: space-around;
}

.date-modal-buttons button {
  padding: 1vh 2vh;
  background-color: #d1f7c4;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 1.6vh;
  width: 40%;
}

.date-modal-buttons button:first-child {
  background-color: #f0a500;
}



</style>