<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import DateBox from '@/components/DateBox.vue'

export default defineComponent({
  name: 'DiaryFive',
  components: {
    'BaseView' : BaseView,
    'BaseButton' : BaseButton,
    'BaseBottomBar': BaseBottomBar,
    'SpeechBubble': SpeechBubble
  }
})
</script>

<template>
  <BaseView/>
    <div class="content">
      <div class="nickname">
        <p>닉네임</p>
      </div>
      <SpeechBubble>우리 꽤 친해진거 같은데!<br>너에 대해 알게되어서 행복해 ㅎㅎ</SpeechBubble>
      <div class="img-div">
        <ion-img src="/public/도토 기쁨 5.svg" alt="도토 이미지"></ion-img>
        <ion-img src="/public/도레 기쁨 5.svg" alt="도레 이미지"></ion-img>
      </div>
      <div>
        <BaseButton>타임라인</BaseButton>
        <BaseButton>일기보기</BaseButton>
      </div>
    </div>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
.nickname {
        position: absolute;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 20px;
        font-style: bold;
        top: -20%;
        left: -5%;
        padding: 1px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 10px;
        background-color: lightgray;
    }
  .content {
    position: absolute;
    top: 10%;
  }

  div {
    text-align: center;
    margin: 20px;
  }

  .content {
    width: 100%; /* 콘텐츠의 너비 */
    max-width: 100%; /* 최대 너비를 설정하여 너무 커지지 않도록 제한 */
    margin: 0;
  }

  ion-img {
    width: 50%;
    display: inline-block;
  }

  .img-div {

    margin-right: 5px;
    margin-left: 5px;
    margin-top: 20px;
  }
</style>