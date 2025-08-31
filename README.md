# SSO-Frontend

北市大資科系單點登入（Single Sign-On）前端應用程式，基於 Vue 3 和 TypeScript 開發。

## 專案簡介

本專案是北市大資科系的單點登入系統前端，提供使用者驗證、授權和應用程式存取功能。使用者可以透過單一帳號登入多個系統應用程式。

## 功能特色

- 🔐 **使用者驗證** - 支援登入、註冊、登出功能
- 🎫 **JWT 權杖管理** - 自動更新權杖，維持登入狀態
- 👤 **使用者資料管理** - 個人資料檢視與編輯
- 🏠 **應用程式儀表板** - 統一存取各系統應用程式
- 🛡️ **路由保護** - 基於權限的頁面存取控制
- 📱 **響應式設計** - 支援桌面和行動裝置
- 🎨 **現代化介面** - 簡潔直覺的使用者體驗

## 技術架構

- **前端框架**: Vue 3 (Composition API)
- **程式語言**: TypeScript
- **建置工具**: Vite
- **狀態管理**: Pinia
- **路由管理**: Vue Router
- **HTTP 客戶端**: Axios
- **UI 圖示**: Lucide Vue Next
- **樣式**: CSS3 (Scoped Styles)

## 環境需求

- Node.js: ^20.19.0 || >=22.12.0
- pnpm: 建議使用最新版本

## 快速開始

### 1. 安裝相依套件

```sh
pnpm install
```

### 2. 環境變數設定

建立 `.env` 檔案並設定後端 API 位址：

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. 開發模式運行

```sh
pnpm dev
```

### 4. 型別檢查、編譯並最小化（正式環境）

```sh
pnpm build
```

### 5. 程式碼檢查和修正

```sh
pnpm lint
```

### 6. 格式化程式碼

```sh
pnpm format
```

## 專案結構

```
src/
├── assets/          # 靜態資源（圖片、圖示）
├── components/      # Vue 元件
│   ├── common/      # 共用元件
│   ├── icons/       # 圖示元件
│   ├── login/       # 登入相關元件
│   └── navigation/  # 導覽元件
├── composables/     # Composition API 可複用邏輯
├── router/          # 路由設定
├── stores/          # Pinia 狀態管理
├── types/           # TypeScript 型別定義
├── utils/           # 工具函數
└── views/           # 頁面元件
```

## API 整合

本前端應用程式與後端 SSO API 整合，主要端點包括：

- `POST /auth/login` - 使用者登入
- `POST /auth/register` - 使用者註冊
- `POST /auth/logout` - 使用者登出
- `POST /auth/refresh` - 權杖更新
- `GET /user/get/{id}` - 取得使用者資料
- `PATCH /user/update/{id}` - 更新使用者資料

## 使用者角色

系統支援以下使用者角色：

- **系統管理員** (ADMIN) - 完整系統管理權限
- **系辦人員** (OFFICER) - 系辦行政管理
- **系主任** (DIRECTOR) - 系主任權限
- **系上教師** (TEACHER) - 教師權限
- **系上學生** (STUDENT) - 學生權限
- **校內人員** (UT_USER) - 一般校內使用者
- **校外人士** (GUEST) - 訪客權限

## 部署說明

### 建置正式版本

```sh
pnpm build
```

建置完成後，`dist/` 資料夾包含可部署的靜態檔案。

### 預覽正式版本

```sh
pnpm preview
```
