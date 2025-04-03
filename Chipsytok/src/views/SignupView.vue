<template>
    <div
        class="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden">
        <div class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10">
            <h1 class="text-3xl font-extrabold mb-6 text-gray-800">Chipstok</h1>
            <form @submit.prevent="signup" class="space-y-4">
                <div>
                    <input v-model="username" type="text" name="Username" autocomplete="username" placeholder="Username"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p v-if="errors.username" class="text-red-500 text-sm">
                        {{ errors.username }}
                    </p>
                </div>
                <div>
                    <input v-model="email" type="email" name="Email" autocomplete="email" placeholder="Email"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p v-if="errors.email" class="text-red-500 text-sm">
                        {{ errors.email }}
                    </p>
                </div>
                <div>
                    <input v-model="password" type="password" name="Password" autocomplete="new-password"
                        placeholder="Password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p v-if="errors.password" class="text-red-500 text-sm">
                        {{ errors.password }}
                    </p>
                </div>
                <div>
                    <input v-model="testpassword" type="password" name="ConfirmPassword" autocomplete="new-password"
                        placeholder="Confirm Password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <p v-if="errors.password && password !== testpassword" class="text-red-500 text-sm">
                        {{ errors.password }}
                    </p>
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 hover:bg-blue-600">
                    <div v-if="!loading">Sign Up</div>
                    <div v-else class="flex justify-center items-center">
                        <Loader2 class="animate-spin w-4 h-4" />
                    </div>
                </button>
            </form>
            <div class="mt-6 border-t pt-4 text-sm text-gray-700">
                Already have an account?
                <a href="/login" class="text-blue-500 font-bold">Sign up</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFetch } from '@/helpers/fetch';
import { Loader2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const testpassword = ref('');
const loading = ref(false);
const errors = ref({ username: '', email: '', password: '' });
const router = useRouter();

const signup = async () => {
    errors.value = { username: '', email: '', password: '' };

    if (!username.value) errors.value.username = 'Username is required';
    if (!email.value) errors.value.email = 'Email is required';
    if (!password.value) errors.value.password = 'Password is required';
    if (password.value && password.value !== testpassword.value) {
        errors.value.password = 'Passwords do not match';
    }

    if (
        username.value &&
        email.value &&
        password.value &&
        password.value === testpassword.value
    ) {
        loading.value = true;
        try {
            const { res } = await useFetch('/users/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value,
                }),
                credentials: 'include',
            });

            if (res.ok) {
                router.push('/');
            } else {
                const data = await res.json();
                errors.value.username = data.message || 'Registration failed';
            }
        } catch {
            errors.value.username = 'An error occurred. Please try again.';
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
button:disabled {
    cursor: not-allowed;
}
</style>