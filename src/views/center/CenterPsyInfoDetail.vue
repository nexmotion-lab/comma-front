<script lang="ts">
import { defineComponent } from 'vue'
import GreenButton from '@/components/GreenButton.vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'

interface PsyInfo {
  psy_info_no: number
  title: string
  content: string
  image: string
}

export default defineComponent({
  name: 'CenterPsyInfoDetail',
  components: {
    BaseView,
    BaseButton,
    BaseBottomBar,
    GreenButton
  },
  setup() {
    const navigate = (path: string) => {
      window.location.href = '/' + path
    }

    return { navigate }
  },

  data() {
    return {
      textInput: '', // 입력된 텍스트를 저장할 데이터 변수
      contentSummary: '여기에 내용 요약이 들어갑니다.', // 예시 내용 요약
      imageSrc: 'hell0', // 예시 이미지 경로
      description: 'helllo' // 예시 설명
    }
  }
})
</script>

<!-- 상담센터 상담 정보 상세 페이지-->
<template>
  <BaseView />
  <br />
  <div class="header">
    <div class="nav-bar">
      <GreenButton>심리정보</GreenButton>
      <BaseButton @click="navigate('CenterPsyTest')">심리검사</BaseButton>
      <BaseButton @click="navigate('CenterPsyCenter')">상담센터</BaseButton>
    </div>
  </div>
  <ion-content class="ion-padding">
    <div class="content-header">
      <div class="content-title">
        <p class="content-question">상담의 효과는 무엇인가요?</p>
      </div>
      <button class="close-button" @click="navigate('CenterPsyInfo')">×</button>
    </div>
    <div class="content-summary-wrapper">
      <div class="content-summary-header">
        <p>내용 요약</p>
      </div>
      <div class="content-summary">
        <p>
          Quisque tempus porttitor massa, vel condimentum risus finibus a. Aliquam viverra maximus
          odio, id ornare justo tristique ac. Mauris euismod arcu eget neque sagittis rutrum. Ut
          vehicula porta lacus nec lobortis. Vestibulum et elit ultrices, lacinia metus in, lobortis
          est. Vivamus nisi justo, venenatis sit amet arcu ac, congue faucibus justo. Duis volutpat
          posuere enim, vel sagittis elit dictum et. Sed et congue mauris. Nam venenatis venenatis
          risus, ac condimentum neque sagittis sed. In eget nulla ultricies urna sollicitudin
          posuere. Aenean sagittis congue mauris. Proin nec libero mi. In hac habitasse platea
          dictumst. Praesent nunc nulla, dictum id molestie sed, pretium vitae turpis.
        </p>
      </div>
    </div>
    <hr />
    <div class="content-bottom"></div>
  </ion-content>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
.content-container {
  max-height: 80%;
  background-color: white;
  border-radius: 20px;
  margin: 20px;
  padding: 1px;
}
.content-header {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.content-title {
  justify-content: center;
  text-align: center;
  /*background-color: #76c276;*/
  background-color: #9abfa6;
  border-radius: 20px;
  color: white;
  padding: 5px;
  display: flex;
  margin-right: 10px;
  width: 80%;
}
.content-question {
  font-weight: 800;
}
.close-button {
  background-color: rgb(168, 209, 168);
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: revert;
  border-radius: 50%;
  font-weight: 800;
  font-size: 20px;
  color: rgb(85, 163, 85);
}
.nav-bar {
  display: flex;
  justify-content: center;
}
.content-sections {
  margin: 20px 0;
}
.content-section {
  font-size: 20px;
  color: black;
  justify-content: left;
  display: flex;
  border-radius: 10px;
  background-color: white;
  margin: 10px;
  align-items: center;
}
.content-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.content-summary-label {
  margin-left: 10px;
}
.raccoon-image {
  height: 80px;
  width: 100px;
  position: absolute;
  right: 5%;
  margin-top: 25px;
}
.reference-container {
  border: 1px solid black;
  height: 120px;
  margin: 10px;
  border-radius: 20px;
}
.content-description-label {
  margin-left: 10px;
}
</style>
