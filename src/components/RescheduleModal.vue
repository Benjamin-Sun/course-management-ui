<template>
    <el-dialog v-model="showModal" title="调课" @close="closeModal">
        <el-form>
            <el-form-item label="新的上课时间">
                <el-date-picker
                    v-model="newTime"
                    type="datetime"
                    placeholder="选择日期和时间"
                    format="YYYY-MM-DD HH:mm:ss"
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

const showModal = ref(false);
const newTime = ref(null);
const courseData = ref(null);

const show = (data) => {
  showModal.value = true;
  courseData.value = data;
  console.log(data);
};

const closeModal = () => {
  showModal.value = false;
};

const rescheduleCourse = async () => {
  try {
    await api.rescheduleCourse({
      courseId: courseData.value.courseId,
      newTime: newTime.value,
    });
    ElMessage.success("调课成功");
    closeModal();
  } catch (error) {
    ElMessage.error("调课失败");
    console.error("调课失败:", error);
  }
};

defineExpose({
  show,
});
</script>

<style scoped lang="scss">
</style>
