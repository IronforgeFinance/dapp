export default [
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, path: '/', component: '@/pages/Home' },
      { exact: true, path: '/mint', component: '@/pages/Mint' },
      { exact: true, path: '/burn', component: '@/pages/Burn' },
      { exact: true, path: '/trade', component: '@/pages/Trade' },
      { exact: true, path: '/farm', component: '@/pages/Farm' },
      { exact: true, path: '/wallet', component: '@/pages/Wallet' },
    ],
  },
];
