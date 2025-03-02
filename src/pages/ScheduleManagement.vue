<template>
  <div class="course-schedule">
    <!-- 主日历区域 -->
    <el-calendar class="course-calendar" v-model="currentDate" ref="calendar" @change="">
      <template #header="{ date }">
        <span> {{ date }}</span> 
        <div class="header-button-right">
          <el-button-group style="margin-right: 8px;">
            <el-button type="primary" size="medium" @click="showAddScheduleModal = true">
              添加课程
            </el-button>
            <el-button type="primary" size="medium" @click="router.push({name: 'StudentManagement'})">
              学生管理
            </el-button>
          </el-button-group>
          <el-button-group class="calendar-control-button">
            <el-button size="medium" @click="selectDate('prev-month')">
              上月
            </el-button>
            <el-button size="medium" @click="selectDate('today')">
              今天
            </el-button>
            <el-button size="medium" @click="selectDate('next-month')">
              下月
            </el-button>
          </el-button-group>
        </div>
       
      </template>
      <template #date-cell="{ data }">
        <div :class="['calendar-day', data.type]" class="">
          <div class="day-number">
            {{ data.day.split("-").slice(2).join("-") }} 
          </div>
          <div class="courses" v-if="allCourses[data.day]">
            <div
              v-for="(course, index) in allCourses[data.day]"
              :key="index"
              class="course-item"
              @click="openScheduleNoteModal(course)"
            >
              <el-tag type="info">
                {{ course.studentName }}
                 {{ formatTime(course.scheduleTime) }}
              </el-tag>
              <div v-if="course.courseNote" class="course-note">
                {{ course.courseNote }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
 
    <!-- 排课对话框 -->
    <ScheduleModal :startTime="currentDate" v-model="showAddScheduleModal" @submit-success="loadCourses()" />
    <ScheduleNoteModal ref="scheduleNoteModal" @submit="loadCourses()" /> 
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
import dayjs from "dayjs";
import api from "@/api";
import ScheduleModal from "@/components/ScheduleModal.vue";
import ScheduleNoteModal from "@/components/ScheduleNoteModal.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const allCourses = ref({});
const showAddScheduleModal = ref(false);
const currentDate = ref(new Date());
const calendar = ref(null);

 
const scheduleNoteModal = ref(null) 
const openScheduleNoteModal = (course) => {
  scheduleNoteModal.value.show(course)
};

// 时间格式化
const formatTime = (timeStr) => dayjs(timeStr).format("HH:mm") || ''; 

const loadCourses = async () => {
  try {
    const date = dayjs(currentDate.value).format("YYYY-MM") || '';
    allCourses.value = await api.getAllStudentCourseAndTime(date);
    console.log({...allCourses.value})
  } catch (error) {
    console.error(error);
    ElMessage.error("加载课程失败");
  }
};

const selectDate = (val) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
  loadCourses()
};


loadCourses();
</script>

<style scoped lang="scss">
.course-schedule {
  width: 100%; 
  display: flex;
  align-items: center;
  button {
    outline: none;
  }
  :deep(.course-calendar) { 
    --el-calendar-cell-width: 15vh;
    .el-calendar-table__row {
      td.current {
        &.is-today {
          .el-calendar-day {
            .day-number {
              font-weight: 600;
              background-color: rgb(223, 255, 255);
            }
          }
        }
      }
    } 
    .el-calendar-day {
      padding: 0;
      overflow: hidden;
      // height: 100%;
      .calendar-day {
        height: 100%;
        padding: 4px;
        box-sizing: border-box;
        .day-number {
          font-size: 16px;
          text-align: left;
          padding: 2px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        &:not(.current-month) {
          background-color: #e8e8e8;
        }
        .courses {
          .course-item {
            width: 100%;
            margin-bottom: 4px;
            .el-tag {
              width: 100%;
            }
          }
        } 
      }
    }
    thead {
      tr {
        th{
          text-align: left;
        }
      }
    }
    .header-button-right {
      button {
        width: 80px;
      }
      .calendar-control-button {
        button {
          width: 60px;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>
