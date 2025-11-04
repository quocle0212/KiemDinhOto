import React from 'react';
import { Copy } from 'react-feather';
import { toast } from "react-toastify";

const BasicTextCopy = ({ value }) => {
  return (
    <div style={{ cursor: 'pointer', margin: "0 20px" }}
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Đã sao chép');
      }}
    ><Copy style={{ width: "18px", height: "18px" }} /></div>
  )
}

export default BasicTextCopy