<script setup>
import BasicAccordion from './basic-accordion.vue'
import BasicAccordionPanel from './basic-accordion-panel.vue'
</script>

<template>
  <basic-accordion>
    <basic-accordion-panel title="First">
      First panel content
    </basic-accordion-panel>
    <basic-accordion-panel title="Second">
      Second panel content
    </basic-accordion-panel>
    <basic-accordion-panel title="Third">
      Third panel content
    </basic-accordion-panel>
  </basic-accordion>
</template>
