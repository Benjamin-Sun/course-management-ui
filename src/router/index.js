import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/scheduleManagement',
        name: 'ScheduleManagement',
        component: 'ScheduleManagement.vue'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;