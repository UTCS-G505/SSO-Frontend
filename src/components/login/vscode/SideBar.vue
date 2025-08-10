<template>
  <div class="file-sidebar">
    <div class="file-tree">
      <div class="folder">
        <svg
          class="folder-icon"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span class="folder-name">utcs-project</span>
      </div>
      <div class="folder indent">
        <img src="@/assets/folder.svg" alt="icon" />
        <span class="folder-name">src</span>
      </div>
      <div class="folder indent">
        <img src="@/assets/folder.svg" alt="icon" />
        <span class="folder-name">build</span>
      </div>
      <div class="file-item indent">
        <img src="@/assets/cpp.svg" alt="icon" />
        <span class="file-name active">main.cpp</span>
      </div>
      <div class="file-item indent">
        <img src="@/assets/markdown.svg" alt="icon" />
        <span class="file-name">README.md</span>
      </div>
      <div class="file-item indent">
        <img src="@/assets/c.svg" alt="icon" />
        <span class="file-name">utils.h</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-sidebar {
  width: 20%;
  background: #111827;
  border-right: 1px solid #374151;
  display: flex;
  flex-direction: column;
}

.file-tree {
  padding: 4px;
  flex: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.folder,
.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px;
  font-size: 10px;
  color: #e5e7eb;
  cursor: pointer;
  border-radius: 2px;
  user-select: none;
}

.folder:hover,
.file-item:hover {
  background: #374151;
}

.folder-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: #9ca3af;
}

.indent {
  margin-left: 8px;
}

.file-name.active {
  color: #fbbf24;
  font-weight: 500;
}
</style>
