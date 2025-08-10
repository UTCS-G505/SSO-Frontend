<template>
  <div class="editor-area">
    <!-- Tab Bar -->
    <div class="tab-bar">
      <div class="tab active">
        <img src="@/assets/cpp.svg" alt="icon" />
        <span class="tab-name">main.cpp</span>
        <span class="tab-close">×</span>
      </div>
      <div class="tab">
        <img src="@/assets/c.svg" alt="icon" />
        <span class="tab-name">utils.h</span>
        <span class="tab-close">×</span>
      </div>
    </div>

    <!-- Code Editor -->
    <div class="code-editor">
      <div class="code-content">
        <div class="line-numbers">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
        </div>
        <div class="code-lines">
          <div class="code-line">
            <span class="keyword">#include </span>
            <span class="string">&lt;iostream&gt;</span>
          </div>
          <div class="code-line">
            <span class="keyword">using namespace </span>
            <span class="type">std</span>;
          </div>
          <div class="code-line"></div>
          <div class="code-line">
            <span class="type">int</span> <span class="function">main</span>() {
          </div>
          <div class="code-line">
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="type">cout</span> &lt;&lt;
            <span class="string">"Hello UTCS!"</span> &lt;&lt; <span class="type">endl</span>;
          </div>
          <div class="code-line">
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return </span>
            <span class="number">0</span>;
          </div>
          <div class="code-line">}</div>
          <div class="code-line"></div>
        </div>
      </div>
    </div>

    <!-- Terminal -->
    <div class="terminal-section">
      <div class="terminal-tabs">
        <div class="terminal-tab active">
          <svg
            class="terminal-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="4,17 10,11 4,5" />
            <line x1="12" x2="20" y1="19" y2="19" />
          </svg>
          <span>Terminal</span>
        </div>
      </div>
      <div class="terminal-content">
        <div class="terminal-line">
          <span class="prompt">student@utcs:~/project$ </span>
          <span class="command">g++ main.cpp -o main</span>
        </div>
        <div class="terminal-line">
          <span class="prompt">student@utcs:~/project$ </span>
          <span class="command">./main</span>
        </div>
        <div class="terminal-line output">Hello UTCS!</div>
        <div class="terminal-line">
          <span class="prompt">student@utcs:~/project$ </span>
          <span class="cursor">_</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1f2937;
}

.tab-bar {
  background: #111827;
  border-bottom: 1px solid #374151;
  display: flex;
  padding: 0 4px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #1f2937;
  border-right: 1px solid #374151;
  font-size: 10px;
  color: #e5e7eb;
  cursor: pointer;
}

.tab.active {
  background: #1f2937;
  color: #fbbf24;
}

.tab-close {
  color: #6b7280;
  font-size: 12px;
  margin-left: 4px;
}

.tab-close:hover {
  color: #e5e7eb;
}

.code-editor {
  flex: 1;
  display: flex;
  background: #1f2937;
  min-height: 0;
}

.code-content {
  display: flex;
  width: 100%;
  min-height: 0;
}

.line-numbers {
  background: #111827;
  padding: 8px 6px;
  color: #6b7280;
  text-align: right;
  line-height: 1.4;
  flex-shrink: 0;
  border-right: 1px solid #374151;
}

.line-numbers span {
  display: block;
  font-size: 10px;
}

.code-lines {
  flex: 1;
  padding: 8px 10px;
  line-height: 1.4;
  overflow: hidden;
  text-align: left;
}

.code-line {
  font-size: 10px;
  margin-bottom: 2px;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}

.keyword {
  color: #c084fc;
}
.string {
  color: #34d399;
}
.type {
  color: #60a5fa;
}
.function {
  color: #fbbf24;
}
.number {
  color: #f87171;
}

.terminal-section {
  background: #111827;
  border-top: 1px solid #374151;
  height: 30%;
  display: flex;
  flex-direction: column;
}

.terminal-tabs {
  background: #0f172a;
  padding: 2px 4px;
  border-bottom: 1px solid #374151;
  display: flex;
  justify-content: flex-start;
}

.terminal-tab {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: #111827;
  border-radius: 2px;
  font-size: 9px;
  color: #9ca3af;
}

.terminal-tab.active {
  background: #1f2937;
  color: #10b981;
}

.terminal-content {
  padding: 6px 10px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  flex: 1;
  overflow: hidden;
  text-align: left;
}

.terminal-line {
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
}

.prompt {
  color: #10b981;
}
.command {
  color: #e5e7eb;
}
.output {
  color: #fbbf24;
}
.cursor {
  color: #e5e7eb;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
