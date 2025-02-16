<template>
  <el-dialog v-model="modelValue" title="XXXX" width="500px" >
    <el-form :model="form" label-width="100px">
      <el-form-item label="学生姓名" required>
        <el-input v-model="form.studentName" />
      </el-form-item> 
    </el-form>

    <template #footer>
      <el-button @click="modelValue = false">取消</el-button>
      <el-button type="primary" @click="submit()">添加记录</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import api from "@/api";

const props = defineProps({

});

const modelValue = ref(false)
const emits = defineEmits([ "submit", 'close']);

const form = reactive({
  studentName: "", 
}); 
const show = data => {
  console.log(data); 
  modelValue.value = true;
  // ... 根据data写入form

} 

const submit = async () => {
  await api.addCourseNote({
    studentName: form.studentName, 
  })
  ElMessage.success("添加成功");
  emits('submit')
}

defineExpose({
  show
});
</script>

<style scoped lang="scss"></style>
