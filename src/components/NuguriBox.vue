<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'NuguriBox',
  props: {
    image: {
      type: String,
      required: true
    }
  }
});
</script>

<template>
  <div class="ment">
    <p class="ment2">
      <slot></slot>
    </p>
    <ion-img class="nuguri" :src="image"></ion-img>
  </div>
</template>

<style scoped>
.ment {
  display: flex;
  justify-content: space-between; /* 요소 사이에 공간을 균등하게 배분 */
  border: 1px solid green;
  margin: 5% 5%; /* 5% 상하좌우 여백 */
  border-radius: 35px;
  background-color: #9abfa6;
  height: 90px;
}

.ment2 {
  display: flex;
  align-items: center;
  padding-left: 2vw;
  font-size: 18px;
  font-weight: bold;
  flex: 1;
}

.nuguri {
  height: 7vh;
  margin: 0 2.3vh 0 1vh;
  align-self: flex-end; /* 아래 경계선에 맞추기 */
}
</style>
