<template>
  <el-dialog v-model="showModal" title="当日总课时费" width="400px">
    <div>
      <p>总课时费: ￥{{ totalFee }}</p>
    </div>
    <template #footer>
      <el-button @click="showModal = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

const showModal = ref(false);
const totalFee = ref(0);

const show = (fee) => {
  totalFee.value = fee;
  showModal.value = true;
};

defineExpose({
  show,
});
</script>

<style scoped>
/* Add any additional styling if needed */
</style>