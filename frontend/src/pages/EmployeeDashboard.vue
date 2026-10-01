<script setup>
import { ref, onMounted, computed } from 'vue';
import LeaveForm from '../components/LeaveForm.vue';
import LeaveTable from '../components/LeaveTable.vue';
import { Calendar, RefreshCw, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-vue-next';
import api from '../services/api';

const leaves = ref([]);
const isLoading = ref(true);
const statusFilter = ref('');

const fetchLeaves = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/leaves/my-leaves');
    leaves.value = data;
  } catch (error) {
    console.error('Failed to fetch leaves', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLeaves();
});

const filteredLeaves = computed(() => {
  if (!statusFilter.value) return leaves.value;
  return leaves.value.filter(l => l.status.toLowerCase() === statusFilter.value.toLowerCase());
});

const stats = computed(() => {
  const total = leaves.value.length;
  const pending = leaves.value.filter(l => l.status === 'Pending').length;
  const approved = leaves.value.filter(l => l.status === 'Approved').length;
  const rejected = leaves.value.filter(l => l.status === 'Rejected').length;
  return { total, pending, approved, rejected };
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          My Leave & Time Off
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Review your allowance balances, submit new requests, and track approvals.
        </p>
      </div>

      <button
        @click="fetchLeaves"
        class="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
        title="Refresh records"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Leave Balance & Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Requests -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Total Applications</span>
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Calendar class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900">{{ stats.total }}</span>
          <span class="text-xs text-slate-400">submitted</span>
        </div>
      </div>

      <!-- Pending Approval -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Pending Review</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-amber-600">{{ stats.pending }}</span>
          <span class="text-xs text-amber-600/80 font-medium">awaiting manager</span>
        </div>
      </div>

      <!-- Approved -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Approved</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-emerald-600">{{ stats.approved }}</span>
          <span class="text-xs text-emerald-600/80 font-medium">confirmed</span>
        </div>
      </div>

      <!-- Annual Leave Balance -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Paid Leave Balance</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900">14</span>
          <span class="text-xs text-slate-400">days available</span>
        </div>
        <div class="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div class="h-full rounded-full bg-blue-600" style="width: 70%"></div>
        </div>
      </div>
    </div>

    <!-- Main Workspace: Form & History -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left side: Apply Form (4 cols) -->
      <div class="lg:col-span-5">
        <LeaveForm @leave-applied="fetchLeaves" />
      </div>
      
      <!-- Right side: History Table (7 cols) -->
      <div class="lg:col-span-7">
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 class="text-base font-bold text-slate-900 tracking-tight">Application History</h2>
          
          <!-- Segmented Filter Pills -->
          <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              @click="statusFilter = ''"
              class="px-3 py-1 rounded-md transition-all cursor-pointer"
              :class="statusFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              All
            </button>
            <button
              @click="statusFilter = 'pending'"
              class="px-3 py-1 rounded-md transition-all cursor-pointer"
              :class="statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Pending
            </button>
            <button
              @click="statusFilter = 'approved'"
              class="px-3 py-1 rounded-md transition-all cursor-pointer"
              :class="statusFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Approved
            </button>
            <button
              @click="statusFilter = 'rejected'"
              class="px-3 py-1 rounded-md transition-all cursor-pointer"
              :class="statusFilter === 'rejected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            >
              Rejected
            </button>
          </div>
        </div>
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200">
          <span class="animate-spin inline-block w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full mb-2"></span>
          <p class="text-xs text-slate-500">Loading leave records...</p>
        </div>
        <LeaveTable v-else :leaves="filteredLeaves" :isEmployer="false" />
      </div>
    </div>
  </div>
</template>
