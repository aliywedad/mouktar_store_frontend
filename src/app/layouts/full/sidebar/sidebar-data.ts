import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
    
  {
    displayName: 'dashboard',
    arName: ' فاتورة جديدة',
    route: '/admin',
    iconName: 'fa-solid fa-calculator',
  },

    {
    displayName: 'facteurs',
    arName: 'الفواتير',
    iconName: 'fa-solid fa-file-invoice',
    route: '/admin/facteurs',
  },

  {
    displayName: 'debts',
    arName: 'الديون',
    iconName: 'fa-solid fa-file-invoice',
    route: '/admin/debts',
  },


    {
    displayName: 'notes',
    arName: 'الملاحظات',
    iconName: 'fa-solid fa-users',
    route: '/admin/notes',
  },


  //   {
  //   displayName: 'backup',
  //   arName: ' history ',
  //       iconName: 'fa-solid fa-clock-rotate-left',

  //   route: '/admin/backup',
  // },
];
