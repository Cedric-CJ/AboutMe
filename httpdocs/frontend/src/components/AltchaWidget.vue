<template>
  <div class="altcha-container">
    <altcha-widget
      ref="altchaWidget"
      :challengeurl="challengeUrl"
      :hidefooter="hideFooter"
      :hidelogo="hideLogo"
      :style="{ '--altcha-color-text': textColor }"
      :lang="lang"
      :strings="widgetStrings"
      @statechange="handleStateChange"
      @verified="handleVerified"
      @error="handleError"
    ></altcha-widget>
    <div v-if="error" class="altcha-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import 'altcha';

const props = defineProps({
  apiUrl: {
    type: String,
    default: '/api/challenge.php'
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
  },
  lang: {
    type: String,
    default: 'en'
  }
});

const emit = defineEmits(['verified', 'error', 'statechange']);

const altchaWidget = ref(null);
const payload = ref(null);
const verified = ref(false);
const error = ref(null);
const challengeUrl = ref(props.apiUrl);

const i18n = computed(() => {
  if (props.lang === 'de') {
    return {
      verificationFailed: 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      verificationFailedLater: 'Verifizierung fehlgeschlagen. Bitte versuchen Sie es spaeter erneut.',
      verificationExpired: 'Verifizierung abgelaufen. Bitte erneut versuchen.',
      verifying: 'Überprüfung läuft ...',
      verifyingWait: 'Überprüfung läuft ... bitte warten.',
      genericError: 'Ein Fehler ist aufgetreten.'
    };
  }
  return {
    verificationFailed: 'Verification failed. Please try again.',
    verificationFailedLater: 'Verification failed. Please try again later.',
    verificationExpired: 'Verification expired. Please try again.',
    verifying: 'Verifying...',
    verifyingWait: 'Verifying... please wait.',
    genericError: 'An error occurred.'
  };
});

const widgetStrings = computed(() => {
  if (props.lang === 'de') {
    const aria = 'ALTCHA Webseite (oeffnet sich in neuem Fenster)';
    return JSON.stringify({
      ariaLinkLabel: aria,
      error: 'Verifizierung fehlgeschlagen. Bitte erneut versuchen.',
      expired: 'Verifizierung abgelaufen. Bitte erneut versuchen.',
      footer: `Geschuetzt von <a href="https://altcha.org" target="_blank" aria-label="${aria}">ALTCHA</a>`,
      label: 'Ich bin kein Roboter',
      verified: 'Verifiziert',
      verifying: 'Überprüfung läuft ...',
      waitAlert: 'Überprüfung läuft ... bitte warten.'
    });
  }
  return undefined;
});

/**
 * Handle state changes from ALTCHA widget
 */
function handleStateChange(event) {
  const state = event.detail?.state;
  emit('statechange', state);

  if (state === 'error') {
    error.value = i18n.value.verificationFailed;
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
  const msg = event.detail?.error;
  if (msg && typeof msg === 'string') {
    error.value = /verification failed|failed to fetch/i.test(msg)
      ? i18n.value.verificationFailed
      : msg;
  } else {
    error.value = i18n.value.genericError;
  }
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

/* Hide built-in ALTCHA status/error messages; we show our own localized message */
:deep(altcha-widget [role="alert"]) { display: none !important; }
:deep(altcha-widget .altcha-error) { display: none !important; }
:deep(altcha-widget .altcha-status) { display: none !important; }
:deep(altcha-widget .altcha-message) { display: none !important; }
</style>
