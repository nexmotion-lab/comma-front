<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import NuguriBox from '@/components/NuguriBox.vue'
import router from "@/router";
import {IonPage, IonCard} from "@ionic/vue";

import psyInfoNuguri1 from "@/assets/center/psyInfo_nuguri1.png";
import psyInfoNuguri2 from "@/assets/center/psyInfo_nuguri2.png";
import psyInfoNuguri3 from "@/assets/center/psyInfo_nuguri3.png";
import psyInfoNuguri4 from "@/assets/center/psyInfo_nuguri4.png";
import psyInfoNuguri5 from "@/assets/center/psyInfo_nuguri5.png";
import psyInfoNuguri6 from "@/assets/center/psyInfo_nuguri6.png";

interface PsyInfo {
  psy_info_no: number
  title: string
  content: string
  image: string
}

export default defineComponent({
  name: 'CenterPsyInfo',
  components: {
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

    const testPairs = computed(() => {
      const pairs = []
      for (let i = 0; i < psyInfos.value.length; i += 2) {
        pairs.push(psyInfos.value.slice(i, i + 2))
      }
      return pairs
    })

    onMounted(async () => {
      try {
        const response = await axios.get<PsyInfo[]>('http://192.168.0.154:8086/api/v1/psyinfo/')
        psyInfos.value = response.data
        console.log(psyInfos.value)
      } catch (error) {
        console.error('Failed to fetch psyinfo:', error)
        alert('Failed to fetch psyinfo')
      }
    })

    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length)
      return images[randomIndex]
    }

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
      testPairs,
      getRandomImage
    }
  },
  data() {
    return {
      textInput: ''
    }
  }
})
</script>

<!-- 상담센터 상담 정보 리스트 페이지 -->
<template>
  <ion-page>
  <!-- psyInfo start -->
    <ion-card class="content-wrapper">
      <div class="psyInfo-list" v-if="testPairs.length > 0">
        <div v-for="(pair, index) in testPairs" :key="index">
          <NuguriBox v-for="test in pair" :key="test.psy_info_no" :image="getRandomImage()" @click="navigateToDetail(test)">
            {{ test.title }}
          </NuguriBox>
        </div>
      </div>
      <div v-else>데이터를 불러오는 중입니다...</div>
  <!-- psyInfo end -->
    </ion-card>
  </ion-page>
<!--  <BaseBottomBar></BaseBottomBar>-->
</template>

<style scoped>
.content-wrapper {
  position: relative; /* 상대적 위치 설정 */
  letter-spacing: 0.6px;
  background-color: white;
  color: black;
  height: 85%;
  border-radius: 20px;
  margin: 20px 20px 15px 20px;

  display: flex;
  flex-direction: column; /* Flexbox로 세로 정렬 설정 */

}
.psyInfo-list {
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  max-height: 100%; /* 블록의 최대 높이 설정 */
  margin: 0px 5px 0px;
}

</style>
