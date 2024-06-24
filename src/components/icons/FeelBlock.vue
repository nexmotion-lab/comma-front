<template>
  <div class="block">
    <div class="ment">
      <p>{{ date }}</p>
      <p>{{ tags }}</p>
    </div>
    <div class="circle"></div>
  </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';

    export default defineComponent({
    name: 'PostBlock',
    props: {
        date: {
        type: String as PropType<string>,
        required: true
        },
        tags: {
        type: String as PropType<string>,
        required: true
        }
    }
    });
  </script>
  
<style scoped>
  .ment {
    float: left;
    margin-top: 27px;
    font-size: 20px;
    margin-left: 20px;
}
.circle {
    background-color: yellow;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    float: right;
    align-items: center;
    text-align: center;
    justify-content: center;
}
.block {
    background-color: white;
    height: 10%;
    border-radius: 20px;
}
div {
    text-align: center;
    margin: 10px;
}
</style>