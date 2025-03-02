<template>
  <el-dialog v-model="modelValue" title="课程记录" width="600px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="姓名" required>
        <el-input disabled v-model="form.studentName" />
      </el-form-item>

      <el-form-item label="上课状态">
        <el-select v-model="form.courseStatus" label="上课状态" required>
          <el-option label="未上" :value="0" />
          <el-option label="已上" :value="1" />
          <el-option label="取消" :value="-1" />
        </el-select>
      </el-form-item>

      <el-form-item label="上课情况" required>
        <el-input type="textarea" :row="4" v-model="form.note" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="modelValue = false">取消</el-button>
      <el-button @click="openRescheduleModal(form.value)">调课</el-button>
      <el-button type="primary" @click="updateStatus()">修改上课状态</el-button>
      <el-button type="primary" @click="submit()">添加记录</el-button>
    </template>
  </el-dialog>

  <RescheduleModal ref="rescheduleModal" />
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import api from "@/api";
import RescheduleModal from "@/components/RescheduleModal.vue";

const props = defineProps({});

const modelValue = ref(false);
const emits = defineEmits(["submit", "close", "updateStatus"]);

const form = ref({});
const show = async (data) => {
  modelValue.value = true;
  form.value = {
    ...data,
    note: "",
  };
  console.log(data);

  try {
    const response = await api.getCourseById(data.courseId);
    form.value.note = response.data.courseNote;
    form.value.courseStatus = response.data.courseStatus;
    console.log(response);
  } catch (error) {
    ElMessage.error("加载课程记录失败");
    console.error("加载课程记录失败:", error);
  }
};

const submit = async () => {
  try {
    await api.addCourseNote({
      courseNote: form.value.note,
      courseId: form.value.courseId,
    });
    ElMessage.success("添加成功");
    emits("submit");
  } catch (error) {
    ElMessage.error("添加失败");
    console.error("添加上课记录失败:", error);
  }
};

const updateStatus = async () => {
  try {
    await api.updateCourseStatus({
      courseId: form.value.courseId,
      courseStatus: form.value.courseStatus,
    });
    ElMessage.success("修改成功");
    emits("updateStatus");
  } catch (error) {
    ElMessage.error("修改失败");
    console.error("修改失败:", error);
  }
};

const rescheduleModal = ref(null);
const openRescheduleModal = (course) => {
  rescheduleModal.value.show(course);
};

defineExpose({
  show,
});
</script>

<style scoped lang="scss"></style>
