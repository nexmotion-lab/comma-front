<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import NuguriBox from '@/components/NuguriBox.vue'
import router from "@/router";
import {IonPage} from "@ionic/vue";

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
    IonPage
  },
  setup() {
    const psyInfos = ref<PsyInfo[]>([])
    const images = [
      '/src/assets/center/psyInfo_nuguri1.png',
      '/src/assets/center/psyInfo_nuguri2.png',
      '/src/assets/center/psyInfo_nuguri3.png',
      '/src/assets/center/psyInfo_nuguri4.png',
      '/src/assets/center/psyInfo_nuguri5.png',
      '/src/assets/center/psyInfo_nuguri6.png'
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
  <div class="psyInfo-list" v-if="testPairs.length > 0">
    <div v-for="(pair, index) in testPairs" :key="index">
      <NuguriBox v-for="test in pair" :key="test.psy_info_no" :image="getRandomImage()" @click="navigateToDetail(test)">
        {{ test.title }}
      </NuguriBox>
    </div>
  </div>
  <div v-else>데이터를 불러오는 중입니다...</div>
  <!-- psyInfo end -->
  </ion-page>
<!--  <BaseBottomBar></BaseBottomBar>-->
</template>

<style scoped>
.header {
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.psyInfo-list {
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  max-height: 90%; /* 블록의 최대 높이 설정 */
  margin: 0px 5px 0px;
}

.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
