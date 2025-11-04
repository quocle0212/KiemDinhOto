import React, { useState, useRef, memo } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { injectIntl, FormattedMessage, useIntl } from 'react-intl'
import { Button, Col, Row, Modal, ModalBody, ModalFooter, Input } from 'reactstrap';
import AspectRatio from 'react-aspect-ratio';
import { toast } from 'react-toastify'
import './UploadImage.scss';
import servicesUpload from '../../../services/servicesUpload';
import { Trash } from 'react-feather';

const ASPECT_RATIO_X = 1976;
const ASPECT_RATIO_Y = 1165;
const SCALE_FACTOR = 247 * 2;

const UploadImage = ({ setting, onUpdate }) => {
  const intl = useIntl();
  const [image, setImage] = useState(Array(5).fill(null));
  const cropperRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [index, setIndex] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [desc, setDesc] = useState('')

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = reader.result;
          return newImages;
        });
        setIndex(index);
        setCurrentImageIndex(index);
        setModal(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  const updateImage = async (croppedImage) => {
    const params = {
      imageData: croppedImage.replace('data:' + selectedFile.type + ';base64,', ''),
      imageFormat: selectedFile.name.split('.').pop().toLowerCase()
    }
    const res = await servicesUpload.upload(params)

    if (!res.isSuccess) {
      toast.warn(intl.formatMessage({ id: 'upload_Error' }))
    }

    return res?.data || null;
  }
  const handleCrop = async () => {
    const cropperInstance = cropperRef.current.cropper;
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas({ aspectRatio: 16 / 9 });
      const croppedImage = croppedCanvas.toDataURL(selectedFile.type);
      const url = await updateImage(croppedImage);
      if (url) {
        onUpdate(url, index + 1, desc);
      }
      setModal(false);
    }
  };

  const handleDelete = (e, index) => {
    onUpdate("", index + 1);
  };

  return (
    <div>
      <div className="upload-container">
        {image.map((img, index) => (
          <div key={index} className="upload-col">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              hidden
              id={`upload-${index}`}
            />
            <label htmlFor={`upload-${index}`} className="upload-label">
              <AspectRatio ratio={`${ASPECT_RATIO_X}/${ASPECT_RATIO_Y}`} style={{ width: '100%' }}>
                {setting[`bannerUrl${index + 1}`] ? (
                  <div className="image-wrapper" onClick={(e) => e.preventDefault()}>
                    <img src={setting[`bannerUrl${index + 1}`]} alt={`Uploaded-${index}`} className="uploaded-image" />
                    <div className="overlay">
                      <div className="delete-icon" onClick={(e) => handleDelete(e, index)}>
                        <Trash />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-text text-small"><FormattedMessage id="setting_text" /></div>
                )}
              </AspectRatio>
            </label>
            <div className="image-description">
              <FormattedMessage id="setting_descriptionImage" />
              <div>({ASPECT_RATIO_X}px x {ASPECT_RATIO_Y}px)</div>
            </div>
          </div>

        ))}
      </div>
      <Modal isOpen={modal}>
        <ModalBody>
          <Cropper
            src={image[currentImageIndex]}
            ref={cropperRef}
            aspectRatio={(ASPECT_RATIO_X) / (ASPECT_RATIO_Y)}
            style={{ height: '400px', width: '100%' }}
            ready={() => {
              const cropperInstance = cropperRef.current.cropper;
              if (cropperInstance) {
                cropperInstance.setCropBoxData({ width: ASPECT_RATIO_X, height: ASPECT_RATIO_Y });
              }
            }}
          />
          <Input 
            type='textarea' 
            rows='3' 
            id='payment-note' 
            placeholder={intl.formatMessage({ id: 'link_attach' })} 
            className='mt-2'
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCrop}>
            <FormattedMessage id="save" />
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            <FormattedMessage id="setting_cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default injectIntl(memo(UploadImage));
