<template>
  <div>
    <div
      class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10"
    >
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">Chipstok</h1>
      <form @submit.prevent="signup" class="space-y-4">
        <div>
          <input
            v-model="firstname"
            type="text"
            placeholder="First Name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <input
            v-model="lastname"
            type="text"
            placeholder="Last Name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div class="flex gap-2">
          <select
            v-model="selectedCountryCode"
            class="w-1/4 px-2 py-3 text-sm border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.code }}
            </option>
          </select>
          <input
            v-model="phone"
            type="tel"
            placeholder="Phone Number"
            class="w-3/4 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <input
            v-model="username"
            type="text"
            name="Username"
            autocomplete="username"
            placeholder="Username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="errors.username" class="text-red-500 text-sm">
            {{ errors.username }}
          </p>
        </div>
        <div>
          <input
            v-model="email"
            type="email"
            name="Email"
            autocomplete="email"
            placeholder="Email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="errors.email" class="text-red-500 text-sm">
            {{ errors.email }}
          </p>
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            name="Password"
            autocomplete="new-password"
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p v-if="errors.password" class="text-red-500 text-sm">
            {{ errors.password }}
          </p>
        </div>
        <div>
          <input
            v-model="testpassword"
            type="password"
            name="ConfirmPassword"
            autocomplete="new-password"
            placeholder="Confirm Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p
            v-if="errors.password && password !== testpassword"
            class="text-red-500 text-sm"
          >
            {{ errors.password }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          <div v-if="!loading">Sign Up</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </form>
      <div class="mt-6 border-t pt-4 text-sm text-gray-700">
        Already have an account?
        <button
          @click="goToLogin"
          class="text-blue-500 font-bold hover:underline disabled:opacity-50"
          :disabled="loading"
        >
          <div v-if="!loading">Log in</div>
          <div v-else class="flex justify-center items-center">
            <Loader2 class="animate-spin w-4 h-4" />
          </div>
        </button>
      </div>
    </div>

    <!-- Verification Modal -->
    <div
      v-if="showVerification"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 class="text-lg font-semibold mb-4">
          Enter 5-digit verification code
        </h2>
        <input
          v-model="verificationCode"
          maxlength="5"
          class="w-full text-center text-lg tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="_ _ _ _ _"
        />
        <p v-if="verificationFailed" class="text-red-500 text-sm mt-2">
          Verification failed
        </p>
        <button
          class="mt-4 w-full py-2 rounded-lg font-bold text-white transition-all"
          :class="
            verificationCode.length === 5
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          "
          :disabled="verificationCode.length !== 5"
          @click="verifyCode"
        >
          Verify
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'login' });

const username = ref('');
const email = ref('');
const password = ref('');
const testpassword = ref('');
const firstname = ref('');
const lastname = ref('');
const phone = ref('');
const selectedCountryCode = ref('+1');
const loading = ref(false);
const errors = ref({ username: '', email: '', password: '' });
const router = useRouter();

const countries = [
  { name: 'Afghanistan', code: '+93' },
  { name: 'Albania', code: '+355' },
  { name: 'Algeria', code: '+213' },
  { name: 'Andorra', code: '+376' },
  { name: 'Angola', code: '+244' },
  { name: 'Argentina', code: '+54' },
  { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' },
  { name: 'Azerbaijan', code: '+994' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Belgium', code: '+32' },
  { name: 'Brazil', code: '+55' },
  { name: 'Canada', code: '+1' },
  { name: 'China', code: '+86' },
  { name: 'Denmark', code: '+45' },
  { name: 'Egypt', code: '+20' },
  { name: 'Finland', code: '+358' },
  { name: 'France', code: '+33' },
  { name: 'Germany', code: '+49' },
  { name: 'India', code: '+91' },
  { name: 'Italy', code: '+39' },
  { name: 'Japan', code: '+81' },
  { name: 'Netherlands', code: '+31' },
  { name: 'Norway', code: '+47' },
  { name: 'South Korea', code: '+82' },
  { name: 'Spain', code: '+34' },
  { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
];

const showVerification = ref(false);
const verificationCode = ref('');
const verificationFailed = ref(false);
let generatedCode = '';

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
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
          firstname: firstname.value,
          lastname: lastname.value,
          phone: `${selectedCountryCode.value}${phone.value}`,
        }),
        credentials: 'include',
      });
      if (res.ok) {
        generatedCode = Math.floor(10000 + Math.random() * 90000).toString();
        // send generatedCode via SMS to user here via backend
        console.log('Generated code sent via SMS:', generatedCode);
        showVerification.value = true;
      } else {
        const data = await res.json();
        errors.value.username = data.message || 'Registration failed';
      }
    } catch (err) {
      errors.value.username = 'An error occurred. Please try again.';
    } finally {
      loading.value = false;
    }
  }
};

const verifyCode = () => {
  if (verificationCode.value === generatedCode) {
    router.push('/login');
  } else {
    verificationFailed.value = true;
    setTimeout(() => {
      verificationFailed.value = false;
      showVerification.value = false;
    }, 3000);
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
}
</style>
