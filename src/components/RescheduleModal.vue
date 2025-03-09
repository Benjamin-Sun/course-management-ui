<template>
  <el-dialog
    v-model="showModal"
    append-to-body
    align-center
    width="400px"
    title="调课"
    @close="closeModal"
  >
    <el-form>
    <!-- 数据 {{ courseData }} -->
      <el-form-item label="新的上课时间">
        <el-date-picker
          v-model="newTime"
          type="datetime"
          placeholder="选择日期和时间"
          format="YYYY-MM-DD HH:mm"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="rescheduleCourse">确定调课</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api";
import dayjs from 'dayjs'
const showModal = ref(false);
const newTime = ref(null);
const courseData = ref(null);

const emits = defineEmits(['reschedule-success']);

const show = (data) => {
  showModal.value = true;
  courseData.value = data;
  console.log(data);
  newTime.value = new Date(data.scheduleTime)
};

const closeModal = () => {
  showModal.value = false;
};

const rescheduleCourse = async () => {
  try {
    await api.reScheduleCourse({
      courseId: courseData.value.courseId,
      // newTime: (new Date(newTime.value)).getTime() // dayjs(newTime.value).format("YYYY-MM-DDTHH:mm:ss") // "YYYY-MM-DD HH:mm:ss"
      newTime: dayjs(newTime.value).format("YYYY-MM-DD HH:mm")
    });
    ElMessage.success("调课成功");
    closeModal();
    emits('reschedule-success');
  } catch (error) {
    ElMessage.error("调课失败");
    console.error("调课失败:", error);
  }
};

defineExpose({
  show,
});
</script>

<style scoped lang="scss"></style>
