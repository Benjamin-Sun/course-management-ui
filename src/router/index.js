import { createRouter, createWebHistory } from "vue-router";
import Schedule from "@/pages/ScheduleManagement.vue";
import StudentManagement from "@/pages/StudentManagement.vue";

const routes = [
  {
    path: "/",
    name: "Schedule",
    component: Schedule,
  },
  {
    path: "/student-management",
    name: "StudentManagement",
    component: StudentManagement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
