<template>
  <el-dialog v-model="modelValue" title="课程记录" width="600px" append-to-body>
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
        <el-input type="textarea" :rows="6" v-model="form.note" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="schedule-note-modal-footer">
        <el-button @click="modelValue = false">取消</el-button>
        <el-button type="warning" @click="removeCourse()">删除此课程</el-button>
        <el-button type="primary" @click="openRescheduleModal()">调课</el-button>
        <el-button type="primary" @click="updateStatus()">修改上课状态</el-button>
        <el-button type="primary" @click="submit()">添加记录</el-button>
      </div>
    </template>
  </el-dialog>

  <RescheduleModal ref="rescheduleModal" @reschedule-success="handleRescheduleSuccess" />
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
    modelValue.value = false;
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
    modelValue.value = false;
    emits("submit"); 
  } catch (error) {
    ElMessage.error("修改失败");
    console.error("修改失败:", error);
  }
};

const removeCourse = () => {
  ElMessageBox.confirm("确定要删除该课程吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await api.removeCourse([form.value.courseId]); 
        ElMessage.success("删除成功");
        modelValue.value = false; 
        emits("submit"); 
      } catch (error) {
        ElMessage.error("删除失败");
        console.error("删除课程失败:", error);
      }
    })
    .catch(() => {});
};

const rescheduleModal = ref(null);
const openRescheduleModal = () => {
  rescheduleModal.value.show(form.value);
};

const handleRescheduleSuccess = () => {
  modelValue.value = false;
  emits("submit");
};

defineExpose({
  show,
});
</script>


<style lang="scss"> 
</style>
