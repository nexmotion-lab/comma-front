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
                :class="{ selected: year === selectedYear }"
                @click="selectYear(year)"
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
                :class="{ selected: month === selectedMonth }"
                @click="selectMonth(month)"
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
        <p>{{ selectedYear }}년 {{ selectedMonth }}월 (닉네임)가 (키워드)와 함께 자주 쓴 사건 태그들이야!</p>
        <div class="emotion-summary">
          <div class="emotion-item" v-for="(emotion, index) in emotions" :key="index">
            <span>{{ index + 1 }}. {{ emotion.name }} {{ emotion.count }}회</span>
            <div class="emotion-bar" :style="{ backgroundColor: emotion.color }"></div>
          </div>
        </div>
        <button @click="showMoreModal = false" class="back-button">← 돌아가기</button>
      </div>
    </div>
    <div v-if="showNewMoreModal" class="modal">
      <div class="more-modal-content">
        <p>{{ selectedYear }}년 {{ selectedMonth }}월 (닉네임)가 많이 선택한 감정들을 정리해봤어!</p>
        <div class="emotion-summary">
          <div class="emotion-item" v-for="(emotion, index) in emotions" :key="index">
            <span>{{ index + 1 }}. {{ emotion.name }} {{ emotion.count }}회</span>
            <div class="emotion-bar" :style="{ backgroundColor: emotion.color }"></div>
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
      <p>이번 달 (닉네임)가 가장 많이 선택한 감정은...</p>
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
    const showDateModal = ref(false);
    const showMoreModal = ref(false);
    const showNewMoreModal = ref(false);
    const years = ref(["2020", "2021", "2022", "2023", "2024", "2025"]);
    const months = ref(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]);
    const selectedYear = ref("2024");
    const selectedMonth = ref("06");
    const selectedDate = ref("2024.06. 감정지도");
    const selectedEmotion = ref("");
    const emotions = ref([] as { name: string; count: number }[]);

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
          return { name, count };
        });
        console.log(fetchedEmotions);
        emotions.value = fetchedEmotions;
      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    };

    onMounted(() => {
      fetchEmotions();
    });

    watch([selectedYear, selectedMonth], () => {
      fetchEmotions();
    });

    const selectYear = (year: string) => {
      selectedYear.value = year;
    };

    const selectMonth = (month: string) => {
      selectedMonth.value = month;
    };

    const confirmDate = () => {
      selectedDate.value = `${selectedYear.value}.${selectedMonth.value}. 감정지도`;
      showDateModal.value = false;
    };

    const cancelDate = () => {
      showDateModal.value = false;
    };

    const handleBubbleClick = (emotion: string) => {
      selectedEmotion.value = emotion;
      showMoreModal.value = true;
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
      selectedEmotion,
      emotions,
      selectYear,
      selectMonth,
      confirmDate,
      cancelDate,
      handleBubbleClick,
    };
  },
});
</script>

<style scoped>
.home {
  text-align: center;
  margin: 20px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-bottom: 2px solid #f0a500;
}

.header h1 {
  font-size: 20px;
  color: #000000;
  cursor: pointer;
}

.chart-wrapper {
  width: 100%;
  height: 400px;
  position: relative;
}

.emotion-list {
  margin-top: 20px;
  text-align: left;
  padding: 0 20px;
}

.emotion-list p {
  font-size: 16px;
}

.emotion-list ol {
  padding-left: 20px;
}

.more-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #f0a500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
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
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 80%;
  max-width: 300px;
  border: 2px solid #a0c4ff;
  z-index: 1001;
}

.more-modal-content,
.new-more-modal-content {
  text-align: center;
}

.date-picker {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.date-column {
  flex: 1;
  text-align: center;
  overflow-y: auto;
  height: 150px;
}

.label-column {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}

.label-column p {
  margin: 0;
  font-size: 18px;
}

.date-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.date-column li {
  margin: 10px 0;
  font-size: 18px;
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
  padding: 10px 20px;
  background-color: #d1f7c4;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 40%;
}

.modal-buttons button:first-child {
  background-color: #f0a500;
}

.more-modal-content p,
.new-more-modal-content p {
  font-size: 16px;
  margin-bottom: 20px;
}

.emotion-summary {
  text-align: left;
}

.emotion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.emotion-bar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.back-button {
  padding: 10px 20px;
  background-color: #f0a500;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}
</style>