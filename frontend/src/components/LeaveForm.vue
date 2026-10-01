<script setup>
import { ref, computed } from 'vue';
import { Send, CheckCircle2, AlertCircle, Calendar, FileText, Check } from 'lucide-vue-next';
import api from '../services/api';

const emit = defineEmits(['leave-applied']);

const leaveType = ref('Paid Leave');
const startDate = ref('');
const endDate = ref('');
const reason = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const leaveTypes = [
  { id: 'Paid Leave', label: 'Paid Leave', desc: 'Annual & vacation time' },
  { id: 'Sick Leave', label: 'Sick Leave', desc: 'Medical & health recovery' },
  { id: 'Casual Leave', label: 'Casual Leave', desc: 'Personal errands & events' },
];

const durationDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0;
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  if (end < start) return 0;
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
});

const applyLeave = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  isLoading.value = true;
  
  if (new Date(startDate.value) > new Date(endDate.value)) {
    errorMsg.value = 'End date cannot be prior to start date.';
    isLoading.value = false;
    return;
  }

  try {
    await api.post('/leaves/apply', {
      leaveType: leaveType.value,
      startDate: startDate.value,
      endDate: endDate.value,
      reason: reason.value,
    });
    
    successMsg.value = 'Leave application submitted successfully.';
    leaveType.value = 'Paid Leave';
    startDate.value = '';
    endDate.value = '';
    reason.value = '';
    
    emit('leave-applied');
    
    setTimeout(() => { successMsg.value = ''; }, 4000);
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Failed to submit request. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
    <div class="mb-6">
      <h2 class="text-base font-bold text-slate-900 tracking-tight">Request Time Off</h2>
      <p class="text-xs text-slate-500 mt-0.5">Submit your leave dates for manager review.</p>
    </div>
    
    <form @submit.prevent="applyLeave" class="space-y-4">
      <!-- Leave Type Selector -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-2">Leave Category</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            v-for="t in leaveTypes"
            :key="t.id"
            type="button"
            @click="leaveType = t.id"
            class="p-3 text-left rounded-xl border transition-all cursor-pointer"
            :class="leaveType === t.id 
              ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900 text-slate-900' 
              : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold">{{ t.label }}</span>
              <div v-if="leaveType === t.id" class="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <Check class="w-2.5 h-2.5" />
              </div>
            </div>
            <p class="text-[10px] text-slate-500 mt-1 leading-tight">{{ t.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Date Range Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
          <div class="relative">
            <input 
              v-model="startDate" 
              type="date" 
              required
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 transition-all bg-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
          <div class="relative">
            <input 
              v-model="endDate" 
              type="date" 
              required
              class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-slate-900 transition-all bg-white"
            />
          </div>
        </div>
      </div>

      <!-- Duration badge -->
      <div v-if="durationDays > 0" class="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
        <span class="text-slate-600 font-medium">Estimated duration:</span>
        <span class="font-bold text-slate-900">{{ durationDays }} {{ durationDays === 1 ? 'day' : 'days' }}</span>
      </div>

      <!-- Reason -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Reason for Leave</label>
        <textarea 
          v-model="reason" 
          rows="3" 
          required
          class="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none resize-none text-slate-900 placeholder-slate-400 transition-all"
          placeholder="Provide brief context for your manager..."
        ></textarea>
      </div>

      <!-- Feedback notifications -->
      <div v-if="errorMsg" class="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-lg text-xs">
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>

      <div v-if="successMsg" class="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-lg text-xs">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{{ successMsg }}</span>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-xs disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        <span v-if="isLoading" class="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"></span>
        <Send v-else class="w-3.5 h-3.5" />
        <span>{{ isLoading ? 'Submitting request...' : 'Submit Leave Request' }}</span>
      </button>
    </form>
  </div>
</template>
