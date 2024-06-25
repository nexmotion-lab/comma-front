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
    'ion-card': IonCard
  },
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
    <div class="content-wrap">
      <div class="tag-wrap">
        <Tag v-for="tag in emotionTags"
             :key="tag.value"
             :value="tag.value"
             :label="tag.label"
             v-model="selectedEomtions"></Tag>
      </div>
      <div class="next-btn">
        <BaseButton @click="submit">다음</BaseButton>
      </div>
    </div>
  </ion-card>
  <BaseBottomBar></BaseBottomBar>
</template>

<style scoped>
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
  margin: 5px;
  padding: 5px;
  height: 63vh;
  border-radius: 1rem;
}

.tag-wrap {
  width: auto;
  height: 70% !important;
  overflow-y: auto;
  text-align: left;
}

.next-btn {
  text-align: center;
}

  .def {
    display: flex;
  }
  .box {
    display: inline-flex;
  }
  .but {
    background-color: rgba(144, 238, 144, 0.453);
    padding: 1px;
    border-radius: 20px;
    margin-left: 30%;
    margin-right: 30%;
    text-align: center;
    margin-top: 85%;
  }
  .click {
    border: 2px solid lightgreen;
    padding: 11px;
    padding-top: 1px;
    padding-bottom: 1px;
    border-radius: 20px;
    margin-top: 10px;
    margin-right: 5px;
    text-align: center;
  }
  .search-tag {
    opacity: 0.5;
    display: inline-block;
    text-align: center;
    flex-grow: 1;
  }
  .sea {
    display: inline-block;
    height: 30px;
    margin-top: 1px;
    float: right;
    margin-left: auto;
  }
  .search-wrap {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 0.97fr;
    margin-top: 5px;
    background-color: white;
    border: 0.5px solid black;
    padding-left: 15px;
    border-radius: 20px;
  }
  .description {
    background-color: rgba(144, 238, 144, 0.45);
    border: 0.5px solid black;
    text-align: center;
    border-radius: 20px;
  }
  .block {
    font-size: 20px;
    color: black;
    padding: 5px;
    border: 1px solid green;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5%;
    margin-bottom: 5%;
    border-radius: 20px;
    background-color: white;
    height: 50%;
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
  .date {
    font-size: 30px;
    color: black;
    justify-content: center;
    display: flex;
    padding: 10px;
    padding-top: 3px;
    padding-bottom: 3px;
    border: 1px solid green;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 10%;
    margin-bottom: 5%;
    border-radius: 20px;
    background-color: white;
  }
</style>