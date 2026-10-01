<script setup>
import { computed } from 'vue';
import { Check, X, Calendar, Clock, Inbox, CheckCircle2, XCircle } from 'lucide-vue-next';
import api from '../services/api';

const props = defineProps({
  leaves: {
    type: Array,
    required: true,
  },
  isEmployer: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['action-taken']);

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

const calculateDays = (start, end) => {
  if (!start || !end) return 1;
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e - s);
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
};

const handleAction = async (id, action) => {
  const label = action === 'approve' ? 'approve' : 'reject';
  if (!confirm(`Are you sure you want to ${label} this leave request?`)) return;
  
  try {
    await api.patch(`/leaves/${id}/${action}`);
    emit('action-taken');
  } catch (error) {
    alert('Action failed. Please try again.');
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Approved':
      return {
        class: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500',
      };
    case 'Rejected':
      return {
        class: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dot: 'bg-rose-500',
      };
    default:
      return {
        class: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500 animate-pulse',
      };
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs whitespace-nowrap">
        <thead class="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
          <tr>
            <th v-if="isEmployer" class="px-5 py-3.5">Employee</th>
            <th class="px-5 py-3.5">Category</th>
            <th class="px-5 py-3.5">Timeline & Duration</th>
            <th class="px-5 py-3.5 max-w-xs">Reason</th>
            <th class="px-5 py-3.5">Status</th>
            <th v-if="isEmployer" class="px-5 py-3.5 text-right">Review Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="leaves.length === 0">
            <td :colspan="isEmployer ? 6 : 5" class="px-6 py-16 text-center text-slate-500">
              <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Inbox class="w-5 h-5" />
              </div>
              <p class="font-medium text-slate-700 text-sm">No leave records located</p>
              <p class="text-xs text-slate-400 mt-0.5">Records will be listed here once submitted.</p>
            </td>
          </tr>
          <tr v-for="leave in leaves" :key="leave._id" class="hover:bg-slate-50/60 transition-colors">
            <!-- Employee (Employer View) -->
            <td v-if="isEmployer" class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs">
                  {{ (leave.employeeId?.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-semibold text-slate-900">{{ leave.employeeId?.name || 'Unknown Employee' }}</div>
                  <div class="text-[11px] text-slate-400">{{ leave.employeeId?.email }}</div>
                </div>
              </div>
            </td>
            
            <!-- Leave Type -->
            <td class="px-5 py-4">
              <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {{ leave.leaveType }}
              </span>
            </td>
            
            <!-- Duration -->
            <td class="px-5 py-4 text-slate-600">
              <div class="flex items-center gap-2">
                <span class="font-medium text-slate-900">{{ formatDate(leave.startDate) }} – {{ formatDate(leave.endDate) }}</span>
                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                  {{ calculateDays(leave.startDate, leave.endDate) }}d
                </span>
              </div>
            </td>
            
            <!-- Reason -->
            <td class="px-5 py-4">
              <div class="truncate max-w-[220px] text-slate-600 font-normal" :title="leave.reason">
                {{ leave.reason }}
              </div>
            </td>
            
            <!-- Status Badge -->
            <td class="px-5 py-4">
              <span 
                class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border"
                :class="getStatusBadge(leave.status).class"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusBadge(leave.status).dot"></span>
                <span>{{ leave.status }}</span>
              </span>
            </td>
            
            <!-- Action (Employer View) -->
            <td v-if="isEmployer" class="px-5 py-4 text-right">
              <div v-if="leave.status === 'Pending'" class="flex items-center justify-end gap-1.5">
                <button 
                  @click="handleAction(leave._id, 'approve')"
                  class="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-md transition-colors font-medium text-xs cursor-pointer"
                  title="Approve leave request"
                >
                  <Check class="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button 
                  @click="handleAction(leave._id, 'reject')"
                  class="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-md transition-colors font-medium text-xs cursor-pointer"
                  title="Reject leave request"
                >
                  <X class="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
              <span v-else class="text-slate-400 text-xs italic">
                Processed
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
