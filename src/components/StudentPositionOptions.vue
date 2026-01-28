<template>
  <option value="" selected disabled>請選擇年級</option>
  <option value="大一" v-if="account?.startsWith('U')">大一</option>
  <option value="大二" v-if="account?.startsWith('U')">大二</option>
  <option value="大三" v-if="account?.startsWith('U')">大三</option>
  <option value="大四" v-if="account?.startsWith('U')">大四</option>
  <option value="大五" v-if="account?.startsWith('U')">大五</option>
  <option value="大六" v-if="account?.startsWith('U')">大六</option>
  <option value="碩一" v-if="account?.startsWith('G')">碩一</option>
  <option value="碩二" v-if="account?.startsWith('G')">碩二</option>
  <option value="碩三" v-if="account?.startsWith('G')">碩三</option>
  <option value="碩四" v-if="account?.startsWith('G')">碩四</option>
  <option value="碩五" v-if="account?.startsWith('G')">碩五</option>
  <option value="碩六" v-if="account?.startsWith('G')">碩六</option>
  <option value="職碩一" v-if="account?.startsWith('M')">職碩一</option>
  <option value="職碩二" v-if="account?.startsWith('M')">職碩二</option>
  <option value="職碩三" v-if="account?.startsWith('M')">職碩三</option>
  <option value="職碩四" v-if="account?.startsWith('M')">職碩四</option>
  <option value="職碩五" v-if="account?.startsWith('M')">職碩五</option>
  <option value="職碩六" v-if="account?.startsWith('M')">職碩六</option>
</template>

<script setup lang="ts">
defineProps({
  account: String,
})
</script>
