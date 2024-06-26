import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/create',
			name: 'create',
			component: () => import('../views/CreateScheduleModal.vue')
		},
		{
			path: '/update/:id',
			name: 'update',
			component: () => import ('../views/UpdateScheduleModal.vue')
		}
	]
})

export default router
