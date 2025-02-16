<template>
  <el-dialog
    :model-value="modelValue"
    title="自动排课"
    width="500px"
    @closed="close()"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="学生姓名" required>
        <el-input v-model="form.studentName" />
      </el-form-item>
      
      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          value-format="YYYY-MM-DDTHH:mm:ss"
          placeholder="选择开始时间"
        />
      </el-form-item>

      <el-form-item label="课程价格" required>
        <el-input-number v-model="form.courseFee" :min="0" :step="100" />
      </el-form-item>

      <el-form-item label="总课程数" required>
        <el-input-number v-model="form.totalCourses" :min="1" :max="50" />
      </el-form-item>

      <el-form-item label="循环周期">
        <el-select v-model="form.cycleType">
          <el-option label="每天" value="daily" />
          <el-option label="每周" value="weekly" />
          <el-option label="每月" value="monthly" />
          <el-option label="自定义天数" value="custom" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.cycleType === 'custom'" label="间隔天数">
        <el-input-number v-model="form.customDays" :min="1" :max="365" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="close()">取消</el-button>
      <el-button type="primary" @click="submitSchedule()">生成排课</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import api from "@/api";

const props = defineProps({
  startTime: {
    type: Object,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["updata:modelValue", "submit-success", 'close']);
// 对话框状态
const dialogVisible = ref(false);
const form = reactive({
  studentName: "",
  startTime: null,
  courseFee: 0,
  totalCourses: 1,
  cycleType: "weekly",
  customDays: 7,
});

watch(
  () => props.startTime,
  (newValue) => {
    form.startTime = dayjs(newValue).format("YYYY-MM-DDTHH:mm:ss");
  },
  { immediate: true }
);

const close = () => { 
  emits("update:modelValue", false);
  emits("close");
};
// 生成课程时间列表
const generateScheduleTimes = () => {
  if (!form.startTime) {
    ElMessage.error("请选择开始时间");
    return [];
  }

  const times = [];
  let current = dayjs(form.startTime);

  for (let i = 0; i < form.totalCourses; i++) {
    times.push(current.format("YYYY-MM-DDTHH:mm:ss"));

    switch (form.cycleType) {
      case "daily":
        current = current.add(1, "day");
        break;
      case "weekly":
        current = current.add(1, "week");
        break;
      case "monthly":
        current = current.add(1, "month");
        break;
      case "custom":
        current = current.add(form.customDays, "day");
        break;
    }
  }

  return times;
};
// 提交排课
const submitSchedule = async () => {
  try {
    const scheduleTimeList = generateScheduleTimes();
    if (!scheduleTimeList.length) return;

    const courseList = Array(form.totalCourses)
      .fill("")
      .map(() => ({
        courseFee: form.courseFee,
        courseNote: "", // 可根据需要添加备注输入
        courseStatus: 0,
      }));

    await api.addSchedule({
      studentName: form.studentName,
      scheduleTimeList,
      courseList,
    });
    ElMessage.success("排课成功");
    emits("submit-success");
    close()
  } catch (error) {
    ElMessage.error("排课失败");
    console.error(error);
  }
};


</script>

<style scoped lang="scss"></style>
