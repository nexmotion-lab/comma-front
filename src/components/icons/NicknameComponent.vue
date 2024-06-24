<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NicknameComponent'
})
</script>

<template>
  <div class="nickname"><slot>닉네임</slot></div>
</template>

<style scoped>
.nickname {
  margin-top: 6vh;
  margin-bottom: 0.7vh;
  margin-left: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 1.15em;
  width: max-content;
}
</style>