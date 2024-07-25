<script setup lang="ts">

import DiaryInformation from "@/components/diary/DiaryInformation.vue";
import {computed, onMounted, ref, watch} from "vue";
import {
  alertController,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonCol,
  IonGrid,
  IonPage,
  IonRow,
  IonSearchbar,
    IonIcon,
    IonRippleEffect,
    IonButton
} from "@ionic/vue";
import { EventTag} from "@/store";
import apiClient from "@/axios";
import { useStore } from "vuex";
import { addCircleOutline } from "ionicons/icons";
import router from "@/router";
import {selectTab} from "@/utils/tabs";

const store = useStore();
const text = ref("오늘 하루가 궁금해!\n최대 10가지 알려줘!");

const searchQuery = ref('');
const eventTags = ref<EventTag[]>([]);
const filteredTags = ref<EventTag[]>([]);

const handleInput = (event: any) => {
  searchQuery.value = event.target.value.toLowerCase();
  console.log(searchQuery)
};

const filterTags = () => {
  if (!searchQuery.value) {
    filteredTags.value = eventTags.value;
  } else {
    filteredTags.value = eventTags.value.filter(tag => tag.name.toLowerCase().includes(searchQuery.value));
  }
  console.log(filteredTags)
};

watch([searchQuery, eventTags], filterTags)

const toggleTag = async (tag: EventTag) => {
  const result = await store.dispatch('toggleEventTag', tag);
  if (!result) {
    const alert = await alertController.create({
      header: '잘못된 선택',
      message: '사건은 최대 10가지만 선택할 수 있어요! 선택한 사건태그를 취소하고 추가로 선택해주세요!',
      buttons: ['확인'],
    })
    await alert.present();
  }
};

const isSelected = (tag: EventTag) => {
  return computed(() => {
    return store.state.diary.selectedEventTags.some((selectedTag: EventTag) => selectedTag.eventTagNo === tag.eventTagNo);
  });
};

onMounted(async () => {
    const response = await apiClient.get('/api/v1/diary/eventTag', {
      headers: {
        'X-User-Id': '4'
      }
    });
    eventTags.value = response.data;
    console.log(eventTags.value)
})

async function eventAlertCreate() {
  const alert = await alertController.create({
    header: '사건태그추가',
    inputs: alertInputs,
    buttons: alertButtons,
    cssClass: "my-custom-alert-class",
  })
  alert.present();
}

const alertInputs = [
  {
    name: 'eventTagInput',
    placeholder: '#사건',
    attributes: {
      maxlength: 12
    },
  }
]

const alertButtons = [
  {
    text: '취소',
    role: 'cancle',

  },
  {
    text: '추가',
    role: 'confirm',
    handler: async (data: { eventTagInput: string }) => {
      const inputValue = data.eventTagInput;
      const response = await apiClient.post('/api/v1/diary/eventTag', {}, {
        params: {
          eventTagName: inputValue
        },
        headers: {
          'X-User-Id': '4',
        }
      });

      if (response.status === 200) {
        const newTag = response.data;
        eventTags.value.unshift(newTag);
        toggleTag(newTag);

      } else {
        //나중에 핸들링하기
      }

    },

  }
]

const switchTab = () => {
  router.push({ path: '/diary/create/content', replace: true});
}

</script>

<template>
  <ion-page>
    <DiaryInformation :text="text">
    </DiaryInformation>
    <ion-card class="emotion-content">
      <ion-card-header class="tab-card"></ion-card-header>
      <ion-card-content class="tab-card-content">
        <ion-searchbar animated="true" placeholder="태그 검색" class="event-searchbar"
        :debounce="1000" @ionInput="handleInput($event)">
        </ion-searchbar>
        <div class="emotion-grid-container">
          <ion-grid class="event-grid">
            <ion-row class="event-row">
              <ion-col v-for="tag in filteredTags" :key="tag.eventTagNo" size="auto" class="event-col">
                <ion-chip class="event-chip" @click="toggleTag(tag)" :style="{ backgroundColor: isSelected(tag).value ? '#A3E2B8FF' : 'white' }">
                  {{ tag.name }}
                </ion-chip>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div class="plus-icon-container">
          <div class="ion-activatable ripple-parent circle">
           <ion-icon :icon="addCircleOutline" class="plus-icon" @click="eventAlertCreate">
            </ion-icon>
            <ion-ripple-effect style="color: #0c8c42"></ion-ripple-effect>
         </div>
        </div>
        <ion-button @click="switchTab" class="next-btn">
          다음
        </ion-button>
      </ion-card-content>
    </ion-card>
  </ion-page>
</template>

<style scoped>



.tab-card {
  --background: #A3E2B8FF;
}

.next-btn {
  margin-left: 70vw;
  --background: green;
}

.emotion-content {
  border-radius: 30px;
  --background: white;
  height: 60vh;
}

.tab-card-content {
  height: auto;
  padding: 0;
}

.emotion-grid-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 37vh;
}

.event-chip {
  --background: white;
  border: 0.8vw solid #A3E2B8FF;
  font-size: 4vw;

}

.event-col {
  padding: 0;
}

.plus-icon-container {
  padding-left: 38vw;

}

.event-row {
  justify-content: center;
}
.emotion-grid-container::-webkit-scrollbar {
  height: 1.5vh;
}

.emotion-grid-container::-webkit-scrollbar-track {
  background: #A3E2B8FF;
}

.emotion-grid-container::-webkit-scrollbar-thumb {
  background: #0c8c42;
  pointer-events: auto;
}

.event-searchbar {
  width: auto;
  padding: 0;
  border: 0.8vw solid darkgray;
  --background: white;

}

.plus-icon {
  font-size: 12vw;

}

.ripple-parent {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.circle {
  width: 12vw;
  height: 12vw;
  border-radius: 50px;
}


</style>