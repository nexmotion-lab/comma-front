<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import DateBox from '@/components/DateBox.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import BaseRoundButton from '@/components/common/BaseRoundButton.vue'
import Tag from '@/components/icons/TagComponent.vue'
import { IonCard } from '@ionic/vue'

export default defineComponent({
  name: 'DiaryFour',
  components: {
    IonCard, Tag,
    BaseRoundButton,
    SpeechBubble,
    'BaseView' : BaseView,
    'BaseButton' : BaseButton,
    'BaseBottomBar': BaseBottomBar,
    'DateBox': DateBox,
    'SpeechBubble': SpeechBubble
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
    <SpeechBubble class="ment">선택한 감정중 어떤 감정이<br>
      제일 기억에 남아?</SpeechBubble>
    <ion-img class="nuguri" src="/public/nuguri.png"></ion-img>
  </div>
  <ion-card class="content-wrap">
    <div class="description">너의 이야기를 들려줘!</div>
    <div class="content-wrap">
      <div class="tag-wrap">
        <Tag v-for="tag in emotionTags"
             :key="tag.value"
             :value="tag.value"
             :label="tag.label"
             v-model="selectedEvents"></Tag>
      </div>
      <div class="next-btn">
        <BaseButton @click="submit">다음</BaseButton>
      </div>
    </div>
  </ion-card>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
.next-btn {
  text-align: center;
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

.description {
  background-color: rgba(144, 238, 144, 0.45);
  border: 0.5px solid black;
  text-align: center;
  border-radius: 20px;
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

.tag-wrap {
  width: auto;
  height: 70% !important;
  overflow-y: auto;
  text-align: left;
}

tag {
  margin: 5px;
}

.content-wrap {
  margin: 5px;
  padding: 5px;
  height: 63vh;
  border-radius: 1rem;
}
</style>