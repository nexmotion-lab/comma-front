<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import NuguriBox from '@/components/NuguriBox.vue'
import router from "@/router";
import {IonPage, IonCard, onIonViewWillEnter} from "@ionic/vue";

import psyInfoNuguri1 from "@/assets/center/psyInfo_nuguri1.png";
import psyInfoNuguri2 from "@/assets/center/psyInfo_nuguri2.png";
import psyInfoNuguri3 from "@/assets/center/psyInfo_nuguri3.png";
import psyInfoNuguri4 from "@/assets/center/psyInfo_nuguri4.png";
import psyInfoNuguri5 from "@/assets/center/psyInfo_nuguri5.png";
import psyInfoNuguri6 from "@/assets/center/psyInfo_nuguri6.png";
import apiClient from "@/axios";
import LoadingContent from "@/components/common/LoadingContent.vue";
interface PsyInfo {
  psy_info_no: number
  title: string
  content: string
  image: string
  randomImage?: string // 추가: 랜덤 이미지를 저장할 필드
}

export default defineComponent({
  name: 'CenterPsyInfo',
  components: {
    LoadingContent,
    NuguriBox,
    IonPage, IonCard
  },
  setup() {
    const psyInfos = ref<PsyInfo[]>([])
    const images = [
      psyInfoNuguri1,
      psyInfoNuguri2,
      psyInfoNuguri3,
      psyInfoNuguri4,
      psyInfoNuguri5,
      psyInfoNuguri6
    ]
    const isLoading = ref(true);
    const textInput = ref('');

    const testPairs = computed(() => {
      const pairs = []
      for (let i = 0; i < psyInfos.value.length; i += 2) {
        pairs.push(psyInfos.value.slice(i, i + 2))
      }
      return pairs
    })

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length)
      return images[randomIndex]
    }

    onIonViewWillEnter(async () => {
      try {
        const response = await apiClient.get<PsyInfo[]>('/api/psy/psyinfo/')
        psyInfos.value = response.data.map(info => ({
          ...info,
          randomImage: getRandomImage() // 랜덤 이미지 추가
        }))
        isLoading.value = false;
      } catch (error) {
        console.error('Failed to fetch psyinfo:', error)
        alert('Failed to fetch psyinfo')
      }
    })

    const navigateToDetail = (psyInfo: PsyInfo) => {
      router.push({
        name: 'CenterPsyInfoDetail',
        params: { id: psyInfo.psy_info_no },
        query: {
          title: psyInfo.title,
          content: psyInfo.content,
          image: psyInfo.image,
        },
      });
    };

    return {
      psyInfos,
      navigateToDetail,
      testPairs, isLoading, textInput
    }
  },
})

</script>

<!-- 상담센터 상담 정보 리스트 페이지 -->
<template>
  <ion-page>
    <LoadingContent v-show="isLoading"></LoadingContent>
    <ion-content v-show="!isLoading" style="--background: var(--background-color)">
      <!-- psyInfo start -->
      <ion-card class="content-wrapper">
        <div class="psyInfo-list" v-if="testPairs.length > 0">
          <div v-for="(pair, index) in testPairs" :key="index">
            <NuguriBox v-for="test in pair" :key="test.psy_info_no" :image="test.randomImage" @click="navigateToDetail(test)">
              {{ test.title }}
            </NuguriBox>
          </div>
        </div>
        <!-- psyInfo end -->
      </ion-card>
    </ion-content>
  </ion-page>
</template>


<style scoped>
.content-wrapper {
  position: relative; /* 상대적 위치 설정 */
  letter-spacing: 0.6px;
  background-color: white;
  color: black;
  height: 85%;
  border-radius: 20px;
  margin: 3vw;
  display: flex;
  flex-direction: column; /* Flexbox로 세로 정렬 설정 */
}
.psyInfo-list {
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  max-height: 100%; /* 블록의 최대 높이 설정 */
  margin: 0 5px;
}

</style>