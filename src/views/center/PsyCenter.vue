<script setup lang="ts">
import CenterTopButton from "@/views/center/components/CenterTopButton.vue";
import BaseView from "@/components/common/BaseView.vue";
import { IonRouterOutlet, IonPage } from "@ionic/vue";
import BaseBottomBar from "@/components/common/BaseBottomBar.vue";
import {useRouter, useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();
const router = useRouter();
const navigate = (component: string) => {
  router.push({name: component});
};

const isCurrentRoute = (routeName: string) => {
  return computed(()=> route.name === routeName);
}
</script>

<template>
  <BaseView />
  <ion-page>
    <div class="header">
      <div class="nav-bar">
        <CenterTopButton :isActive="isCurrentRoute('CenterPsyInfo').value" @click="navigate('CenterPsyInfo')">심리정보</CenterTopButton>
        <CenterTopButton :isActive="isCurrentRoute('CenterPsyTest').value" @click="navigate('CenterPsyTest')">심리검사</CenterTopButton>
        <CenterTopButton :isActive="isCurrentRoute('CenterPsyCenter').value" @click="navigate('CenterPsyCenter')">상담센터</CenterTopButton>
      </div>
    </div>
    <ion-router-outlet></ion-router-outlet>
    <BaseBottomBar></BaseBottomBar>
  </ion-page>
</template>

<style scoped>
.header {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  margin-bottom:20%;
}

.nav-bar {
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}

ion-router-outlet{
  margin-top: 20%;
}

base-bottom-bar{
  z-index:100;
}



</style>