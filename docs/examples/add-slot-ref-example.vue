<script setup>
import { ref } from 'vue'
import AddRef from './add-ref'

const index = ref(1)
</script>

<template>
  <button @click="index = index % 3 + 1">Next</button>
  <add-ref>
    <template v-for="n in 3">
      <template v-if="n === index">
        <div :key="n">Item {{ n }}</div>
      </template>
    </template>
  </add-ref>
</template>
