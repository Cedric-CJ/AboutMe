<template>
  <div class="altcha-container">
    <altcha-widget
      ref="altchaWidget"
      :challengeurl="challengeUrl"
      :hidefooter="hideFooter"
      :hidelogo="hideLogo"
      :style="{ '--altcha-color-text': textColor }"
      @statechange="handleStateChange"
      @verified="handleVerified"
      @error="handleError"
    ></altcha-widget>
    <div v-if="error" class="altcha-error">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineExpose } from 'vue';
import 'altcha';

const props = defineProps({
  apiUrl: {
    type: String,
    default: '/api/challenge'
  },
  hideFooter: {
    type: Boolean,
    default: true
  },
  hideLogo: {
    type: Boolean,
    default: false
  },
  textColor: {
    type: String,
    default: '#ffffff'
  }
});

const emit = defineEmits(['verified', 'error', 'statechange']);

const altchaWidget = ref(null);
const payload = ref(null);
const verified = ref(false);
const error = ref(null);
const challengeUrl = ref(props.apiUrl);

/**
 * Handle state changes from ALTCHA widget
 */
function handleStateChange(event) {
  const state = event.detail?.state;
  emit('statechange', state);
  
  if (state === 'error') {
    error.value = 'ALTCHA Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
  } else {
    error.value = null;
  }
}

/**
 * Handle successful verification
 */
function handleVerified(event) {
  payload.value = event.detail?.payload;
  verified.value = true;
  error.value = null;
  emit('verified', payload.value);
}

/**
 * Handle errors
 */
function handleError(event) {
  error.value = event.detail?.error || 'Ein Fehler ist aufgetreten';
  verified.value = false;
  payload.value = null;
  emit('error', error.value);
}

/**
 * Get the current payload (for form submission)
 */
function getPayload() {
  return payload.value;
}

/**
 * Check if verification is complete
 */
function isVerified() {
  return verified.value && payload.value !== null;
}

/**
 * Reset the widget
 */
function reset() {
  if (altchaWidget.value) {
    payload.value = null;
    verified.value = false;
    error.value = null;
    
    // Reset the web component
    try {
      altchaWidget.value.reset();
    } catch (e) {
      console.warn('Could not reset ALTCHA widget:', e);
    }
  }
}

// Expose methods to parent
defineExpose({
  getPayload,
  isVerified,
  reset
});

onMounted(() => {
  // Widget is automatically initialized by the web component
});
</script>

<style scoped>
.altcha-container {
  margin: 16px 0;
}

altcha-widget {
  display: block;
  width: 100%;
  max-width: 100%;
}

.altcha-error {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ef4444;
  font-size: 14px;
}

/* Dark mode styling for ALTCHA */
:deep(altcha-widget) {
  --altcha-color-base: rgba(255, 255, 255, 0.06);
  --altcha-color-border: rgba(255, 255, 255, 0.12);
  --altcha-color-text: #ffffff;
  --altcha-max-width: 100%;
}
</style>
