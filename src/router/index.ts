import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CalendarMain from "@/views/calendar/CalendarMain.vue";
import HomeView from "@/views/home/HomeView.vue";
import DiaryMain from "@/views/diary/DiaryMain.vue";
import SelectCharacter from "@/views/diary/SelectCharacter.vue";
import Login from "@/views/signUp/Login.vue";
import InitMain from "@/views/signUp/InitMain.vue";
import DiaryCreate from "@/views/diary/DiaryCreate.vue";
import DiaryFinish from "@/views/diary/DiaryFinish.vue";
import DiaryList, {Diary} from "@/views/diary/DiaryList.vue";
import FirstLogin from "@/views/signUp/FirstLogin.vue";
import CenterPsyCenter from "@/views/center/CenterPsyCenter.vue";
import CenterPsyTest from "@/views/center/CenterPsyTest.vue";
import CenterPsyInfoDetail from "@/views/center/CenterPsyInfoDetail.vue";
import CenterPsyInfo from "@/views/center/CenterPsyInfo.vue";
import PsyCenter from "@/views/center/PsyCenter.vue";
import Statistics from "@/views/statistics/Statistics.vue";
import apiClient from "@/axios";
import {Network} from "@capacitor/network";
import {alertController,} from "@ionic/vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    beforeEnter: async (to, from, next) => {
      const status = (await Network.getStatus()).connected;
      if (status) {
        next();
      } else {
        const alert = await alertController.create({
          header: '연결 오류',
          message: '네트워크가 연결되지 않았습니다. Wi-Fi 또는 데이터를 활성화 해주세요.',
          buttons: [
            {
              text: '다시 시도',
              role: 'confirm',
              handler: async () => {
                const status = (await Network.getStatus()).connected;
                if (status) {
                  next();
                  return true;
                } else {
                  return false;
                }
              }
            }
          ],
          cssClass: "my-custom-alert-class"
        });
        await alert.present();
      }
    }
  },
  {
    path: '/firstLogin',
    name: 'FirstLogin',
    component: FirstLogin,
    meta: { hideBottomBar: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: CalendarMain
  },
  {
    path: '/diary',
    name: 'Diary',
    component: DiaryMain,
    beforeEnter: async (to, from, next) => {
      const today = new Date(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date()));

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;


      const response = await apiClient.get<Diary[]>('/api/diary/diary', {
        params: {
          startDate: formattedDate,
          endDate: formattedDate,
          orderByDesc: true,
        }
      });
      if (response.data.length > 0) {
        next('/diary/list')
      } else {
        next();
      }
    }
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
    component: Login,
    meta: { hideBottomBar: true }
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
