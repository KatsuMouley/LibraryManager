// src/utils/events.ts
// Este é um emissor de eventos simples que notifica os listeners.
const AUTH_EVENT_KEY = 'auth_status_change';

export const dispatchAuthEvent = () => {
  // Dispara um evento personalizado no objeto `window`
  window.dispatchEvent(new Event(AUTH_EVENT_KEY));
};

export const listenToAuthEvent = (callback: () => void) => {
  window.addEventListener(AUTH_EVENT_KEY, callback);
};

export const removeAuthListener = (callback: () => void) => {
  window.removeEventListener(AUTH_EVENT_KEY, callback);
};