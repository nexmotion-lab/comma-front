<template>
    <div id="app">
      <button @click="showModal = true">Open Modal</button>
      <ModalComponent :isVisible="showModal" @close="showModal = false" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import ModalComponent from '@/components/SettingModal.vue';
  
  export default defineComponent({
    name: 'App',
    components: {
      ModalComponent
    },
    data() {
      return {
        showModal: false
      };
    }
  });
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
  }
  </style>