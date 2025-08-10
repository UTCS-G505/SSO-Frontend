<template>
  <div class="menu-bar">
    <div class="menu-items">
      <span class="menu-item">File</span>
      <span class="menu-item">Edit</span>
      <span class="menu-item">View</span>
      <span class="menu-item">Go</span>
      <span class="menu-item">Run</span>
      <span class="menu-item">Terminal</span>
      <span class="menu-item">Help</span>
    </div>
    <div class="window-controls">
      <div class="window-control minimize"></div>
      <div class="window-control maximize"></div>
      <div class="window-control close"></div>
    </div>
  </div>
</template>

<style scoped>
.menu-bar {
  background: #111827;
  border-bottom: 1px solid #374151;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 9px;
  color: #e5e7eb;
}

.menu-items {
  display: flex;
  gap: 2px;
}

.menu-item {
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
}

.menu-item:hover {
  background: #374151;
}

.window-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.window-control {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.window-control.minimize {
  background: #fbbf24;
}

.window-control.maximize {
  background: #10b981;
}

.window-control.close {
  background: #ef4444;
}
</style>
