import AvatarGroup from '@components/avatar-group'
import react from '@src/assets/images/icons/react.svg'
import vuejs from '@src/assets/images/icons/vuejs.svg'
import angular from '@src/assets/images/icons/angular.svg'
import bootstrap from '@src/assets/images/icons/bootstrap.svg'
import avatar1 from '@src/assets/images/portrait/small/avatar-s-5.jpg'
import avatar2 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import avatar3 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
import { MoreVertical, Edit, Trash } from 'react-feather'
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

const avatarGroupData1 = [
  {
    title: 'Lilian',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Alberto',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Bruce',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData2 = [
  {
    title: 'Diana',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Rey',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'James',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData3 = [
  {
    title: 'Lee',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Mario',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Oswald',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const avatarGroupData4 = [
  {
    title: 'Christie',
    img: avatar1,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Barnes',
    img: avatar2,
    imgHeight: 26,
    imgWidth: 26
  },
  {
    title: 'Arthur',
    img: avatar3,
    imgHeight: 26,
    imgWidth: 26
  }
]

const TableBasic = () => {
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Address Email	</th>
          <th>Refferred Users</th>
          <th>Address Deposit</th>
          <th>Balance ETH</th>
          <th>Balance BIT</th>
          <th>User_IP</th>
          <th>Created</th>
          <th>Limit Withdraw Daily</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img className='mr-75' src={angular} alt='angular' height='20' width='20' />
            <span className='align-middle font-weight-bold'>Angular Project</span>
          </td>
          <td>Peter Charles</td>
          <td>
            <AvatarGroup data={avatarGroupData1} />
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <Badge pill color='light-primary' className='mr-1'>
              Active
            </Badge>
          </td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Edit className='mr-50' size={15} /> <span className='align-middle'>Edit</span>
                </DropdownItem>
                <DropdownItem href='/' onClick={e => e.preventDefault()}>
                  <Trash className='mr-50' size={15} /> <span className='align-middle'>Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>

      </tbody>
    </Table>
  )
}

export default TableBasic
