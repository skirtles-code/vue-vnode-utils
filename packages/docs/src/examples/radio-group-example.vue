<script setup>
import { ref } from 'vue'
import RadioButton from './radio-button.vue'
import RadioGroup from './radio-group'

const boundValue = ref(null)
</script>

<template>
  <div>Bound value: {{ boundValue }}</div>
  <div>
  <radio-group v-model="boundValue">
    <radio-button :value="null">None</radio-button>
    <radio-button v-for="item in ['First', 'Second', 'Third']" :value="item">{{ item }}</radio-button>
  </radio-group>
  </div>
</template>
