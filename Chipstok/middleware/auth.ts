import { useNuxtApp } from '#app';
import { Cache } from '~/cache/cache';

export default defineNuxtRouteMiddleware(async () => {
    const nuxtApp = useNuxtApp();
    const router = nuxtApp.$router;

    const res = await fetch('http://localhost:8080/auth/auto', { credentials: 'include' });

    const data = await res.json();

    if (res.status !== 200) {
        console.error('Error fetching authentication data:', data);
        await router.push("/login");
        return;
    }

    Cache.set("username", data.username);
});
