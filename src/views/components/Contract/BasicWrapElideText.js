import React from 'react'
import scss from "./style.module.scss";

const BasicWrapElideText = (text) => {
  return (
    <div className={scss.container }>{text}</div>
  )
}

export default BasicWrapElideText