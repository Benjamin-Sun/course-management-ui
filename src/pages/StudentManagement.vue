<template>
  <div class="student-management">
    <!-- 新增跳转按钮 -->
    <div class="top-right">
      <el-button type="primary" @click="goToSchedule" class="schedule-button">
        <el-icon>
          <Calendar />
        </el-icon>
        课程排期
      </el-button>
    </div>
  </div>
  <div class="student-management">
    <!-- 搜索和操作区域 -->
    <div class="operation-area">
      <el-input
        v-model="searchName"
        placeholder="请输入学生姓名"
        style="width: 300px; margin-right: 10px"
      />
      <el-button type="primary" @click="searchStudent">搜索</el-button>
      <el-button type="success" @click="dialogVisible = true"
        >添加学生</el-button
      >
    </div>

    <!-- 学生表格 -->
    <el-table :data="studentList" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="studentName" label="姓名" width="120" />
      <el-table-column prop="studentGrade" label="年级" width="120" />
      <el-table-column prop="studentBirth" label="出生日期" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.studentBirth) }}
        </template>
      </el-table-column>
      <el-table-column prop="studentStatus" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.studentStatus === 1 ? 'success' : 'danger'">
            {{ statusMap[row.studentStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
            size="small"
            type="info"
            @click="showCourses(row.studentName)"
            >查看记录</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="removeStudent(row.studentName)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加学生对话框 -->
    <el-dialog v-model="dialogVisible" title="添加学生" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.studentName" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.studentGrade" />
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="form.studentBirth"
            type="datetime"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model.number="form.studentStatus">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">确认</el-button>
      </template>
    </el-dialog>

    <!-- 新增课程记录对话框 -->
    <el-dialog
      v-model="courseDialogVisible"
      title="课程记录"
      width="60%"
      top="5vh"
    >
      <el-table :data="courseList" border>
        <el-table-column prop="scheduleId" label="安排ID" width="100" />
        <el-table-column prop="courseId" label="课程ID" width="100" />
        <el-table-column prop="courseTime" label="课程时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.courseTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="courseNote" label="课程备注" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import Qs from "qs";
import api from "@/api";

import { useRouter } from "vue-router";
import { Calendar } from "@element-plus/icons-vue";

const router = useRouter();

const goToSchedule = () => {
  router.push({ name: "Schedule" });
};

// 状态映射
const statusMap = {
  1: "正常",
  0: "停用",
};

// 响应式数据
const searchName = ref("");
const studentList = ref([]);
const dialogVisible = ref(false);
const form = reactive({
  studentId: null,
  studentName: "",
  studentGrade: "",
  studentBirth: null,
  studentStatus: 1,
});

const courseDialogVisible = ref(false);
const courseList = ref([]);

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return "";
  return new Date(datetime).toLocaleString();
};

// 搜索学生
const searchStudent = async () => {
  try {
    const response = await api.getStudentByName(searchName.value);
    studentList.value = response.data ? [response.data] : [];
  } catch (error) {
    ElMessage.error("查询失败");
    console.error(error);
  }
};

// 提交添加
const submitAdd = async () => {
  try {
    await api.addStudent(form);
    ElMessage.success("添加成功");
    dialogVisible.value = false;
    Object.assign(form, {
      studentId: null,
      studentName: "",
      studentGrade: "",
      studentBirth: null,
      studentStatus: 1,
    });
    searchStudent(); // 刷新列表
  } catch (error) {
    ElMessage.error("添加失败");
    console.error(error);
  }
};

// 删除学生
const removeStudent = (name) => {
  ElMessageBox.confirm("确定要删除该学生吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const { data } = await api.removeStudent(name);
        if (data > 0) {
          ElMessage.success("删除成功");
          searchStudent(); // 刷新列表
        }
      } catch (error) {
        ElMessage.error("删除失败");
        console.error(error);
      }
    })
    .catch(() => {});
};

//查询记录
const showCourses = async (studentName) => {
  try {
    // const { data } = await axios.post(
    //   ":9800/courseManage/schedule/getAllCourses",
    //   Qs.stringify({ studentName }),
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     timeout: 5000,
    //   }
    // );
    const { data } = await api.getAllCourses(Qs.stringify({ studentName }));

    if (data && data.length > 0) {
      courseList.value = data;
      courseDialogVisible.value = true;
    } else {
      ElMessage.warning("该学生暂无课程记录");
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || "请求超时");
    console.error("Error details:", error);
  }
};
</script>

<style scoped>
.student-management {
  padding: 20px;
}

.operation-area {
  margin-bottom: 20px;
}

.top-right {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000; /* 确保按钮在表格上方 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .top-right {
    position: static;
    text-align: right;
    margin-bottom: 15px;
  }

  .schedule-button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
