<template>
  <div class="activity-bar">
    <div class="activity-item active">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        />
      </svg>
    </div>
    <div class="activity-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-git-branch-icon lucide-git-branch"
      >
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    </div>
    <div class="activity-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-bug-play-icon lucide-bug-play"
      >
        <path d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" />
        <path
          d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z"
        />
        <path d="M14.12 3.88 16 2" />
        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
        <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
        <path d="M6 13H2" />
        <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
        <path d="m8 2 1.88 1.88" />
        <path d="M9 7.13v-1a3 3 0 0 1 4.18-2.895 3 3 0 0 1 1.821 2.896v1" />
      </svg>
    </div>
    <div class="activity-item">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-blocks-icon lucide-blocks"
      >
        <path
          d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"
        />
        <rect x="14" y="2" width="8" height="8" rx="1" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.activity-bar {
  width: 32px;
  background: #0f172a;
  border-right: 1px solid #374151;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 4px;
}

.activity-item {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}

.activity-item:hover {
  color: #e5e7eb;
  background: #374151;
}

.activity-item.active {
  color: #ffffff;
}

.activity-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: #60a5fa;
  border-radius: 1px;
}
</style>
