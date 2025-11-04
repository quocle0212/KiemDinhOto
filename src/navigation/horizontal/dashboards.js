import { Home, Circle } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Home',
    icon: <Home size={20} />,
    badge: 'light-warning',
    navLink: '/dashboard/analytics'
    // badgeText: '1',
    // children: [
    //   {
    //     id: 'analyticsDash',
    //     title: 'Analytics',
    //     icon: <Circle size={12} />,
    //     navLink: '/dashboard/analytics'
    //   },
    //   {
    //     id: 'eCommerceDash',
    //     title: 'eCommerce',
    //     icon: <Circle size={12} />,
    //     navLink: '/dashboard/ecommerce'
    //   }
    // ]
  }
]
