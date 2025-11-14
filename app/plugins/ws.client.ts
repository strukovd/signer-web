import { io } from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();
	const token = localStorage.getItem('token');
	if(!token) return;

	const URL = config.public.wsURL + `?deviceId=12345`;
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
	});

	socket.on("disconnect", () => {
		console.log("🔌 Socket disconnected");
	});

	socket.onAny((eventName, ...args) => {
		console.log(`Event: ${eventName}`);
		console.log(`Arguments:`, args);
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
