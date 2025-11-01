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
    //description: '',
    //avatar: new URL('/src/assets/avatars/U11316042.png', import.meta.url),
    //github: 'hsinyu2527',
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
      classroom_borrow({
        pm: true,
        frontend: true,
        backend: true,
        devops: true,
        uiux: true,
        maintainer: true,
      }),
    ],
  },
  {
    name: '陳皓平',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216028.png', import.meta.url),
    //github: 'lucas6028',
    jobs: [
      sso_service({ pm: true, uiux: true, frontend: true }),
      classroom_borrow({ pm: true, frontend: true, backend: true, devops: true }),
    ],
  },
  {
    name: '陳佳筠',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316010.png', import.meta.url),
    //github: 'Doreen-123',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '任晏磊',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316011.png', import.meta.url),
    //github: 'yanyu18927',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '鍾沅謀',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316015.png', import.meta.url),
    //github: 'morris950318',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '楊顓睿',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316016.png', import.meta.url),
    //github: 'Roy-1011',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '陳胤華',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316017.png', import.meta.url),
    //github: 'Fabricator0417',
    jobs: [locker_borrow({ uiux: true, frontend: true })],
  },
  {
    name: '洪瑋甯',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316022.png', import.meta.url),
    //github: 'ning-hong',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '謝秉錡',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316033.png', import.meta.url),
    //github: 'benjamin666520',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '許建程',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316035.png', import.meta.url),
    //github: 'jimkro',
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
    description: '',
    //avatar: new URL('/src/assets/avatars/U11316044.png', import.meta.url),
    //github: 'zowang2024',
    jobs: [locker_borrow({ frontend: true })],
  },
  {
    name: '黃瑞麟',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216002.png', import.meta.url),
    //github: 'kevinhuang09',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '孫振倫',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216003.png', import.meta.url),
    //github: 'lun525',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '余珮璇',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216004.png', import.meta.url),
    //github: 'yu-peihsuan',
    jobs: [classroom_borrow({ uiux: true, frontend: true })],
  },
  {
    name: '張恬熏',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216011.png', import.meta.url),
    //github: 'Claraa1110',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '劉宸昕',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216019.png', import.meta.url),
    //github: 'yuek666',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '張哲維',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216021.png', import.meta.url),
    //github: 'cjw931027',
    jobs: [classroom_borrow({ frontend: true })],
  },
  {
    name: '楊淯丞',
    description: '',
    //avatar: new URL('/src/assets/avatars/U11216047.png', import.meta.url),
    //github: 'yangyc1126',
    jobs: [classroom_borrow({ frontend: true })],
  },
]
