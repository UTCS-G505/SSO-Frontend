<template>
  <div class="about-container">
    <!-- App Header with logo and UserMenu -->
    <AppHeader />

    <main class="about-section">
      <h2 class="title">隱私權聲明</h2>
      <section class="about-content">
        <AgreementSection />
      </section>

      <h2 class="title">開發與維護人員名單</h2>
      <section class="developers-list">
        <DeveloperCard
          class="developer-card"
          v-for="developer in Developers"
          :key="developer.name"
          :image="developer.avatar"
          :name="developer.name"
          :description="developer.description"
          :github="developer.github"
        />
      </section>
      <div class="back-home-link">
        <button @click="goBack" class="btn btn-primary">
          <ArrowLeft :size="20" />
          回上頁
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/components/common/Header.vue'
import AgreementSection from '@/components/about/AgreementSection.vue'
import DeveloperCard from '@/components/about/DeveloperCard.vue'
import { developerConfig } from '@/config/developers'

const router = useRouter()
const Developers = developerConfig

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.about-section {
  flex: 1;
  padding: 2rem 2.25rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.about-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.about-content {
  margin: 1rem 2rem;
  padding: 2rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.developers-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 2rem;
  padding: 1rem 2rem;
}

.back-home-link {
  display: flex;
  justify-content: center;
  margin: 2rem 2rem 0.5rem 2rem;
  z-index: 999;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.title {
  text-align: left;
  margin: 2rem 2rem 1rem;
}

@media (max-width: 1095px) {
  .developers-list {
    grid-template-columns: 1fr;
  }
  .about-section {
    padding: 1.25rem 1.25rem 2rem;
  }
}

@media (max-width: 424px) {
  .about-section {
    padding: 0.5rem 0rem 1rem;
  }
}
</style>
