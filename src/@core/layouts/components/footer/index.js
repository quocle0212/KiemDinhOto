// ** Icons Import
import { Heart } from 'react-feather'
import { VERSION_WEB } from "../../../../constants/url";

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a onClick={(e) => { e.preventDefault() }} href='https://1.envato.market/pixinvent_portfolio' target='_blank' rel='noopener noreferrer'>
          MakeFamousApp.com
        </a>
        <span className='d-none d-sm-inline-block'>, Version Web {VERSION_WEB} </span>
      </span>
      <span className='float-md-right d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span>
    </p>
  )
}

export default Footer
