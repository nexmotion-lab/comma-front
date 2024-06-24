<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import DateBox from '@/components/DateBox.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import BaseRoundButton from '@/components/common/BaseRoundButton.vue'
import { IonCard, IonCardContent } from '@ionic/vue'
import Tag from '@/components/icons/TagComponent.vue'

export default defineComponent({
  name: 'DiaryTwo',
  components: {
    IonCardContent, Tag, IonCard,
    BaseRoundButton,
    'BaseView' : BaseView,
    'BaseButton' : BaseButton,
    'BaseRoundButton' : BaseRoundButton,
    'BaseBottomBar': BaseBottomBar,
    'DateBox': DateBox,
    'SpeechBubble': SpeechBubble
  },
  data() {
    return {
      content: '' // 입력된 텍스트를 저장할 데이터 변수
    };
  }
})
</script>

<template>
  <BaseView/>
  <DateBox>2024/03/11</DateBox>
  <div class="menu-wrap">
    <BaseRoundButton class="menu" @click="$router.push('/diary/event')">사건</BaseRoundButton>
    <BaseRoundButton class="menu" @click="$router.push('/diary/thinking')">생각</BaseRoundButton>
    <BaseRoundButton class="menu" @click="$router.push('/diary/emotion')">감정</BaseRoundButton>
    <BaseRoundButton class="menu no-margin" @click="$router.push('/diary/core')">핵심</BaseRoundButton>
  </div>
  <div class="ment-wrap">
    <SpeechBubble class="ment">오늘 하루가 궁금해!<br>
      최대 10가지를 알려줘!</SpeechBubble>
    <ion-img class="nuguri" src="/public/nuguri.png"></ion-img>
  </div>
  <ion-card class="content-wrap">
    <div class="description">너의 이야기를 들려줘!</div>
    <textarea class="text" v-model="content" placeholder="최대 300자"></textarea>
    <div class="next-btn">
      <BaseButton @click="submit">다음</BaseButton>
    </div>
  </ion-card>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
  .next-btn {
    text-align: center;
  }

  .text {
    width: 100%;
    height: 80%;
    border: white;
    background-attachment: local;
    background-image:
      linear-gradient(to right, white 10px, transparent 10px),
      linear-gradient(to left, white 10px, transparent 10px),
      repeating-linear-gradient(white, white 30px, #ccc 30px, #ccc 31px, white 31px);
    line-height: 31px;
    padding: 8px 10px;
  }

  .menu-wrap {
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding-right: 3%;
    padding-left: 3%;
  }

  .menu {
    flex-grow: 1;
    margin-right: 10px;
  }

  .no-margin {
    margin: 0px;
  }

  .content-wrap {
    margin: 0px 10px;
    height: 50vh;
    border-radius: 15px;
  }

  .description {
    background-color: rgba(144, 238, 144, 0.45);
    padding: 5px 0px;
    text-align: center;
    border-radius: 15px 15px 0px 0px;
    border-bottom: solid 0.5px gray;
    box-shadow: 2px 2px;
  }

  .ment-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ment {
    margin-left: 3%;
    width: 60%;
  }

  .nuguri {
    width: 35%;
    margin-right: 3%;
  }
</style>