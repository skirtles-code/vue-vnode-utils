<script>
let id = 0
</script>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    required: true
  },
  value: {
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const radioModel = computed({
  get() {
    return props.modelValue
  },
  set(newChecked) {
    emit('update:modelValue', newChecked)
  }
})

const myId = `radio-button-${++id}`
</script>

<template>
  <div>
    <input type="radio" v-model="radioModel" :value="value" :id="myId">
    <label :for="myId"><slot /></label>
  </div>
</template>
