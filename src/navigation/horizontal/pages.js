// @ts-nocheck
import { FileText, Circle, User, CreditCard } from 'react-feather'
export default [
  {
    id: 'users',
    title: 'Users',
    icon: <User size={12} />,
    permissions: [],
    navLink: '/pages/users'
  },
  {
    id: 'transaction',
    title: 'Transaction',
    icon: <CreditCard size={20} />,
    // badge: 'light-info',
    // badgeText: '4',
    children: [

      {
        id: 'deposit',
        title: 'Deposit',
        icon: <Circle size={12} />,
        permissions: [],
        navLink: '/pages/deposit'
      },
      {
        id: 'withdraw',
        title: 'Withdraw',
        icon: <Circle size={12} />,
        permissions: [],
        navLink: '/pages/withdraw'
      },
      {
        id: 'transfer',
        title: 'transfer',
        icon: <Circle size={12} />,
        permissions: [],
        navLink: '/pages/transfer'
      },
    ]
  }

]
