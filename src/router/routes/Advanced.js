import { lazy } from 'react'

const AdvancedRoutes = [
  {
    path: '/pages/advanced/entry',
    component: lazy(() => import('../../views/pages/entry-and-distry/index'))
  },
]

export default AdvancedRoutes
