<template>
  <BaseView />

  <div class="home">
    <div class="header">
      <h1 @click="showDateModal = true">{{ selectedDate }}</h1>
    </div>

    <div v-if="showDateModal" class="modal">
      <div class="modal-content">
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
        <div class="modal-buttons">
          <button @click="cancelDate">취소</button>
          <button @click="confirmDate">확인</button>
        </div>
      </div>
    </div>

    <div v-if="showMoreModal" class="modal">
      <div class="more-modal-content">
        <p class="large-text">{{ selectedYear }}년 {{ selectedMonth }}월 (닉네임)가 '{{ selectedEmotion }}'와 함께 자주 쓴 사건 태그야!</p>
        <div class="emotion-summary">
          <div class="emotion-item" v-for="(event, index) in eventData" :key="index">
            <span>{{ index + 1 }}. {{ event.name }} {{ event.count }}회</span>
          </div>
        </div>
        <button @click="showMoreModal = false" class="back-button">← 돌아가기</button>
      </div>
    </div>

    <div v-if="showNewMoreModal" class="modal">
      <div class="more-modal-content">
        <p class="large-text">{{ selectedYear }}년 {{ selectedMonth }}월 (닉네임)가 많이 선택한 감정들을 정리해봤어!</p>
        <div class="emotion-summary">
          <div class="emotion-item" v-for="(emotion, index) in emotions" :key="index">
            <span>{{ index + 1 }}. {{ emotion.name }} {{ emotion.count }}회</span>
            <div class="emotion-bar" :style="{ backgroundColor: getEmotionColor(emotion.name) }"></div>
          </div>
        </div>
        <button @click="showNewMoreModal = false" class="back-button">← 돌아가기</button>
      </div>
    </div>

    <div class="chart-wrapper">
      <EmotionChart 
        @bubble-click="handleBubbleClick"
        :selectedYear="selectedYear"
        :selectedMonth="selectedMonth"
      />
    </div>

    <div class="emotion-list">
      <p>이번 달 (닉네임)가 가장 많이 선택한 감정은?</p>
      <ol>
        <li v-for="(emotion, index) in emotions" :key="index">{{ emotion.name }} {{ emotion.count }}회</li>
      </ol>
      <button class="more-button" @click="showNewMoreModal = true">더 보기 →</button>
    </div>
  </div>

  <BaseBottomBar />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import axios from 'axios';
import { useStore } from 'vuex';
import EmotionChart from "@/components/EmotionChart.vue";
import BaseView from '@/components/common/BaseView.vue';
import BaseBottomBar from '@/components/common/BaseBottomBar.vue';

export default defineComponent({
  name: "StaticHome",
  components: {
    EmotionChart,
    BaseView,
    BaseBottomBar,
  },
  setup() {
    const store = useStore();
    const showDateModal = ref(false);
    const showMoreModal = ref(false);
    const showNewMoreModal = ref(false);
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
        });
        console.log(fetchedEmotions);
        emotions.value = fetchedEmotions;
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
          const color = '#ffcc00'; // 기본 색상 설정 또는 데이터에서 가져오기
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
      showMoreModal.value = true;
      fetchEvents(); // 모달이 열릴 때 이벤트 데이터를 가져옵니다.
    };

    const getEmotionColor = (emotionName: string) => {
      const emotion = store.state.emotionTags.find(e => e.name === emotionName);
      return emotion ? emotion.color : '#000000'; // 기본 색상 설정
    };

    return {
      showDateModal,
      showMoreModal,
      showNewMoreModal,
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
      getEmotionColor // 감정 색상 가져오기 함수 추가
    };
  },
});
</script>

<style scoped>
.home {
  text-align: center;
  margin: 2vh;
  margin-top: 4vh;
  padding: 1vh;
  background-color: #ffffff;
  border-radius: 2vh;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1vh;
  border-bottom: 0.2vh solid #f0a500;
}

.header h1 {
  font-size: 2.5vh;
  color: #000000;
  cursor: pointer;
}

.chart-wrapper {
  width: 100%;
  height: 45vh;
  position: relative;
}

.emotion-list {
  margin-top: 2vh;
  text-align: left;
  padding: 0 2vh;
}

.emotion-list p {
  font-size: 2vh;
}

.emotion-list ol {
  padding-left: 2vh;
  font-size: 2vh;
}

.more-button {
  display: block;
  margin: 2vh auto;
  padding: 1vh 2vh;
  background-color: #f0a500;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 1.6vh;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content,
.more-modal-content,
.new-more-modal-content {
  background-color: #ffffff;
  padding: 2vh;
  border-radius: 1vh;
  text-align: center;
  width: 80%;
  max-width: 30vh;
  border: 0.2vh solid #a0c4ff;
  z-index: 1001;
}

.more-modal-content,
.new-more-modal-content {
  text-align: center;
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

.modal-buttons {
  display: flex;
  justify-content: space-around;
}

.modal-buttons button {
  padding: 1vh 2vh;
  background-color: #d1f7c4;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 1.6vh;
  width: 40%;
}

.modal-buttons button:first-child {
  background-color: #f0a500;
}

.more-modal-content p,
.new-more-modal-content p {
  font-size: 2vh; /* 글씨 크기 크게 조정 */
  margin-bottom: 2vh;
}

.emotion-summary {
  text-align: left;
}

.emotion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1vh;
  font-size: 2vh;
}

.emotion-bar {
  width: 2vh;
  height: 2vh;
  border-radius: 50%;
}

.back-button {
  padding: 1vh 2vh;
  background-color: #f0a500;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
  font-size: 1.6vh;
  margin-top: 2vh;
}
</style>