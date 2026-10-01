<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CalendarCheck2, ArrowRight } from 'lucide-vue-next';
import api from '../services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });
    
    // Save to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === 'employer') {
      router.push('/employer');
    } else {
      router.push('/employee');
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Invalid credentials. Please verify your email and password.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 saas-grid">
    <div class="max-w-md w-full">
      <!-- Brand Header -->
      <div class="text-center mb-8">
        <div class="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
          <CalendarCheck2 class="w-5 h-5" />
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900">Sign in to LeaveHQ</h1>
        <p class="text-xs text-slate-500 mt-1">Manage and track your organization's time off</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all"
              placeholder="name@company.com"
            />
          </div>
          
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-xs text-slate-900 placeholder-slate-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div v-if="errorMsg" class="p-3 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-lg text-xs">
            {{ errorMsg }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-xs flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs"
          >
            <span v-if="isLoading" class="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"></span>
            <span v-else class="flex items-center gap-1.5">
              <span>Sign in</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </span>
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-100 text-center">
          <p class="text-xs text-slate-500">
            Don't have an account? 
            <router-link to="/register" class="text-slate-900 hover:underline font-semibold ml-1">
              Create an account
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
