<script lang="ts">
import { defineComponent } from 'vue';
import BaseView from '@/components/common/BaseView.vue';
import BaseBottomBar from '@/components/common/BaseBottomBar.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import SpeechBubble from '@/components/icons/SpeechBubble.vue';
import DateBox from '@/components/DateBox.vue';
import TagComponent from '@/components/icons/TagComponent.vue';
import { IonCard } from '@ionic/vue';
import BaseRoundButton from '@/components/common/BaseRoundButton.vue';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

interface Tag {
  tag_id: number;
  name: string;
}

interface EventTag {
  label: string;
  value: number;
}

export default defineComponent({
  name: 'DiaryOne',
  components: {
    IonCard,
    'BaseView': BaseView,
    'BaseBottomBar': BaseBottomBar,
    'BaseButton': BaseButton,
    'BaseRoundButton': BaseRoundButton,
    'SpeechBubble': SpeechBubble,
    'DateBox': DateBox,
    'Tag': TagComponent
  },
  data() {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
    const date: number = currentDate.getDate();

    return {
      today: `${year}/${month}/${date}`,
      defaultTags: [
        { tag_id: 1, name: '일' },
        { tag_id: 2, name: '학업' },
        { tag_id: 3, name: '가족' },
        { tag_id: 4, name: '대인관계' },
        { tag_id: 5, name: '취미/여가' },
        { tag_id: 6, name: '친구' },
        { tag_id: 7, name: '연애' },
        { tag_id: 8, name: '돈' },
        { tag_id: 9, name: '건강' },
        { tag_id: 10, name: '과제' },
        { tag_id: 11, name: '휴식' },
        { tag_id: 12, name: '자기관리' },
        { tag_id: 12, name: '쇼핑' },
        { tag_id: 13, name: '집안일' },
        { tag_id: 14, name: '식사' },
        { tag_id: 15, name: '적응' },
        { tag_id: 16, name: '만남' },
        { tag_id: 17, name: '여행' },
        { tag_id: 18, name: '모임' },
        { tag_id: 19, name: '독립' },
        { tag_id: 20, name: '진로' },
        { tag_id: 21, name: '취업' },
        { tag_id: 22, name: '동료' },
        { tag_id: 23, name: '아르바이트' },
      ] as Tag[],
      eventTags: [] as EventTag[]
    };
  },
  computed: {
    ...mapGetters(['getSelectedEvents']),
    selectedEvents: {
      get(): number[] {
        return this.getSelectedEvents;
      },
      set(value: number[]) {
        this.saveSelectedEvents(value);
      }
    }
  },
  mounted() {
    this.fetchCheckboxOptions();
  },
  methods: {
    ...mapActions(['saveFormData', 'saveSelectedEvents']),
    fetchCheckboxOptions() {
      const accountId = '4';

      axios.get('http://localhost:8092/api/v1/diary/events', {
        headers: {
          account_id: accountId
        }
      })
        .then(response => {
          this.eventTags = response.data.map((tag: { eventTagNo: number, name: string }) => ({
            label: tag.name,
            value: tag.eventTagNo
          }));
        })
        .catch(error => {
          console.error('Error fetching checkbox options:', error);
        });
    },
    handleCheckboxChange(optionValue: number) {
      const selected = [...this.selectedEvents];
      const index = selected.indexOf(optionValue);
      if (index > -1) {
        selected.splice(index, 1);
      } else {
        selected.push(optionValue);
      }
      this.saveSelectedEvents(selected);
    },
    submit() {
      this.$router.push(this.$route.meta.next);
    }
  }
});
</script>

<template>
  <BaseView/>
    <DateBox>{{today}}</DateBox>
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
    <div class="search-wrap">
      <input class="search-tag" placeholder="태그 검색">
      <ion-img class="sea" src="/public/search.png"></ion-img>
    </div>
    <div>
      <div class="tag-wrap">
        <Tag v-for="(item, key, index) in defaultTags"
             :key="item['tag_id']"
             :label="item['name']">
        </Tag>
        <Tag v-for="tag in eventTags"
             :key="tag.value"
             :value="tag.value"
             :label="tag.label"
             :checked="selectedEvents.includes(tag.value)"
             @change="handleCheckboxChange(tag.value)"></Tag>
        <BaseButton class="add-btn" @click="">+</BaseButton>
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
    height: 10%;
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

  .no-right-margin {
    margin-right: 0px;
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

  .search-wrap {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.97fr;
  background-color: white;
  padding-left: 10px;
  }

  .search-tag {
    display: inline-block;
    align-items: center;
    border: none;
  }

  .sea {
    display: inline-block;
    height: 30px;
    margin-top: 1px;
    float: right;
    margin-left: auto;
  }

  .description {
    background-color: rgba(144, 238, 144, 0.45);
    padding: 5px 0px;
    text-align: center;
    border-radius: 15px 15px 0px 0px;
  }

  .add-btn {
    --background: white;
    --border-color: var(--main-color);
    --border-style: solid;
    --border-width: 2px;
    padding: 8px 10px;
  }
</style>