<script lang="ts">
import { defineComponent } from 'vue'
import { IonToolbar, IonFooter, IonImg } from "@ionic/vue";
import letter from '@/assets/home/letter.png'
import house from '@/assets/home/house.png'
import memo from '@/assets/home/memo.png'
import {useIonRouter} from "@ionic/vue";
import {useRoute} from "vue-router";
export default defineComponent({
  components: {IonToolbar, IonFooter, IonImg},
  name: 'BaseBottomBar',
  data() {
    return {
      letter, house, memo
    }
  },
  setup() {
    const router = useIonRouter();
    const route = useRoute();

    const navigateTo = (routeName: string) => {
      if (route.path.startsWith("/diary")) {
        router.replace({path: routeName});
      } else {
        router.push({ path: routeName });
      }
    };

    return {
      navigateTo
    };
  }
})
</script>

<template>
  <ion-footer >
    <ion-toolbar class="footer">
    <div class="image-container">
      <ion-img class="nav-btn" :src=letter @click="navigateTo('/psyCenter')"></ion-img>
      <ion-img class="nav-btn" :src="house" @click="navigateTo('/home')"></ion-img>
      <ion-img class="nav-btn" :src="memo" @click="navigateTo('/diary')"></ion-img>
    </div>
    </ion-toolbar>
  </ion-footer>
</template>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  --background: var(--bottom-nav-bar);
  height: 10vh;
}

.image-container {
  display: flex;
  text-align: center;
  align-items: center; /* 세로 방향으로 가운데 정렬 */
  justify-content: center; /* 가로 방향으로 가운데 정렬 */
  gap: 10%;
}

.nav-btn {
  width: 20vw;
  height: 20vw;
  margin-left: 1vw;
  margin-right: 1vw;

}
</style>