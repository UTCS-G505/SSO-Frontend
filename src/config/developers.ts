export interface JobConfig {
  systemName: string
  pm?: boolean
  uiux?: boolean
  frontend?: boolean
  backend?: boolean
  devops?: boolean
  maintainer?: boolean
}

export interface DeveloperConfig {
  name: string
  description?: string
  avatar?: URL
  github?: string
  jobs?: Array<JobConfig>
}

const createService = (systemName: string) => {
  return (roles?: {
    pm?: boolean
    uiux?: boolean
    frontend?: boolean
    backend?: boolean
    devops?: boolean
    maintainer?: boolean
  }) => ({
    systemName,
    pm: roles?.pm,
    uiux: roles?.uiux,
    frontend: roles?.frontend,
    backend: roles?.backend,
    devops: roles?.devops,
    maintainer: roles?.maintainer,
  })
}

const sso_service = createService('單一驗證平台')
const locker_borrow = createService('系櫃借用系統')
const classroom_borrow = createService('教室借用系統')

export const developerConfig: DeveloperConfig[] = [
  {
    name: '蔡欣妤',
    description: '身為偶爾才出現的幽靈（？學姊，看著大家把想法一步步變成畫面，真的覺得你們超棒！從第一行程式碼到現在的成果，都是你們努力（賣肝）換來的。希望我抓 bug 的時候，大家不要想殺我XD',
    avatar: new URL('/src/assets/avatars/U11016038.jpeg', import.meta.url),
    github: 'hsinyu2527',
    jobs: [
      sso_service({ devops: true }),
      locker_borrow({ devops: true }),
      classroom_borrow({ devops: true }),
    ],
  },
  {
    name: '張育綸',
    description: '選んだ道を、自分の力で正解にしてあげなさい。',
    avatar: new URL('/src/assets/avatars/U11316042.png', import.meta.url),
    github: 'BlueBoy247',
    jobs: [
      sso_service({ pm: true, frontend: true, backend: true, devops: true }),
      locker_borrow({ pm: true, frontend: true, backend: true, devops: true }),
    ],
  },
  {
    name: '陳皓平',
    description: 'good 要和 better 一起去上廁所，但 better 先去了，因為他比較級',
    avatar: new URL('/src/assets/avatars/U11216028.jpg', import.meta.url),
    github: 'lucas6028',
    jobs: [
      sso_service({ pm: true, uiux: true, frontend: true }),
      classroom_borrow({ pm: true, frontend: true, backend: true, devops: true }),
    ],
  },
  {
    name: '陳佳筠',
    description: "Don't give up and keep trying💪",
    avatar: new URL('/src/assets/avatars/U11316010.png', import.meta.url),
    github: 'Doreen-123',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '任晏磊',
    description: '打羽球、打程式、吃飯、睡覺',
    avatar: new URL('/src/assets/avatars/U11316011.png', import.meta.url),
    github: 'yanyu18927',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '鍾沅謀',
    description: '前端端碼上網 網卡前端掛',
    github: 'morris950318',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '楊顓睿',
    description: '安如磐石，天動萬象',
    avatar: new URL('/src/assets/avatars/U11316016.jpeg', import.meta.url),
    github: 'Roy-1011',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '陳胤華',
    description: 'Trying to turn caffeine into something that works.',
    avatar: new URL('/src/assets/avatars/U11316017.jpg', import.meta.url),
    github: 'Fabricator0417',
    jobs: [locker_borrow({ uiux: true, frontend: true })],
  },
  {
    name: '洪瑋甯',
    description: '沒幹嘛\n就是PR被退貨了200次',
    avatar: new URL('/src/assets/avatars/U11316022.JPG', import.meta.url),
    github: 'ning-hong',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '謝秉錡',
    github: 'benjamin666520',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '許建程',
    description: "I'm looking for some motivation.",
    avatar: new URL('/src/assets/avatars/U11316035.png', import.meta.url),
    github: 'jimkro',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '謝妤涵',
    description: 'It’s Hannahahahaha',
    avatar: new URL('/src/assets/avatars/U11316043.jpeg', import.meta.url),
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '王毓如',
    description: '404U',
    avatar: new URL('/src/assets/avatars/U11316044.jpeg', import.meta.url),
    github: 'zowang2024',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '黃瑞麟',
    github: 'kevinhuang09',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '余珮璇',
    github: 'yu-peihsuan',
    jobs: [classroom_borrow({ uiux: true, frontend: true })],
  },
  {
    name: '張恬熏',
    github: 'Claraa1110',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '劉宸昕',
    description: '嗶啵',
    avatar: new URL('/src/assets/avatars/U11216019.jpeg', import.meta.url),
    github: 'yuek666',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '張哲維',
    description: '剛剛去麥當勞\n跟店員說我要無鹽的薯條\n結果拿到的竟然是有鹽的\n去跟店員反應後\n店員靠在我耳邊對我說\n「怎麼樣，很無言對吧。」',
    github: 'cjw931027',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '楊淯丞',
    jobs: [classroom_borrow({ frontend: true })],
  },
]
