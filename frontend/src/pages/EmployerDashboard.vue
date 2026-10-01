<script setup>
import { ref, onMounted, computed } from 'vue';
import LeaveTable from '../components/LeaveTable.vue';
import { Users, Clock, CheckCircle2, XCircle, Search, RefreshCw, X, ShieldAlert } from 'lucide-vue-next';
import api from '../services/api';

const leaves = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('');

const fetchAllLeaves = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get('/leaves/all');
    leaves.value = data;
  } catch (error) {
    console.error('Failed to fetch leaves', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAllLeaves();
});

// Analytics
const totalLeaves = computed(() => leaves.value.length);
const pendingLeaves = computed(() => leaves.value.filter(l => l.status === 'Pending').length);
const approvedLeaves = computed(() => leaves.value.filter(l => l.status === 'Approved').length);
const rejectedLeaves = computed(() => leaves.value.filter(l => l.status === 'Rejected').length);

const filteredLeaves = computed(() => {
  return leaves.value.filter(leave => {
    const matchesSearch = searchQuery.value === '' || 
      (leave.employeeId?.name || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (leave.employeeId?.email || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (leave.reason || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (leave.leaveType || '').toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = statusFilter.value === '' || 
      leave.status.toLowerCase() === statusFilter.value.toLowerCase();

    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Team Leave Requests</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">Review, approve, or reject employee leave applications.</p>
      </div>
      
      <button 
        @click="fetchAllLeaves" 
        class="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Refresh Records</span>
      </button>
    </div>

    <!-- Stats Bento Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Total Requests</span>
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900">{{ totalLeaves }}</span>
          <span class="text-xs text-slate-400">across organization</span>
        </div>
      </div>

      <!-- Pending -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Pending Review</span>
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-amber-600">{{ pendingLeaves }}</span>
          <span class="text-xs text-amber-600/80 font-medium">action required</span>
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
          <span class="text-2xl font-bold text-emerald-600">{{ approvedLeaves }}</span>
          <span class="text-xs text-emerald-600/80 font-medium">scheduled</span>
        </div>
      </div>

      <!-- Rejected -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500">Rejected</span>
          <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-rose-600">{{ rejectedLeaves }}</span>
          <span class="text-xs text-rose-600/80 font-medium">declined</span>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by employee name, email, or category..."
          class="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 placeholder-slate-400 transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start sm:self-auto">
        <button
          @click="statusFilter = ''"
          class="px-3 py-1 rounded-md transition-all cursor-pointer"
          :class="statusFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          All ({{ totalLeaves }})
        </button>
        <button
          @click="statusFilter = 'pending'"
          class="px-3 py-1 rounded-md transition-all cursor-pointer"
          :class="statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          Pending ({{ pendingLeaves }})
        </button>
        <button
          @click="statusFilter = 'approved'"
          class="px-3 py-1 rounded-md transition-all cursor-pointer"
          :class="statusFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          Approved ({{ approvedLeaves }})
        </button>
        <button
          @click="statusFilter = 'rejected'"
          class="px-3 py-1 rounded-md transition-all cursor-pointer"
          :class="statusFilter === 'rejected' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          Rejected ({{ rejectedLeaves }})
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <div>
      <div v-if="isLoading" class="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-slate-200">
        <span class="animate-spin inline-block w-7 h-7 border-2 border-slate-300 border-t-slate-800 rounded-full mb-2"></span>
        <p class="text-xs text-slate-500">Loading leave requests...</p>
      </div>
      <LeaveTable v-else :leaves="filteredLeaves" :isEmployer="true" @action-taken="fetchAllLeaves" />
    </div>
  </div>
</template>
