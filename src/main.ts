import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import { App as CapacitorApp } from "@capacitor/app";
import './global.scss'


import { IonicVue } from '@ionic/vue';

import '@ionic/vue/css/core.css';

import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './registerServiceWorker.js';

const app = createApp(App)
  .use(IonicVue)
  .use(router)
    .use(store);

router.isReady().then(() => {
  app.use(store);
  app.mount('#app');

  CapacitorApp.addListener('appUrlOpen', (data) => {

    const url = new URL(data.url);
    const params = new URLSearchParams(url.search);

    const name = params.get('name');
    const birthday = params.get('birthday');
    const gender = params.get('gender');

    if (name) {
      store.commit('setName', name);
    }
    if (birthday) {
      store.commit('setBirthday', birthday);
    }
    if (gender) {
      store.commit('setGender', gender);
    }

    if (data.url.includes('comma://home')) {
      router.push({ name: 'DiaryList' });
    } else if (data.url.includes('comma://firstLogin')) {
      router.push({ name: 'InitNickName'});
    }
  })
});
