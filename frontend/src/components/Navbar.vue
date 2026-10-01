<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { LogOut, CalendarCheck2, Building2 } from 'lucide-vue-next';

const router = useRouter();

// Retrieve user from localStorage with reactive fallback
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const initials = computed(() => {
  if (!user?.name) return 'U';
  return user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const isEmployer = computed(() => user?.role === 'employer');

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Brand Logo -->
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white shadow-xs">
            <CalendarCheck2 class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-base tracking-tight text-slate-900">
                LeaveHQ
              </span>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {{ isEmployer ? 'Manager Portal' : 'Employee Portal' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- User Profile & Action -->
        <div class="flex items-center gap-3" v-if="user">
          <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div class="w-7 h-7 rounded-md bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
              {{ initials }}
            </div>
            <div class="hidden sm:flex flex-col text-left">
              <span class="text-xs font-semibold text-slate-900 leading-none">{{ user.name }}</span>
              <span class="text-[10px] text-slate-500 capitalize mt-0.5">{{ user.role }}</span>
            </div>
          </div>
          
          <button 
            @click="logout" 
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Sign out of account"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
