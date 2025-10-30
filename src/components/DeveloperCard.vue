<template>
  <div class="developer-card">
    <div class="developer-image">
      <img
        class="developer-image"
        :src="image?.href"
        alt="Developers and Maintainers"
        width="100"
        height="100"
        loading="lazy"
      />
    </div>
    <div class="developer-info">
      <h1 class="developer-name">{{ name }}</h1>
      <p class="developer-description">{{ description }}</p>
      <p class="github-link" v-if="github">
        GitHub:
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer">@{{ github }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  image: URL,
  name: String,
  description: String,
  github: String,
})

const githubUrl = computed(() => `https://github.com/${props.github}`).value
</script>

<style scoped>
.developer-image {
  position: relative;
  top: 0px;
  left: 1.5rem;
  width: 125px;
  height: 125px;
  object-fit: contain;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  z-index: 1;
}

.developer-image img {
  position: relative;
  top: 0;
  left: 0;
  width: 125px;
  height: 125px;
  object-fit: contain;
}

.developer-info {
  position: relative;
  top: -75px;
  height: calc(100% - 110px);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.developer-name {
  text-align: right;
  margin-bottom: 1rem;
}

.github-link {
  margin: 0.5rem 0 0;
}
</style>
