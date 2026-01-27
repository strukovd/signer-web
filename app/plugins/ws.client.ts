import { io } from "socket.io-client";
import type { SocketPagePayload } from "~/types";


export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const token = localStorage.getItem('token');
	if(!token) return;

	let deviceId = localStorage.getItem('deviceId');
	if(!deviceId) {
		const randomId = Math.random().toString(36).substring(2, 9);
		localStorage.setItem('deviceId', randomId);
		deviceId = randomId;
	}

	const URL = config.public.wsURL + `?deviceId=${deviceId}`;
	const socket = io(URL, {
		// transports: ["polling", "websocket"],
		// autoConnect: true,
		// query: { deviceId: '12345' },
		auth: {
			'auth-token': token,
			'api-token': config.public.apiToken
		}
	});


	socket.on("connect", () => {
		console.log("✅ Socket connected:", socket.id);
		useAppStore().online = true;
	});

	socket.on("disconnect", () => {
		console.log("🔌 Socket disconnected");
		useAppStore().online = false;
	});

	socket.on("page", (data: SocketPagePayload) => {
		// console.log(`Event: page`);
		// console.log(data);
		const appStore = useAppStore();
		appStore.login = data.login;
		appStore.currentUser = data.jiraUser;
		appStore.pages = data.pages;
	});

	socket.onAny((eventName, ...args) => {
		// console.log(`Event: ${eventName}`);
		// console.log(`Arguments:`, args);
		let message = eventName;
		if( ['disconnected'].includes(eventName) ) message = `🔴 ${eventName}`;
		useAppStore().signals.push(message);
		setTimeout(() => {
			useAppStore().signals.shift();
		}, 5000);
	});


	socket.on("connect_error", (err) => {
		console.error("⚠️ socket connect_error", err.message);
	});

	socket.io.on("reconnect_attempt", (attempt) => {
		console.log("🔁 reconnect attempt", attempt);
	});

	// делаем доступным как $socket
	nuxtApp.provide("socket", socket);
});
