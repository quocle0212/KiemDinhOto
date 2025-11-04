import { lazy } from 'react'

const TablesRoutes = [
  {
    path: '/pages/test',
    component: lazy(() => import('../../views/tables/data-tables/advance'))

  },
  // {
  //   path: '/datatables/basic',
  //   component: lazy(() => import('../../views/tables/data-tables/basic'))
  // },
  // {
  //   path: '/datatables/advance',
  //  component: lazy(() => import('../../views/tables/reactstrap'))
  // }
]

export default TablesRoutes
