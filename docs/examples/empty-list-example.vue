<script setup>
import ResultsList from './results-list'
</script>

<template>
  <pre>[]</pre>
  <results-list>
    <li v-for="result in []">{{ result }}</li>
  </results-list>
  <pre>['red', 'green', 'blue']</pre>
  <results-list>
    <li v-for="result in ['red', 'green', 'blue']">{{ result }}</li>
  </results-list>
</template>
