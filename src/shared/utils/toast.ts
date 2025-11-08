// Simple toast utility without external dependencies
export const toast = {
  success: (message: string) => {
    showToast(message, 'success');
  },
  error: (message: string) => {
    showToast(message, 'error');
  },
  info: (message: string) => {
    showToast(message, 'info');
  },
};

function showToast(message: string, type: 'success' | 'error' | 'info') {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(container);
  }

  // Create toast element
  const toastEl = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  toastEl.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn max-w-sm`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toastEl.innerHTML = `
    <span class="text-xl">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toastEl);

  // Remove after 3 seconds
  setTimeout(() => {
    toastEl.style.opacity = '0';
    toastEl.style.transform = 'translateX(100%)';
    toastEl.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
}
