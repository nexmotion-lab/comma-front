import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CalendarMain from "@/views/calendar/CalendarMain.vue";
import HomeView from "@/views/home/HomeView.vue";
import DiaryListItem from "@/components/DiaryListItem.vue";
import DiaryMain from "@/views/diary/DiaryMain.vue";
import SelectCharacter from "@/views/diary/SelectCharacter.vue";
import Login from "@/views/signUp/Login.vue";
import InitMain from "@/views/signUp/InitMain.vue";
import DiaryCreate from "@/views/diary/DiaryCreate.vue";
import DiaryFinish from "@/views/diary/DiaryFinish.vue";
import DiaryList from "@/views/diary/DiaryList.vue";
import FirstLogin from "@/views/signUp/FirstLogin.vue";
import CenterPsyCenter from "@/views/center/CenterPsyCenter.vue";
import CenterPsyTest from "@/views/center/CenterPsyTest.vue";
import CenterPsyInfoDetail from "@/views/center/CenterPsyInfoDetail.vue";
import CenterPsyInfo from "@/views/center/CenterPsyInfo.vue";
import PsyCenter from "@/views/center/PsyCenter.vue";
import Statistics from "@/views/statistics/Statistics.vue";
import {Preferences} from "@capacitor/preferences";
import {getAccessToken, isLogin} from "@/axios";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',

  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/firstLogin',
    name: 'FirstLogin',
    component: FirstLogin
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
    path: '/diary',
    name: 'Diary',
    component: DiaryMain
  },
  {
    path: '/diary/character',
    name: 'SelectCharacter',
    component: SelectCharacter,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/initMain',
    name: 'InitMain',
    component: InitMain
  },
  {
    path: '/diary/finish',
    component: DiaryFinish
  },
  {
    path: '/diary/list',
    component: DiaryList,
    name: 'DiaryList'
  },
  {
    path: '/diary/create',
    component: DiaryCreate,
    children: [
      {
        path: '',
        redirect: '/diary/create/event'
      },
      {
        path: 'event',
        component: () => import('@/views/diary/DiaryEvent.vue'),
      },
      {
        path: 'content',
        component: () => import('@/views/diary/DiaryContent.vue'),
      },
      {
        path: 'emotion',
        component: () => import('@/views/diary/DiaryEmotion.vue'),
      },
      {
        path: 'coreEmotion',
        component: () => import('@/views/diary/DiaryCoreEmotion.vue'),
      }
    ]
  },
  {
    path: '/psyCenter',
    component: PsyCenter,
    children:[
      {
        path: '',
        redirect: '/psyCenter/psyInfo'
      },
      {
        path: 'psyInfo',
        name: 'CenterPsyInfo',
        component: CenterPsyInfo
      },
      {
        path: 'psyInfo/detail/:id',
        name: 'CenterPsyInfoDetail',
        component:CenterPsyInfoDetail
      },
      {
        path: 'psyTest',
        name: 'CenterPsyTest',
        component:CenterPsyTest
      },
      {
        path: 'center',
        name: 'CenterPsyCenter',
        component: CenterPsyCenter
      }

    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})




export default router
