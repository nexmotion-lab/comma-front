<script lang="ts">
import { defineComponent } from 'vue'
import BaseView from '@/components/common/BaseView.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseBottomBar from '@/components/common/BaseBottomBar.vue'
import DateBox from '@/components/DateBox.vue'
import SpeechBubble from '@/components/icons/SpeechBubble.vue'
import BaseRoundButton from '@/components/common/BaseRoundButton.vue'
import Tag from '@/components/icons/TagComponent.vue'
import {IonCard, IonPage} from '@ionic/vue'
import {mapActions, mapState} from "vuex";

export default defineComponent({
  name: 'DiaryThree',
  components: {
    IonCard, Tag,
    BaseRoundButton,
    SpeechBubble,
    'BaseView' : BaseView,
    'BaseButton' : BaseButton,
    'BaseBottomBar': BaseBottomBar,
    'DateBox': DateBox,
    'SpeechBubble': SpeechBubble,
    'ion-card': IonCard,
    'ion-page': IonPage
  },
  computed: {
    ...mapState({
      emotionTags: (state: any) => state.emotionTags,
      selectedEmotions: (state: any) => state.selectedEmotions
    })
  },
  data() {
    return {
      isChecked: [] as number[]
    };
  },
  methods: {
    submit() {
      this.$router.push(this.$route.meta.next); // 다음 페이지로 이동하는 라우트
    }
  }
})

</script>

<template>
  <BaseView/>
  <ion-page class="custom-page">
  <DateBox>2024/03/11</DateBox>
  <div class="menu-wrap">
    <BaseRoundButton class="menu" @click="$router.push('/diary/event')">사건</BaseRoundButton>
    <BaseRoundButton class="menu" @click="$router.push('/diary/thinking')">생각</BaseRoundButton>
    <BaseRoundButton class="menu" @click="$router.push('/diary/emotion')">감정</BaseRoundButton>
    <BaseRoundButton class="menu no-right-margin" @click="$router.push('/diary/core')">핵심</BaseRoundButton>
  </div>
  <div class="ment-wrap">
    <SpeechBubble class="ment">오늘 하루가 궁금해!<br>
      최대 10가지를 알려줘!</SpeechBubble>
    <ion-img class="nuguri" src="/public/nuguri.png"></ion-img>
  </div>
  <ion-card class="content-wrap">
    <div class="description">너의 이야기를 들려줘!</div>
    <div class="content-wrap">
      <div class="tag-wrap">
        <Tag v-for="tag in emotionTags"
             :key="tag.emotion_tag_no"
             :value="tag.emotion_tag_no"
             :label="tag.name"
             :color="tag.color"
             :initialChecked="selectedEmotions.includes(tag.emotion_tag_no)"
             @tag-selected="handleTagSelected"></Tag>
      </div>
      <div class="next-btn">
        <BaseButton @click="submit">다음</BaseButton>
      </div>
    </div>
  </ion-card>
  <BaseBottomBar></BaseBottomBar>
  </ion-page>
</template>

<style scoped>
.custom-page{
  justify-content: normal;
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

.no-right-margin {
  margin-right: 0px;
}

.content-wrap {
  margin: 0px 10px;
  height: 50vh;
  border-radius: 15px;
}

.tag-wrap {
  height: 90%;
  overflow-y: auto;
  text-align: center;
}

.next-btn {
  text-align: center;
}

.description {
  background-color: rgba(144, 238, 144, 0.45);
  padding: 5px 0px;
  text-align: center;
  border-radius: 15px 15px 0px 0px;
}

.ment-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ment {
  margin-left: 3%;
  width: 70vw;
}

.nuguri {
  width: 35%;
  margin-right: 3%;
}
</style>