<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseBottomBar'
})
</script>

<template>
  <ion-footer >
    <ion-toolbar class="footer">
    <div class="image-container">
      <ion-img class="nav-btn" src="/public/letter.png"></ion-img>
      <ion-img class="nav-btn" src="/public/house.png"></ion-img>
      <ion-img class="nav-btn" src="/public/memo.png"></ion-img>
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
  //border-top: 1px solid rgba(0, 0, 0, 0.439);
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