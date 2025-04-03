<template>
  <div
    class="flex justify-center items-center h-full bg-gradient-to-b from-indigo-300 via-blue-400 to-[#0080D1] relative overflow-hidden">
    <div class="w-96 p-8 bg-white border border-gray-300 rounded-xl shadow-lg text-center relative z-10">
      <h1 class="text-3xl font-extrabold mb-6 text-gray-800">Chipstok</h1>
      <form @submit.prevent="signup" class="space-y-4">
        <div>
          <input v-model="firstname" type="text" placeholder="First Name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <input v-model="lastname" type="text" placeholder="Last Name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div class="flex gap-2">
          <div class="relative w-1/4">
            <select v-model="selectedCountryCode"
              class="w-full h-[49.33px] px-2 py-3 text-sm border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-transparent">
              <option v-for="country in countries" :key="country.code" :value="country.code"
                style="color: #1a202c; background: white;">
                {{ country.name }} ({{ country.code }})
              </option>
            </select>

            <span class="absolute left-[1.25rem] top-3.5 pointer-events-none text-gray-700 text-sm">
              {{ selectedCountryCode }}
            </span>
          </div>


          <input v-model="phone" type="tel" placeholder="Phone Number"
            class="w-3/4 px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
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
          <input v-model="password" type="password" name="Password" autocomplete="new-password" placeholder="Password"
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
        <a href="/login" class="text-blue-500 font-bold">login</a>
      </div>
    </div>

    <!-- Verification Modal -->
    <div v-if="showVerification" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
        <h2 class="text-lg font-semibold mb-4">
          Enter 5-digit verification code
        </h2>
        <input v-model="verificationCode" maxlength="5"
          class="w-full text-center text-lg tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="_ _ _ _ _" />
        <p v-if="verificationFailed" class="text-red-500 text-sm mt-2">
          Verification failed
        </p>
        <button class="mt-4 w-full py-2 rounded-lg font-bold text-white transition-all" :class="verificationCode.length === 5
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-gray-400 cursor-not-allowed'
          " :disabled="verificationCode.length !== 5" @click="verifyCode">
          Verify
        </button>
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
  { name: 'Antigua and Barbuda', code: '+1-268' },
  { name: 'Argentina', code: '+54' },
  { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' },
  { name: 'Azerbaijan', code: '+994' },
  { name: 'Bahamas', code: '+1-242' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Barbados', code: '+1-246' },
  { name: 'Belarus', code: '+375' },
  { name: 'Belgium', code: '+32' },
  { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' },
  { name: 'Bhutan', code: '+975' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Bosnia and Herzegovina', code: '+387' },
  { name: 'Botswana', code: '+267' },
  { name: 'Brazil', code: '+55' },
  { name: 'Brunei', code: '+673' },
  { name: 'Bulgaria', code: '+359' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cabo Verde', code: '+238' },
  { name: 'Cambodia', code: '+855' },
  { name: 'Cameroon', code: '+237' },
  { name: 'Canada', code: '+1' },
  { name: 'Central African Republic', code: '+236' },
  { name: 'Chad', code: '+235' },
  { name: 'Chile', code: '+56' },
  { name: 'China', code: '+86' },
  { name: 'Colombia', code: '+57' },
  { name: 'Comoros', code: '+269' },
  { name: 'Congo (Congo-Brazzaville)', code: '+242' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Croatia', code: '+385' },
  { name: 'Cuba', code: '+53' },
  { name: 'Cyprus', code: '+357' },
  { name: 'Czech Republic', code: '+420' },
  { name: 'Denmark', code: '+45' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1-767' },
  { name: 'Dominican Republic', code: '+1-809' },
  { name: 'Ecuador', code: '+593' },
  { name: 'Egypt', code: '+20' },
  { name: 'El Salvador', code: '+503' },
  { name: 'Equatorial Guinea', code: '+240' },
  { name: 'Eritrea', code: '+291' },
  { name: 'Estonia', code: '+372' },
  { name: 'Eswatini', code: '+268' },
  { name: 'Ethiopia', code: '+251' },
  { name: 'Fiji', code: '+679' },
  { name: 'Finland', code: '+358' },
  { name: 'France', code: '+33' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Georgia', code: '+995' },
  { name: 'Germany', code: '+49' },
  { name: 'Ghana', code: '+233' },
  { name: 'Greece', code: '+30' },
  { name: 'Grenada', code: '+1-473' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Guyana', code: '+592' },
  { name: 'Haiti', code: '+509' },
  { name: 'Honduras', code: '+504' },
  { name: 'Hungary', code: '+36' },
  { name: 'Iceland', code: '+354' },
  { name: 'India', code: '+91' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Iran', code: '+98' },
  { name: 'Iraq', code: '+964' },
  { name: 'Ireland', code: '+353' },
  { name: 'Israel', code: '+972' },
  { name: 'Italy', code: '+39' },
  { name: 'Jamaica', code: '+1-876' },
  { name: 'Japan', code: '+81' },
  { name: 'Jordan', code: '+962' },
  { name: 'Kazakhstan', code: '+7' },
  { name: 'Kenya', code: '+254' },
  { name: 'Kiribati', code: '+686' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Kyrgyzstan', code: '+996' },
  { name: 'Laos', code: '+856' },
  { name: 'Latvia', code: '+371' },
  { name: 'Lebanon', code: '+961' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libya', code: '+218' },
  { name: 'Liechtenstein', code: '+423' },
  { name: 'Lithuania', code: '+370' },
  { name: 'Luxembourg', code: '+352' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Maldives', code: '+960' },
  { name: 'Mali', code: '+223' },
  { name: 'Malta', code: '+356' },
  { name: 'Marshall Islands', code: '+692' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Mexico', code: '+52' },
  { name: 'Micronesia', code: '+691' },
  { name: 'Moldova', code: '+373' },
  { name: 'Monaco', code: '+377' },
  { name: 'Mongolia', code: '+976' },
  { name: 'Montenegro', code: '+382' },
  { name: 'Morocco', code: '+212' },
  { name: 'Mozambique', code: '+258' },
  { name: 'Myanmar (Burma)', code: '+95' },
  { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' },
  { name: 'Nepal', code: '+977' },
  { name: 'Netherlands', code: '+31' },
  { name: 'New Zealand', code: '+64' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'North Korea', code: '+850' },
  { name: 'North Macedonia', code: '+389' },
  { name: 'Norway', code: '+47' },
  { name: 'Oman', code: '+968' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' },
  { name: 'Palestine', code: '+970' },
  { name: 'Panama', code: '+507' },
  { name: 'Papua New Guinea', code: '+675' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Peru', code: '+51' },
  { name: 'Philippines', code: '+63' },
  { name: 'Poland', code: '+48' },
  { name: 'Portugal', code: '+351' },
  { name: 'Qatar', code: '+974' },
  { name: 'Romania', code: '+40' },
  { name: 'Russia', code: '+7' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Saint Kitts and Nevis', code: '+1-869' },
  { name: 'Saint Lucia', code: '+1-758' },
  { name: 'Saint Vincent and the Grenadines', code: '+1-784' },
  { name: 'Samoa', code: '+685' },
  { name: 'San Marino', code: '+378' },
  { name: 'Sao Tome and Principe', code: '+239' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Senegal', code: '+221' },
  { name: 'Serbia', code: '+381' },
  { name: 'Seychelles', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Singapore', code: '+65' },
  { name: 'Slovakia', code: '+421' },
  { name: 'Slovenia', code: '+386' },
  { name: 'Solomon Islands', code: '+677' },
  { name: 'Somalia', code: '+252' },
  { name: 'South Africa', code: '+27' },
  { name: 'South Korea', code: '+82' },
  { name: 'South Sudan', code: '+211' },
  { name: 'Spain', code: '+34' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'Sudan', code: '+249' },
  { name: 'Suriname', code: '+597' },
  { name: 'Sweden', code: '+46' },
  { name: 'Switzerland', code: '+41' },
  { name: 'Syria', code: '+963' },
  { name: 'Taiwan', code: '+886' },
  { name: 'Tajikistan', code: '+992' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Thailand', code: '+66' },
  { name: 'Timor-Leste', code: '+670' },
  { name: 'Togo', code: '+228' },
  { name: 'Tonga', code: '+676' },
  { name: 'Trinidad and Tobago', code: '+1-868' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Turkey', code: '+90' },
  { name: 'Turkmenistan', code: '+993' },
  { name: 'Tuvalu', code: '+688' },
  { name: 'Uganda', code: '+256' },
  { name: 'Ukraine', code: '+380' },
  { name: 'United Arab Emirates', code: '+971' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Uzbekistan', code: '+998' },
  { name: 'Vanuatu', code: '+678' },
  { name: 'Vatican City', code: '+379' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Vietnam', code: '+84' },
  { name: 'Yemen', code: '+967' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
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
        generatedCode = Math.floor(10000 + Math.random() * 90000).toString();
        // send generatedCode via SMS to user here via backend
        console.log('Generated code sent via SMS:', generatedCode);
        showVerification.value = true;
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
</script>