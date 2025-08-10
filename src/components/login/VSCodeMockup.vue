<template>
  <div class="marketing-section">
    <div class="marketing-content">
      <h2>Code Smarter.</h2>
      <h1>Learn. Build. Excel.</h1>

      <div class="laptop-mockup">
        <div class="laptop">
          <div class="laptop-screen">
            <!-- VS Code Menu Bar -->
            <MenuBar />

            <div class="vscode-layout">
              <!-- VS Code Activity Bar -->
              <ActivityBar />

              <!-- VS Code Sidebar -->
              <FileSidebar />

              <!-- Main Editor Area -->
              <EditorArea />
            </div>

            <!-- VS Code Status Bar -->
            <StatusBar />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuBar from './vscode/MenuBar.vue'
import ActivityBar from './vscode/ActivityBar.vue'
import FileSidebar from './vscode/SideBar.vue'
import EditorArea from './vscode/EditorArea.vue'
import StatusBar from './vscode/StatusBar.vue'
</script>

<style scoped>
.marketing-section {
  flex: 1;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: white;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 0 16px 16px 0;
}

.marketing-content {
  text-align: center;
  z-index: 2;
}

.marketing-content h2 {
  font-size: 16px;
  font-weight: 400;
  color: #9ca3af;
  margin-bottom: 8px;
}

.marketing-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.laptop-mockup {
  display: flex;
  justify-content: center;
  align-items: center;
}

.laptop {
  width: 540px;
  height: 360px;
  background: #374151;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.laptop-screen {
  width: 100%;
  height: 100%;
  background: #1f2937;
  border-radius: 12px;
  overflow: hidden;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.vscode-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}
</style>
