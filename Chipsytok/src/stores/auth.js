import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useFetch } from '@/composables/useFetch';

export const useAuthStore = defineStore('auth', () => {
    const username = ref('');
    const auth = ref(false);
    const user = ref(null);

    // Computed property for checking authentication status
    const isAuthenticated = computed(() => auth.value && user.value !== null);

    async function Authenticate() {
        try {
            const { res, data } = await useFetch('/auth/auto', { credentials: 'include' });

            if (res && res.ok && data) {
                user.value = data.user ?? null;
                username.value = data.username ?? '';
                auth.value = true;
            } else {
                console.error('Authentication failed:', res.status, data);
                auth.value = false;
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            auth.value = false;
        }
    }

    function Logout() {
        user.value = null;
        username.value = '';
        auth.value = false;
    }

    return { auth, user, username, isAuthenticated, Authenticate, Logout };
});
