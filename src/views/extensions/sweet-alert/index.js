import { Fragment } from 'react'
import Swal from 'sweetalert2'
import { ThumbsUp, ThumbsDown } from 'react-feather'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css/animate.css'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
const MySwal = withReactContent(Swal)
const SweetAlert = ({ children, onClick }) => {
  const handleHTMLAlert = () => {
    return MySwal.fire({
      title: 'Are you sure with this action?',
      icon: 'warning',

      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: (
        <span className='align-middle'>

          <span className='align-middle'>Yes</span>
        </span>
      ),
      cancelButtonText: <span className='align-middle'>

        <span className='align-middle'>No</span>
      </span>,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ml-1'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed && onClick) {
        onClick()
      }
    })
  }
  return (
    <Fragment>
      <div onClick={handleHTMLAlert}>
        {
          children
        }
      </div>

    </Fragment>
  )
}

export default SweetAlert
