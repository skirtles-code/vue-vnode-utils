<script setup>
import { ref } from 'vue'
import AddMultipleRefs from './add-multiple-refs'

const count = ref(3)
</script>

<template>
  <button @click="count++">Add</button>
  |
  <button @click="count = Math.max(count - 1, 0)">Remove</button>
  <add-multiple-refs>
    <template v-for="n in count">
      <div>Item {{ n }}</div>
    </template>
  </add-multiple-refs>
</template>
