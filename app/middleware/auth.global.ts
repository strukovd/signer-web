export default defineNuxtRouteMiddleware((to, from) => {
	// На сервере пропускаем (нет localStorage). Проверять будем на клиенте.
	if (import.meta.server) return;

	const user = useUserStore();
	const NEEDS_AUTH = Boolean(to.meta.auth);

	// Если авторизация требуется
	if(NEEDS_AUTH) {
		if(!user.token) { // Если нет токена
			return navigateTo({
				path: '/login',
			}, { replace: true })
		}
	}

	// Если уже авторизован и пришёл на /login — перекинуть на главную
	if (to.path === '/login' && user.token) {
		return navigateTo(`/`, { replace: true });
	}
})

