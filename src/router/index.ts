import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import CalendarMain from "@/views/calendar/CalendarMain.vue";
import HomeView from "@/views/HomeView.vue";
import DiaryListItem from "@/components/DiaryListItem.vue";
import DiaryMain from "@/views/diary/DiaryMain.vue";
import SelectCharacter from "@/views/diary/SelectCharacter.vue";
import BaseView from "@/components/common/BaseView.vue";
import BaseButton from "@/components/common/BaseButton.vue";
import DateBox from "@/components/DateBox.vue";
import SpeechBubble from "@/components/icons/SpeechBubble.vue";
import TagComponent from "@/components/icons/TagComponent.vue";
import FeelBlock from "@/components/icons/FeelBlock.vue";
import DiaryOne from "@/views/DiaryOne.vue";
import DiaryTwo from "@/views/DiaryTwo.vue";
import DiaryThree from "@/views/DiaryThree.vue";
import DiaryFour from "@/views/DiaryFour.vue";
import DiaryFive from "@/views/DiaryFive.vue";
import DiarySix from "@/views/DiarySix.vue";
import MainView from "@/views/MainView.vue";
import Axios from '@/views/axios.vue'
import SettingView from '@/views/SettingView.vue';
import Statistics from "@/views/statistics/Statistics.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/setting',
    name: 'Setting',
    component: SettingView
  },
  {
    path: '/axios',
    name: 'Axios',
    component: Axios
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarMain
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/diaryListItem',
    name: 'DiaryListItem',
    component: DiaryListItem,
  },
  {
    path: '/diary',
    name: 'Diary',
    component: DiaryMain
  },
  {
    path: '/diary/character',
    name: 'SelectCharacter',
    component: SelectCharacter
  },
  {
    path: '/compo',
    name: 'Compo',
    component: BaseView,
  },
  {
    path: '/button',
    name: 'btn',
    component: BaseButton,
  },
  {
    path: '/dtbox',
    name: 'Dtbox',
    component: DateBox,
  },
  {
    path: '/spcbub',
    name: 'Spcbub',
    component: SpeechBubble,
  },
  {
    path: '/tag',
    name: 'Tag',
    component: TagComponent,
  },
  {
    path: '/Felbck',
    name: 'Felbck',
    component: FeelBlock,
  },
  {
    path: '/diary/event',
    name: 'DiaryOne',
    component: DiaryOne,
    meta: { next: '/diary/thinking' }
  },
  {
    path: '/diary/thinking',
    name: 'DiaryTwo',
    component: DiaryTwo,
    meta: { next: '/diary/emotion' }
  },
  {
    path: '/diary/emotion',
    name: 'DiaryThree',
    component: DiaryThree,
    meta: { next: '/diary/core' }
  },
  {
    path: '/diary/core',
    name: 'DiaryFour',
    component: DiaryFour,
    meta: { next: '/diary/end' }
  },
  {
    path: '/diary/end',
    name: 'DiaryFive',
    component: DiaryFive,
  },
  {
    path: '/DiarySix',
    name: 'DiarySix',
    component: DiarySix,
  },
  {
    path: '/main',
    name: 'Main',
    component: MainView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
