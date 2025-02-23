<template>
  <el-dialog v-model="modelValue" title="XXXX" width="500px" >
    <el-form :model="form" label-width="100px">
      <el-form-item label="姓名" required>
        <el-input disabled v-model="form.studentName" />
      </el-form-item> 
      <el-form-item label="Note:" required>
        <el-input type="textarea" :row="4" v-model="form.note" />
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

const form = ref({}); 
const show = data => {
  modelValue.value = true; 
  form.value = {
    ...data,
    note: ''
  }
  console.log(data); 
} 

const submit = async () => {
  await api.addCourseNote({
    studentName: form.studentName, 
    note: form.note, 
  })
  ElMessage.success("添加成功");
  emits('submit')
}

defineExpose({
  show
});
</script>

<style scoped lang="scss"></style>
