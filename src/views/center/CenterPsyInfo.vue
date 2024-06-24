<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BaseView from '@/components/common/BaseView.vue'
import GreenButton from '@/components/GreenButton.vue'
import NuguriBox from '@/components/NuguriBox.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import BaseButton from '@/components/common/BaseButton.vue'

interface PsyInfo {
  psy_info_no: number
  title: string
  content: string
  image: string
}

export default defineComponent({
  name: 'CenterPsyInfo',
  components: {
    BaseBottomBar,
    BaseView,
    BaseButton,
    GreenButton,
    NuguriBox
  },
  setup() {
    const psyInfos = ref<PsyInfo[]>([])

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

    const navigate = (path: string) => {
      window.location.href = path
    }

    const navigateToDetail = (psyInfo: PsyInfo) => {
      const queryParams = new URLSearchParams({
        title: psyInfo.title,
        content: psyInfo.content,
        image: psyInfo.image
      }).toString()
      window.location.href = `/centerPsyInfo/detail/${psyInfo.psy_info_no}?${queryParams}`
    }

    return {
      psyInfos,
      navigate,
      navigateToDetail,
      testPairs
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
  <BaseView />
  <div class="header">
    <div class="nav-bar">
      <GreenButton>심리정보</GreenButton>
      <BaseButton @click="navigate('/centerPsyTest')">심리검사</BaseButton>
      <BaseButton @click="navigate('/centerPsyCenter')">상담센터</BaseButton>
    </div>
  </div>

  <!-- psyInfo start -->
  <div class="psyInfo-list" v-if="testPairs.length > 0">
    <div v-for="(pair, index) in testPairs" :key="index">
      <NuguriBox v-for="test in pair" :key="test.psy_info_no" @click="navigateToDetail(test)">
        {{ test.title }}
      </NuguriBox>
    </div>
  </div>
  <div v-else>데이터를 불러오는 중입니다...</div>
  <!-- psyInfo end -->

  <BaseBottomBar></BaseBottomBar>
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
  max-height: 80%; /* 블록의 최대 높이 설정 */
  margin: 0px 5px 0px;
}

.nav-bar {
  display: flex;
  justify-content: center;
}
</style>
