<template>
  <div class="selected-item">
    <div class="document-name">{{ doc.name }}</div>
    <div class="remove-action">
      <v-checkbox dense v-model="doc.selected"></v-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedDocumentItem',
  props: {
    doc: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid #cccccc;
}
</style>
