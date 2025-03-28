<template>
  <fieldset>
    <legend>Live Example</legend>
    <slot />
  </fieldset>
</template>

<script lang="ts">
export default {
  name: 'live-example'
}
</script>

<style scoped>
fieldset {
  border: 1px solid #777;
  border-radius: 6px;
  padding: 10px;
}

fieldset > ::v-deep(pre) {
  background: rgba(127, 127, 127, 0.15);
  border: 1px solid #ccc;
  padding: 2px;
}

fieldset > ::v-deep(pre::after) {
  content: " ";
  visibility: hidden;
}

fieldset > legend {
  /*border: 1px solid #777;*/
  /*border-radius: 6px;*/
  padding: 0 5px;
}
</style>
