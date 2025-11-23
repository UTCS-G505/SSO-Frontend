<template>
  <div class="developer-card">
    <div class="developer-image">
      <img
        :src="image?.href"
        alt="Developers and Maintainers"
        width="125"
        height="125"
        loading="lazy"
        v-if="image"
      />
      <CircleUserRound :size="125" v-else />
    </div>
    <div class="developer-info">
      <h1 class="developer-name">{{ name }}</h1>
      <div class="developer-brief">
        <p class="developer-description" v-if="description">{{ description }}</p>
        <p class="github-link" v-if="github">
          GitHub:
          <a :href="githubUrl" target="_blank" rel="noopener noreferrer">@{{ github }}</a>
        </p>
      </div>
      <ul class="developer-job" v-if="jobs">
        <li v-for="job in jobs" :key="job.systemName">
          {{ job.systemName }}<br />
          <span class="tag red" v-if="job.pm">PM</span>
          <span class="tag orange" v-if="job.uiux">UI/UX</span>
          <span class="tag yellow" v-if="job.frontend">Frontend</span>
          <span class="tag green" v-if="job.backend">Backend</span>
          <span class="tag blue" v-if="job.devops">DevOps</span>
          <span class="tag purple" v-if="job.maintainer">Maintainer</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { CircleUserRound } from 'lucide-vue-next'
import type { JobConfig } from '@/config/developers'

const props = defineProps({
  image: URL,
  name: String,
  description: String,
  github: String,
  jobs: Array<JobConfig>,
})

const githubUrl = computed(() => `https://github.com/${props.github}`)

onMounted(() => {
  const cards = document.getElementsByClassName('developer-card')
  for (const card of cards) {
    const cardimg = card.getElementsByClassName('developer-image')[0]
    const cardinfo = card.getElementsByClassName('developer-info')[0]
    cardimg.addEventListener('mouseover', () => {
      card.classList.add('hover')
    })
    cardinfo.addEventListener('mouseover', () => {
      card.classList.add('hover')
    })
    card.addEventListener('mouseout', () => {
      card.classList.remove('hover')
    })
  }
})
</script>

<style scoped>
.developer-card {
  margin-bottom: -1.5rem;
  transition: all 0.5s ease;
}

.developer-card.hover {
  transform: scale(1.01);
}

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
  background-color: #fff;
  z-index: 1;
  overflow: hidden;
}

.developer-image img,
.developer-image svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.developer-info {
  position: relative;
  top: -75px;
  height: calc(100% - 125px);
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

.developer-brief {
  margin-bottom: 1.5rem;
}

.developer-description {
  white-space: pre-wrap;
}

.github-link {
  margin-top: 0.5rem;
}

.developer-job {
  margin-left: 1.25rem;
}

.tag {
  margin: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
  font-size: 0.75rem;
  background-color: #f3f4f6;
}

.red {
  background-color: #ffb3ba2f;
}

.orange {
  background-color: #ffdfba3f;
}

.yellow {
  background-color: #ffffba8f;
}

.green {
  background-color: #baffc93f;
}

.blue {
  background-color: #bae1ff3f;
}

.purple {
  background-color: #bdb2ff2f;
}
</style>
