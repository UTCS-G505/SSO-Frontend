<template>
  <div class="about-container">
    <!-- App Header with logo and UserMenu -->
    <AppHeader />
    
    <main class="about-section">
      <div class="back-home-link">
        <button @click="goBack" class="btn btn-primary">
          <ArrowLeft :size="20" />
          回上頁
        </button>
      </div>

      <h2 class="title">隱私權聲明</h2>
      <section class="about-content">
        <p>臺北市立大學資訊科學系(以下簡稱本系)，依個人資料保護法（以下簡稱個資法）第八條規定，告知下列事項，請您詳閱。</p>
        <p>一、 蒐集個人資料之目的</p>
        <p>本系為執行資源利用與服務推廣相關業務所需，蒐集您的個人資料。</p>
        <p>二、 蒐集個人資料之類別</p>
        <ol>
          <li>本系因執行業務蒐集您的個人資料包括中英文姓名、國民身分證統一編號、連絡電話、電子郵件地址、服務單位、借用教室紀錄等，詳如各項服務申請表。</li>
          <li>本系及電子資源廠商將使用cookies 進行各項網路資源服務之管理及記錄，包括蒐集IP位址、瀏覽網頁、使用檔案及時間等軌跡資料。</li>
        </ol>
        <p>三、 個人資料利用之期間、地區、對象與方式</p>
        <ol>
          <li>本系於蒐集目的之存續期間或因執行業務所需保存期間內，得合理利用您的個人資料，利用地區不限。</li>
          <li>本系利用您的個人資料於蒐集目的宣告之各項業務執行，包括因業務執行所必須之各項聯繫與通知。</li>
          <li>本系利用各項網路資源服務使用紀錄，進行總體流量、使用行為研究及加值應用，以提昇網站服務品質，不針對個別使用者分析。</li>
        </ol>
        <p>四、 個人資料之提供</p>
        <ol>
          <li>您可自由選擇是否提供相關個人資料，惟若拒絕提供個人資料，本系將無法提供相關服務。</li>
          <li>請依各項服務需求提供您本人正確、最新及完整的個人資料，若您的個人資料有任何異動，請主動向本系申請更正。</li>
          <li>若您提供錯誤、過時、不完整或具誤導性的資料，而損及您的相關權益，本系將不負相關賠償責任。</li>
        </ol>
        <p>五、個人資料之保密</p>
        <p>本系將善盡個人資料保護之責。如因天災、事變或其他不可抗力所致者，致您的個人資料被竊取、洩漏、竄改、遭其他侵害者，本系將於查明後以電話、電子郵件或網站公告等方法，擇適當方式通知您。</p>
        <p>六、當事人就個人資料得行使之權利</p>
        <p>您可依個資法第三條規定，就本系保有您的個人資料行使以下權利：</p>
        <ol>
          <li>請求查詢或閱覽。</li>
          <li>請求製給複製本。</li>
          <li>請求補充或更正。</li>
          <li>請求停止蒐集、處理、利用或請求刪除，惟因本系執行業務所必須者，本系得不依請求為之。</li>
        </ol>
        <p>若您欲執行上述權利，或有任何建議指教，請與本系連繫。</p>
        <p>電話：886-2-23113040 #8362、8363，電子郵件：<a href="mailto:cs@go.utaipei.edu.tw">cs@go.utaipei.edu.tw</a>。本系個人資料保護申訴窗口為資訊科學系系辦。</p>
        <p>七、 同意書之效力</p>
        <p>當您完成簽署時，即表示您已閱讀瞭解並同意本同意書的內容。</p>
        <p>本系保留隨時修改本同意書之權利，內容修改時將於本系網站公告。如您未於公告後一個月內提出異議或仍繼續使用本系相關服務，將視為您已同意並接受本系所更改之內容。</p>
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import AppHeader from '@/components/common/Header.vue'
import DeveloperCard from '@/components/DeveloperCard.vue'
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

.about-content p {
  margin: 1rem 0;
}

.about-content ol {
  padding-left: 2rem;
}

.developers-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 2rem;
  padding: 1rem 2rem;
}

.back-home-link {
  display: flex;
  justify-content: start;
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
