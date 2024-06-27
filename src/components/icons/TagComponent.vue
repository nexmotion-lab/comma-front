<template>
  <label class="custom-checkbox" :class="{ checked: isChecked }" :style="tagColor">
    <input type="checkbox" :value="value" v-model="isChecked">
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    value: Number,
    label: String,
    color: String,
    checked: Boolean
  },
  data() {
    return {
      isChecked: this.checked
    };
  },
  computed: {
    tagColor() {
      return {
        borderColor: this.color,
        backgroundColor: this.isChecked ? this.color : 'white'
      };
    }
  },
  watch: {
    isChecked(newVal) {
      this.$emit('input', newVal);
    }
  }
};
</script>

<style scoped>
.custom-checkbox {
  display: inline-block;
  position: relative;
  padding: 8px 10px;
  margin: 5px 3px;
  cursor: pointer;
  border: 2px solid var(--main-color);
  color: black;
  background-color: white;
  border-radius: 15px;
  user-select: none;
}

.custom-checkbox input {
  display: none;
}

.custom-checkbox.checked {
  background-color: var(--main-color);
}

.custom-checkbox span {
  display: inline-block;
  padding: 0;
  cursor: pointer;
}

</style>