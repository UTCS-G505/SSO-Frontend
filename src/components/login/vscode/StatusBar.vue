<template>
  <div class="status-bar">
    <div class="status-left">
      <span class="branch-info">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" x2="8.5" y1="4" y2="7.5" />
          <line x1="20" x2="8.5" y1="20" y2="16.5" />
          <line x1="8.5" x2="8.5" y1="7.5" y2="16.5" />
        </svg>
        main
      </span>
      <span class="error-count">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="m12 17 .01 0" />
        </svg>
        0
      </span>
    </div>
    <div class="status-right">
      <span class="language">C++</span>
      <span class="position">Ln 6, Col 24</span>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  background: #0f172a;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  font-size: 9px;
  color: #9ca3af;
  height: 16px;
  flex-shrink: 0;
}

.status-left,
.status-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.branch-info,
.error-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.branch-info {
  color: #10b981;
}

.error-count {
  color: #f59e0b;
}

.language {
  color: #60a5fa;
}

.position {
  color: #e5e7eb;
}
</style>
