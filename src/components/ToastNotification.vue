<script setup>
import Subscription from './subscription/subscription.js';
import Error from './icons/Error.vue'
import Success from './icons/Success.vue'
import Warning from './icons/Warning.vue'
</script>

<template>
<div class="toast-notification">
	<div v-for="(notification, index) of notifications" :key="index" :class="{'toast':true, 'error':notification.type==='error','warning':notification.type==='warning','success':notification.type==='success'}">
		<div>
			<Error v-if="notification.type==='error'" />
			<Success v-if="notification.type==='success'" />
			<Warning v-if="notification.type==='warning'" />
		</div>
		<div>
			{{notification.msg}}
		</div>
	</div>
</div>
</template>

<script>
export default {
	data() {
		return {
			notifications: []
		}
	},
	mounted() {
		Subscription.subscribe("notification", (args) => {
			this.notifications.push({msg: args[1], type: args[2]});
			let index = this.notifications.length-1;
			setTimeout(() => this.notifications.splice(index, 1), 10000);
		});
	}
}
</script>

<style scoped>
.toast-notification {
	position: absolute;
	top: 0px;
	right: 0em;
	z-index: 9999;
}
svg {
	width: 2em;
	height: 2em;
}
.toast {
	display: flex;
	flex-direction: row;
	margin-top: 1em;
}
.toast>div:first-child {
	padding:1em;
	display:flex;
	align-content: center;
	justify-items: center;
}
.toast>div:last-child {
	display:flex;
	align-items: center;
	padding: 1em;
	width: 20em;
}
.toast.error>div:first-child {
	background-color: #fad2e1;
}
.toast.error>div:last-child {
	background-color: #fde2e4;
}
.toast.warning>div:first-child {
	background-color: #fbecc1;
}
.toast.warning>div:last-child {
	background-color: #fdf3d9;
}
.toast.success>div:first-child {
	background-color: #bee1e6;
}
.toast.success>div:last-child {
	background-color: #e2ece9;
}
</style>
