<script lang="ts">
export default {
  name: 'FootBar',
}
</script>

<template>
  <footer>
    <div>
      <p>Copyright 2025 © 臺北市立大學資訊科學系(含碩士班)版權所有</p>
      <p><router-link to="/about">關於系統</router-link></p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #e3e3e3;
  padding: 16px 20px;
}

footer p {
  margin: 0;
  color: #6b6b6b;
  font-size: clamp(12px, 0.85rem, 14px);
  line-height: 1.55;
  letter-spacing: 0.5px;
  word-spacing: 2px;
  text-align: center;
}
</style>
