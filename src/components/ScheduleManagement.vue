<template>
    <div class="course-schedule">
        <!-- 主日历区域 -->
        <el-calendar>
            <template #date-cell="{ data }">
                <div class="calendar-day">
                    <div class="day-number">{{ data.day.split('-').slice(2).join('-') }}</div>
                    <div v-for="(course, index) in getDailyCourses(data.day)" :key="index" class="course-item">
                        <el-tag type="info">
                            {{ formatTime(course.courseTime) }}
                            ￥{{ course.courseFee }}
                        </el-tag>
                        <div v-if="course.courseNote" class="course-note">
                            {{ course.courseNote }}
                        </div>
                    </div>
                    <el-button v-if="!getDailyCourses(data.day).length" size="small" @click="openDialog(data.day)">
                        添加课程
                    </el-button>
                </div>
            </template>
        </el-calendar>

        <!-- 排课对话框 -->
        <el-dialog v-model="dialogVisible" title="自动排课" width="500px">
            <el-form :model="form" label-width="100px">
                <el-form-item label="学生姓名" required>
                    <el-input v-model="form.studentName" />
                </el-form-item>

                <el-form-item label="开始时间" required>
                    <el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss"
                        placeholder="选择开始时间" />
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
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitSchedule">生成排课</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import dayjs from 'dayjs'

// 课程数据
const allCourses = ref([])

// 对话框状态
const dialogVisible = ref(false)
const form = reactive({
    studentName: '',
    startTime: null,
    courseFee: 0,
    totalCourses: 1,
    cycleType: 'weekly',
    customDays: 7
})

// 生成课程时间列表
const generateScheduleTimes = () => {
    if (!form.startTime) {
        ElMessage.error('请选择开始时间')
        return []
    }

    const times = []
    let current = dayjs(form.startTime)

    for (let i = 0; i < form.totalCourses; i++) {
        times.push(current.format('YYYY-MM-DDTHH:mm:ss'))

        switch (form.cycleType) {
            case 'daily':
                current = current.add(1, 'day')
                break
            case 'weekly':
                current = current.add(1, 'week')
                break
            case 'monthly':
                current = current.add(1, 'month')
                break
            case 'custom':
                current = current.add(form.customDays, 'day')
                break
        }
    }

    return times
}

// 提交排课
const submitSchedule = async () => {
    try {
        const scheduleTimeList = generateScheduleTimes()
        if (!scheduleTimeList.length) return

        const courseList = Array(form.totalCourses).fill().map(() => ({
            courseFee: form.courseFee,
            courseNote: '', // 可根据需要添加备注输入
            courseStatus: 0
        }))

        await axios.post('/api/courseManage/schedule/addSchedule', {
            studentName: form.studentName,
            scheduleTimeList,
            courseList
        })

        ElMessage.success('排课成功')
        dialogVisible.value = false
        loadCourses() // 需要实现课程加载方法
    } catch (error) {
        ElMessage.error('排课失败')
        console.error(error)
    }
}

const loadCourses = async () => {
    try {
        const { data } = await axios.get('/api/courseManage/course/getAllCourse')
        allCourses.value = data.map(c => ({
            ...c,
            courseTime: dayjs(c.courseTime).format('YYYY-MM-DDTHH:mm:ss')
        }))
    } catch (error) {
        ElMessage.error('加载课程失败')
    }
}

// 时间格式化
const formatTime = (timeStr) => {
    return dayjs(timeStr).format('HH:mm')
}

// 获取当天的课程
const getDailyCourses = (date) => {
    return allCourses.value.filter(course =>
        dayjs(course.courseTime).isSame(date, 'day'))
}

// 打开排课对话框
const openDialog = (date) => {
    form.startTime = dayjs(date).format('YYYY-MM-DDTHH:mm:ss')
    dialogVisible.value = true
}
</script>

<style scoped>
.calendar-day {
    height: 120px;
    padding: 5px;
    overflow-y: auto;
}

.day-number {
    font-weight: bold;
    margin-bottom: 5px;
}

.course-item {
    margin: 3px 0;
    font-size: 12px;
}

.course-note {
    color: #666;
    padding-left: 8px;
}
</style>