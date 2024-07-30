<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css'
import BaseButton from '@/components/common/BaseButton.vue'
import 'vue-router/dist/vue-router'
import {IonPage} from "@ionic/vue";

interface CenterInfo {
  psy_center_no: number
  name: string
  description: string
  logo: string | null
  method: string
  subject: string
  time: string
  category: string
  link: string
  info_description: string
}

export default defineComponent({
  name: 'CenterPsyCenter',
  components: {
    BaseButton,
    Swiper,
    SwiperSlide,
    IonPage
  },
  setup() {
    // const router = useRouter()
    const centerInfo = ref<CenterInfo[]>([]) // TypeScript를 사용하여 데이터 타입을 정의
    const activeSlideIndex = ref(0)

    // Swiper에서 슬라이드 변경 이벤트를 처리하는 함수
    const onSlideChange = (swiper: any) => {
      activeSlideIndex.value = swiper.realIndex
    }

    onMounted(async () => {
      try {
        const response = await axios.get<CenterInfo[]>(
            'http://192.168.0.154:8086/api/v1/psycenter/'
        )
        centerInfo.value = response.data // API 응답을 직접 할당
        console.log(centerInfo.value)
      } catch (error) {
        console.error('Failed to fetch center info:', error)
        alert('Failed to fetch center info' + error)
      }
    })

    const swiperOptions = reactive({
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    })


    const goApply = (link: string | null, name: string) => {
      if (!link) {
        alert(`아직 ${name}의 홈페이지가 없습니다`)
      } else {
        window.location.href = link
      }
    }

    return { centerInfo, swiperOptions, activeSlideIndex, onSlideChange, goApply }
  }
})
</script>
<!-- 상담센터 센터 정보 페이지 -->
<template>
  <ion-page>
    <ion-content :scroll-y="false">
      <!-- centerInfo start -->
      <div v-if="centerInfo.length === 0">
        <h2>정보가 없습니다.</h2>
      </div>
      <div class="mm">
        <swiper :options="swiperOptions" @slideChange="onSlideChange">
          <swiper-slide v-for="info in centerInfo" :key="info.psy_center_no">
            <div class="content-wrapper">
              <div class="content">
                <div class="content-header">
                  <h1 class="center-name">{{ info.name }}</h1>
                </div>
                <div class="content-info">
                  <div class="logo-image">
                    <img :src="info.logo || 'default-logo.png'" alt="센터 로고" />
                  </div>
                  <div class="description">
                    {{ info.description }}
                  </div>
                </div>
                <hr />
                <div class="content-details">
                  <div class="section">
                    <h3>진행 방식</h3>
                    <p>{{ info.method }}</p>
                  </div>
                  <div class="section">
                    <h3>상담 주제</h3>
                    <p>{{ info.subject }}</p>
                  </div>
                  <div class="section">
                    <h3>소요 시간</h3>
                    <p>{{ info.time }}</p>
                  </div>
                  <div class="section">
                    <h3>상담 종류</h3>
                    <p>{{ info.category }}</p>
                  </div>
                </div>
              </div>
              <div class="content-footer">
                <BaseButton class="apply-button" @click="goApply(info.link, info.name)"
                >신청하기</BaseButton
                >
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <!-- centerInfo end -->

      <div class="slider-indicator">
    <span
        class="dot"
        v-for="(info, index) in centerInfo"
        :key="index"
        :class="{ active: activeSlideIndex === index }"
    ></span>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content{
  --background: #f0fff7 ;
}

.content-wrapper {
  position: relative; /* 상대적 위치 설정 */
  letter-spacing: 0.6px;
  height: 74vh;
  background-color: white;
  color: black;
  border-radius: 20px;
  margin: 20px 20px 15px 20px;
  display: flex;
  flex-direction: column; /* Flexbox로 세로 정렬 설정 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 효과를 추가합니다. */
}

.content {
  flex: 1; /* 콘텐츠가 남은 공간을 채우도록 설정 */
  overflow-y: auto; /* 세로 스크롤 설정 */
  padding: 0 18px 18px 18px; /* padding 조정 */
}

.content-header {
  display: flex;
  justify-content: center;
  color: black;
}

.center-name {
  margin-top: 24px;
  font-size: 4.6vw;
}

hr {
  border: 0;
  background-image: linear-gradient(
      to right,
      rgba(144, 238, 144, 0),
      rgba(144, 238, 144, 0.453),
      rgba(144, 238, 144, 0)
  );
}

.apply-button {
  border: none; /* 테두리를 제거합니다. */
  border-radius: 20px; /* 버튼의 모서리를 약간 둥글게 만듭니다. */
  font-size: 3.8vw; /* 텍스트 크기를 설정합니다. */
  cursor: pointer; /* 마우스를 올렸을 때 커서 모양을 변경합니다. */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 효과를 추가합니다. */
}

.apply-button:hover {
  background-color: #76c276; /* 마우스 오버 시 색상을 변경 */
}

.content-info {
  display: flex;
  text-align: center;
  align-items: center;
  margin-top: 7px;
  margin-bottom: 15px;
}

.center-logo {
  background-color: #cfd8dc;
  text-align: center;
  justify-content: center;
  flex: 1;
  border-radius: 15px;
}

.content-details {
  font-family: 'Noto Sans KR', sans-serif; /* This is a common Korean font, adjust as needed */
}

.content-details .section h3 {
  font-size: 18px; /* Adjust size as needed */
  font-weight: 800; /* Makes the font bold */
  color: #466851;
  word-spacing: -2px; /* 단어 간격을 좁게 조절 */
}

.content-details .section p {
  font-size: 13px; /* Adjust size as needed */
  font-weight: 500; /* Normal text weight for the paragraph */
  color: #008080; /* Teal color, adjust the color code to match the screenshot exactly */
}

.logo-image {
  /* Styling for your logo image placeholder */
  width: 25vw; /* Example width */
  height: 25vw; /* Example height */
  border-radius: 50%; /* For circular shape */
  background-color: #cfd8dc; /* Example background color */
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}

.description {
  flex: 3; /* Three parts width */
  text-align: start;
  padding: 9px;
  font-size: 3vw;
  font-weight: 500;
}

.content-footer {
  flex-shrink: 0; /* 푸터가 축소되지 않도록 설정 */
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; /* 버튼을 가운데 정렬합니다. */
}

.slider-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5vh 0;
  position: relative; /* 상대적 위치 설정 */
}

.dot {
  height: 8px;
  width: 8px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #4caf50; /* 활성화된 점의 색상을 변경합니다. */
}
</style>