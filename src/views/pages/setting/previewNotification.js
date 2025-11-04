import React, { useEffect, useState } from 'react';
import './previewNotification.scss';
import { convertFileToBase64 } from '../../../helper/common'

function PreviewNotification({ title, desc, image }) {
  const [url, setUrl] = useState("");

  const setSaveUrl = async () => {
    const base64 = await convertFileToBase64(image);
    setUrl(base64);
  }

  useEffect(() => {
    if (typeof image === "object") {
      setSaveUrl()
    }else{
      setUrl(image)
    }
  }, [image])
  return (
    <div className="detail-post">
      <h2 className="detail-post-title">{title}</h2>
      <div className={`detail-post-image ${url ? '' : 'hidden'}`}>
        {!!url && (
          <img src={url} alt="Hình ảnh bài viết" />
        )}
      </div>
      <div className="detail-post__content" dangerouslySetInnerHTML={{__html: desc}} />
    </div>
  );
}

export default PreviewNotification;