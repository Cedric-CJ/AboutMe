<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="backend-modal-overlay" @click.self="closeModal">
        <div class="backend-modal">
          <div class="modal-header">
            <div class="icon-warning">⚠️</div>
            <h3 class="modal-title">
              {{ lang === 'en' ? 'System Maintenance' : 'System-Wartung' }}
            </h3>
            <button @click="closeModal" class="close-btn" :aria-label="lang === 'en' ? 'Close' : 'Schließen'">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="info-box">
              <p class="main-message">
                {{ lang === 'en' 
                  ? 'My contact form backend is currently being updated to provide you with an even better experience.' 
                  : 'Mein Kontaktformular-Backend wird gerade aktualisiert, um dir ein noch besseres Erlebnis zu bieten.' 
                }}
              </p>
              
              <div class="divider"></div>
              
              <p class="suggestion">
                {{ lang === 'en' 
                  ? 'In the meantime, you can contact me directly via email. I have already pre-filled all your entered information for you.' 
                  : 'In der Zwischenzeit kannst du mich direkt per E-Mail kontaktieren. Ich habe alle deine eingegebenen Informationen bereits für dich vorausgefüllt.' 
                }}
              </p>
            </div>

            <div class="data-preview" v-if="hasData">
              <div class="preview-header">
                {{ lang === 'en' ? 'Your Information:' : 'Deine Angaben:' }}
              </div>
              <div class="preview-grid">
                <div v-if="formData.name" class="preview-item">
                  <span class="preview-label">{{ lang === 'en' ? 'Name:' : 'Name:' }}</span>
                  <span class="preview-value">{{ formData.name }}</span>
                </div>
                <div v-if="formData.email" class="preview-item">
                  <span class="preview-label">{{ lang === 'en' ? 'Email:' : 'E-Mail:' }}</span>
                  <span class="preview-value">{{ formData.email }}</span>
                </div>
                <div v-if="formData.phone" class="preview-item">
                  <span class="preview-label">{{ lang === 'en' ? 'Phone:' : 'Telefon:' }}</span>
                  <span class="preview-value">{{ formData.phone }}</span>
                </div>
                <div v-if="formData.subject" class="preview-item">
                  <span class="preview-label">{{ lang === 'en' ? 'Subject:' : 'Betreff:' }}</span>
                  <span class="preview-value">{{ formData.subject }}</span>
                </div>
                <div v-if="formData.service" class="preview-item full-width">
                  <span class="preview-label">{{ lang === 'en' ? 'Service:' : 'Dienstleistung:' }}</span>
                  <span class="preview-value">{{ formData.service }}</span>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button @click="openEmailClient" class="email-btn">
                <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {{ lang === 'en' ? 'Open Email Client' : 'E-Mail-Programm öffnen' }}
              </button>
              
              <button @click="closeModal" class="cancel-btn">
                {{ lang === 'en' ? 'Cancel' : 'Abbrechen' }}
              </button>
            </div>

            <div class="footer-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span>
                {{ lang === 'en' 
                  ? 'I typically respond within 24 hours (business days)' 
                  : 'Ich antworte in der Regel innerhalb von 24 Stunden (an Werktagen)' 
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      service: ''
    })
  },
  lang: {
    type: String,
    default: 'de'
  },
  companyEmail: {
    type: String,
    default: 'info@specialcode.de'
  }
})

const emit = defineEmits(['close', 'email-opened'])

const hasData = computed(() => {
  return props.formData.name || 
         props.formData.email || 
         props.formData.phone || 
         props.formData.subject || 
         props.formData.service
})

/**
 * Generate mailto link with pre-filled data
 */
function generateMailtoLink() {
  const { name, email, phone, subject, message, service } = props.formData
  
  // Build email body
  let body = ''
  
  if (props.lang === 'en') {
    body += 'Hello,\n\n'
    if (service) {
      body += `I am interested in: ${service}\n\n`
    }
    body += message || 'I would like to get in touch with you.\n\n'
    body += '\n---\nContact Information:\n'
    if (name) body += `Name: ${name}\n`
    if (email) body += `Email: ${email}\n`
    if (phone) body += `Phone: ${phone}\n`
  } else {
    body += 'Hallo,\n\n'
    if (service) {
      body += `Ich interessiere mich für: ${service}\n\n`
    }
    body += message || 'Ich möchte gerne mit Ihnen in Kontakt treten.\n\n'
    body += '\n---\nKontaktinformationen:\n'
    if (name) body += `Name: ${name}\n`
    if (email) body += `E-Mail: ${email}\n`
    if (phone) body += `Telefon: ${phone}\n`
  }
  
  // Build subject line
  let emailSubject = subject || (props.lang === 'en' ? 'Inquiry' : 'Anfrage')
  if (service && !subject) {
    emailSubject = props.lang === 'en' 
      ? `Inquiry: ${service}` 
      : `Anfrage: ${service}`
  }
  
  // Encode for URL
  const encodedSubject = encodeURIComponent(emailSubject)
  const encodedBody = encodeURIComponent(body)
  
  return `mailto:${props.companyEmail}?subject=${encodedSubject}&body=${encodedBody}`
}

/**
 * Open email client with pre-filled data
 */
function openEmailClient() {
  const mailtoLink = generateMailtoLink()
  window.location.href = mailtoLink
  
  // Emit event so parent component knows email was opened
  emit('email-opened')
  
  // Close modal after short delay
  setTimeout(() => {
    closeModal()
  }, 500)
}

/**
 * Close modal
 */
function closeModal() {
  emit('close')
}

// Prevent body scroll when modal is open
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Overlay */
.backend-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* Modal */
.backend-modal {
  background: linear-gradient(135deg, rgba(30, 30, 40, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.modal-header {
  position: relative;
  padding: 24px 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

.icon-warning {
  font-size: 48px;
  margin-bottom: 12px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.modal-title {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.6);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  padding: 24px;
}

.info-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.main-message {
  color: #fff;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  margin: 16px 0;
}

.suggestion {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Data Preview */
.data-preview {
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.preview-header {
  color: #a5b4fc;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-item.full-width {
  grid-column: 1 / -1;
}

.preview-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 500;
}

.preview-value {
  color: #fff;
  font-size: 14px;
  word-break: break-word;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.email-btn,
.cancel-btn {
  flex: 1;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.email-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.email-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.email-btn:active {
  transform: translateY(0);
}

.btn-icon {
  flex-shrink: 0;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}

/* Footer Note */
.footer-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 8px;
  color: #93c5fd;
  font-size: 13px;
  line-height: 1.4;
}

.footer-note svg {
  flex-shrink: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .backend-modal {
    max-height: 95vh;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 20px 20px 16px;
  }
  
  .icon-warning {
    font-size: 40px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .email-btn,
  .cancel-btn {
    width: 100%;
  }
  
  .preview-grid {
    grid-template-columns: 1fr;
  }
}

/* Custom scrollbar for modal */
.backend-modal::-webkit-scrollbar {
  width: 8px;
}

.backend-modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.backend-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.backend-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
