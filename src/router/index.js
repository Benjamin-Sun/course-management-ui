import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/schedule',
        name: 'Schedule',
        component: () => import('@/components/ScheduleManagement.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;