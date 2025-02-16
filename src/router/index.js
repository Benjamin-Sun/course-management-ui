import { createRouter, createWebHistory } from 'vue-router';
import Schedule from '../components/ScheduleManagement.vue';

const routes = [
    {
        path: '/schedule',
        name: 'Schedule',
        component: Schedule
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;