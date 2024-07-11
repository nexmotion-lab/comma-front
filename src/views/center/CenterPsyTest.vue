<script lang="ts">
import {defineComponent, ref, onMounted, computed, reactive, onBeforeUnmount} from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'
import {  IonModal,IonIcon,IonPage } from '@ionic/vue';
import {closeOutline} from "ionicons/icons";


interface PsyTest {
  psy_test_no: number
  title: string
  content: string
  target: string
  time: string
}

interface SelectedTest extends PsyTest {
  categoryName: string
}

interface TestCategory{
  name: string
  tests: PsyTest[];
}

export default defineComponent({
  name: 'CenterPsyTest',
  methods: {
    closeOutline() {
      return closeOutline
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    IonModal,
    IonIcon,
    IonPage,
  },
  setup() {
    const modal1 = ref<any>(null)
    const modal2 = ref<any>(null)
    const testCategories = ref<TestCategory[]>([]);
    const selectedTest = ref<SelectedTest | null>(null) // 선택된 테스트 정보를 저장할 상태 추가
    const activeCategory = ref<string>('')
    const bannerMessages = ref<string[]>([
      '학생상담센터의 심리검사는 모두 무료!',
      '대표적인 심리검사는 MBTI입니다',
      '심리검사 종류로는 성격 성향 검사가 있습니다'
    ])

    const activeSlideIndex = ref(0)

    // Swiper에서 슬라이드 변경 이벤트를 처리하는 함수
    const onSlideChange = (swiper: any) => {
      activeSlideIndex.value = swiper.realIndex
    }

    const fetchPsyTests = async () =>{
      try{
        const response = await axios.get('http://192.168.0.154:8086/api/v1/psytest/')
        const data = response.data
        testCategories.value = Object.keys(data).map(key =>({
          name:key,
          tests: data[key]
        }))
        activeCategory.value = testCategories.value[0].name
      }catch (error) {
        console.error('Failed to fetch psytest :', error)
        alert('Failed to fetch psytest')
      }
    }


    const getTestPairs = (tests: PsyTest[]) => {
      const pairs = []
      for (let i = 0; i < tests.length; i += 2) {
        pairs.push(tests.slice(i, i + 2))
      }
      return pairs
    }

    const swiperOptions = reactive({
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    })

    onMounted(async () => {
      await fetchPsyTests()
    })

    onBeforeUnmount(()=>{
    })

    const navigate = (path: string) => {
      window.location.href = path
    }
    const openModal1 = () => {
      if (modal1.value) {
        modal1.value.$el.present()
      }
    }
    const openModal2 = (test: PsyTest, categoryName:string) => {
      selectedTest.value = {...test, categoryName } // 선택된 테스트 정보를 설정
      if (modal2.value) {
        modal2.value.$el.present();
      }
    }
    const dismiss1 = () => {
      if (modal1.value) {
        modal1.value.$el.dismiss()
      }
    }
    const dismiss2 = () => {
      if (modal2.value) {
        modal2.value.$el.dismiss()
      }
    }

    //텍스트를 원하는 길이로 자르는 함수 추가
    const wrapText = (text: string, maxLineLength: number): string => {
      const words = text.split(' ')
      let lineLength = 0
      let result = ''

      for (const word of words) {
        if (lineLength + word.length + 1 > maxLineLength) {
          result += '\n'
          lineLength = 0
        }
        result += (lineLength === 0 ? '' : ' ') + word
        lineLength += word.length
      }
      return result
    }

    return {
      getTestPairs,
      modal1,
      openModal1,
      dismiss1,
      modal2,
      openModal2,
      dismiss2,
      navigate,
      swiperOptions,
      activeSlideIndex,
      onSlideChange,
      bannerMessages,
      selectedTest,
      wrapText,
      fetchPsyTests,
      testCategories,
      activeCategory
    }
  },
  data() {
    return {
      textInput: '' // 입력된 텍스트를 저장할 데이터 변수
    }
  }
})
</script>

<!-- 상담센터 심리검사 페이지 -->
<template>
  <ion-page>
    <ion-content :scroll-y="false" :fullscreen="false">
<!-- 심리검사 모달 버튼  -->
  <div class="info-button">
    <div class="info-icon" @click="openModal1">i</div>
  </div>

<!-- 심리검사 참고 모달 -->
  <ion-modal id="example-modal" ref="modal1" >
    <div class="test-modal-wrapper">
      <ion-list lines="none">
        <ion-item>
          <ion-label>
            <h2><strong>Info.</strong></h2>
          </ion-label>
          <ion-icon
              :icon="closeOutline()"
              @click="dismiss1"
              part="iconX"
          ></ion-icon>
        </ion-item>
        <ion-item class="test-ref-detail">
          <ion-img class="profile-image" src="/public/sahmyook.png"></ion-img>
          <ion-label class="test-ref">
            <p>
              이 표시가 들어간 심리검사들은 삼육대학교 상담센터에서 신청 시 무료로 받을 수 있는
              검사입니다.
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </div>
  </ion-modal>


  <!-- comment start -->
  <div class="comment-section">
    <swiper :options="swiperOptions" @slideChange="onSlideChange">
      <swiper-slide v-for="(message, index) in bannerMessages" :key="index" class="comment-box">
        <div class="comment-content">{{ message }}</div>
      </swiper-slide>
    </swiper>
    <!-- slider-indicator를 swiper 외부로 이동 -->
    <div class="slider-indicator">
      <span
        class="dot"
        v-for="index in bannerMessages.length"
        :key="index"
        :class="{ active: activeSlideIndex === index - 1 }"
      ></span>
    </div>
  </div>
  <!-- comment end -->

      <div class="test-list">
        <div v-for="(category, categoryIndex) in testCategories" :key="category.name" class="test-category">
          <div class="test-type-section">
            <ion-chip class="test-type-box">
              <div class="test-type-title">{{ category.name }}</div>
            </ion-chip>
          </div>

          <div v-for="(pair, pairIndex) in getTestPairs(category.tests)" :key="pairIndex" class="test-pair" :data-category="category.name">
            <div v-for="test in pair" :key="test.psy_test_no" class="test-item" @click="openModal2(test,category.name)">
              <div class="test-title">{{ wrapText(test.title, 5) }}</div>
            </div>
            <div v-if="pair.length === 1" class="test-item-placeholder"></div> <!-- 빈 공간을 위한 요소 추가 -->
          </div>
        </div>
      </div>

  <ion-modal id="example-modal" ref="modal2" >
    <div class="test-modal-wrapper" v-if="selectedTest">
      <div class="test-modal-header">
        <h1>{{ selectedTest.title }}</h1>
        <ion-label class="modal2-close">
          <ion-icon
              :icon="closeOutline()"
              @click="dismiss2"
              part="iconX2"
          ></ion-icon>
          </ion-label>
      </div>
      <div class="test-modal-subtitle">{{selectedTest.categoryName}}</div>
      <ion-list lines="none">
        <ion-item>
          <ion-label class="test-modal-description">
            <p>
              {{ selectedTest.content }}
            </p>
          </ion-label>
        </ion-item>
        <div class="test-section-wrapper">
          <ion-item class="test-section">
            <ion-label class="test-section-title">
              <span>검사 대상</span>
            </ion-label>
            <ion-label class="test-section-value">
              <p>{{ selectedTest.target }}</p>
            </ion-label>
          </ion-item>
          <ion-item class="test-section">
            <ion-label class="test-section-title">
              <span>소요 시간</span>
            </ion-label>
            <ion-label class="test-section-value">
              <div>{{ selectedTest.time }}</div>
            </ion-label>
          </ion-item>
        </div>
      </ion-list>
    </div>
  </ion-modal>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content{
  --background: #f0fff7;
  --scroll-y:false;
}
/* Info Button */
.info-button {
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin: 0 15px 0 15px; /* 여백 조정 */
}

.info-icon {
  padding-right: 1vw;
  display: flex; /* Flexbox 레이아웃 사용 */
  border-radius: 50%;
  background-color: lightgray;
  color: white;
  width: 25px;
  height: 25px; /* 버튼 높이 추가 */
  align-items: center;
  justify-content: center;
  font-style: italic; /* 기울임꼴 적용 */
  font-weight: bold; /* 굵게 적용 */
  font-size: 18px; /* 폰트 크기 조정 */
  cursor: pointer; /* 마우스 커서 포인터로 변경 */
}
.comment-section {
  margin: 0 15px 15px 15px;
  position: relative; /* relative로 변경하여 자식 요소인 slider-indicator 위치 조정 */
}

.comment-box {
  color: black;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 10vh;
  border-radius: 35px;
  background-color: rgb(204, 238, 204);
  z-index: 1; /* z-index 추가 */
}

.slider-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -20px; /* 인디케이터를 박스 밖으로 이동 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2; /* z-index 추가 */
}
.comment-content {
  margin-bottom: 10px; /* 아래 여백 추가 */
}

.dot {
  height: 12px; /* 크기 */
  width: 12px; /* 크기 */
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition:
    background-color 0.3s,
    border 0.3s,
    transform 0.3s; /* 테두리 및 변환 추가 */
}

.dot.active {
  background-color: #4caf50;
  border: 2px solid white; /* 테두리 추가 */
  transform: scale(1.2); /* 크기 확대 */
}

@media (max-width: 768px) {
  .slider-indicator {
    bottom: 10px;
  }
}

/* Test Type Section */
.test-type-section {
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 10px 0 10px 0;
}

.test-type-box {
  padding: 0.7vh 1.2vh;
  --background-color: #a3e2b8ff;
  width: fit-content;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.test-type-title {
  color: black;
  font-weight: bold;
}

/* Test List */
.test-list {
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  max-height: 65vh; /* 블록의 최대 높이 설정 */
  margin: 0 5px 0;
}

.test-pair {
  display: flex;
  justify-content: center;
}

.test-item {
  border: 6px solid #548263;
  border-radius: 10px;
  margin: 10px;
  width: 45%;
  height: 17vh;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  flex: 1;
  padding: 10px;
  white-space: pre-line;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.test-item-placeholder {
  margin: 10px;
  width: 45%;
  height: 17vh;
}

.test-title {
  color: black;
  font-size: 20px;
  font-weight: 650;
  text-align: center; /* 가운데 정렬 */
  padding: 1vh; /* 적절한 패딩 추가 */
  white-space: normal; /* 줄 바꿈 허용 */
  overflow-wrap: break-word; /* 단어 단위로 개행 */
  word-break: break-all; /* 긴 단어 자르기 */
}

/* Modal */

.profile-image {
  display: inline-block;
  height: 40px;
  width: 50px;
  margin-right: 15px;
}

.test-ref p {
  font-size: 14px;

  color: #00796b;
}

.test-ref-detail {
  margin-bottom: 15px;
}


ion-modal#example-modal {
  --width: 80%;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 20px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --background-color: white;
}

.test-modal-wrapper {
  padding: 8px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #a3e2b8ff; /* border-color 속성을 border로 변경 */
  margin: 3px;
  background-color: white;
}

.test-modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.test-modal-header h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  padding-right: 0.5vw;
  flex: 9; /* flex-grow를 사용하여 h1을 가운데 정렬 */
}

.modal2-close{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

ion-icon[part="iconX"] {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #00796b;
}

ion-icon[part="iconX2"] {
  font-size: 24px;
  color: #00796b;
}

.test-modal-subtitle {
  font-size: 13px;
  text-align: center;
  color: #999;
  margin-bottom: 20px;
}

.test-modal-description {
  margin-bottom: 40px;
}
.test-modal-description p {
  font-size: 15px;
  color: black;
}
.test-section {
  display: flex; /* Flexbox를 사용하여 아이템들을 수평으로 정렬 */
  justify-content: space-between; /* 요소들 사이에 공간을 최대로 배분 */
  align-items: center; /* 세로 중앙 정렬 */
  margin: 10px 0 10px 0;
  padding: 10px 0px 10px 0;
}
.test-section-title {
  flex: 6;
}
.test-section-title span {
  padding: 4px 8px 4px 8px;
  text-align: center;
  color: black;
  font-weight: 500;
  font-size: 15px;
  background-color: #aff4c6;
  border: 0.3rem solid #65bf8c;
  border-radius: 50px;
}
.test-section-value {
  flex: 8;
  text-align: right;
}
.test-section-value p,
.test-section-value div {
  color: black;
  font-size: 14px;
}

</style>
