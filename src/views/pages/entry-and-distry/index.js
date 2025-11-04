import { Fragment, useState } from 'react';

import moment from 'moment';
import CryptoJS from 'crypto-js';
import { Button, Col, Card, Input, Label, Row } from 'reactstrap';

export default function DecryptPage() {
  const REACT_APP_KEY_PAYLOAD = "ttdk"
  const REACT_APP_ENCRYPT_SECRET_KEY = "ENCRYPT_SECRET_KEYttdk20241212"

  const [values, setValues] = useState()
  const [formValues, setFormValues] = useState({})

  function getDateAsHex() {
    const date = moment().format('YYYYMMDD');
    return CryptoJS.enc.Utf8.parse(date).toString(CryptoJS.enc.Hex);
  }

  function generateSecretKey() {
    const dateHex = getDateAsHex();
    const secretKeyPrefix = REACT_APP_ENCRYPT_SECRET_KEY || 'ENCRYPT_SECRET_KEY';
    const secretKey = secretKeyPrefix + dateHex;

    // AES-256 requires a 32-byte key; truncate or pad if needed
    return CryptoJS.enc.Utf8.parse(secretKey).toString(CryptoJS.enc.Hex).slice(0, 64);
  }

  // 3. Encrypt function using AES-256-CBC
  function encryptAes256CBC(text) {
    const key = CryptoJS.enc.Hex.parse(generateSecretKey()); // Use hex format
    const iv = CryptoJS.lib.WordArray.random(16); // Generate 16-byte IV

    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      idEn: iv.toString(CryptoJS.enc.Hex), // IV as a hex string
      dataEn: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
    };
  }

  // 4. Decrypt function using AES-256-CBC
  function decryptAes256CBC(encryptedData) {
    const key = CryptoJS.enc.Hex.parse(generateSecretKey()); // Use hex format
    const iv = CryptoJS.enc.Hex.parse(encryptedData.idEn); // Parse hex IV

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Hex.parse(encryptedData.dataEn) },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    let result = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    if (typeof result === "object") {
      result = result
    } else {
      result = JSON.parse(result)
    }

    let newObj = {};

    for (let key in result) {
      if (result.hasOwnProperty(key)) {
        // Remove 'key' prefix from each key
        let newKey = key.startsWith(REACT_APP_KEY_PAYLOAD) ? key.slice(REACT_APP_KEY_PAYLOAD.length) : key;
        newObj[newKey] = result[key];
      }
    }

    setValues(newObj)
  }

  function handleEncryptButton(decryptedData) {
    let newObj = {};

    for (let key in decryptedData) {
      if (decryptedData.hasOwnProperty(key)) {
        newObj[REACT_APP_KEY_PAYLOAD + key] = decryptedData[key]; // Add 'key' prefix to each key
      }
    }

    const result = encryptAes256CBC(JSON.stringify(newObj))

    setValues(result)
  }

  function formatValues(values) {
    return JSON.stringify(values, null, 2)
  }

  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1 justify-content-center' xs='1'>
          <h1 className='mb-2' style={{ textAlign: 'center' }}>Mã Hóa và Giải Mã</h1>
          <Col sm='12'>
            <Label>Dữ liệu đầu vào</Label>
            <Input required type='textarea' onChange={(event) => setFormValues(event.target.value)} style={{ height: 300 }} />
          </Col>
          <Col sm='12' lg='12' md='12' xs="12" style={{ marginTop: 24 }}>
            <Label>Dữ liệu đầu ra</Label>
            <Input required type='textarea' value={formatValues(values)} style={{ height: 300 }} />
          </Col>
          <Row className='mt-2' >
            <Col sm='6' md='4' lg='2' xs="12">
              <Button.Ripple color='primary' className="w-100 mb-1" onClick={() => handleEncryptButton(JSON.parse(formValues))}>Mã Hóa</Button.Ripple>
            </Col>
            <Col sm='6' md='4' lg='2' xs="12">
              <Button.Ripple color='warning' className="w-100 mb-1" onClick={() => decryptAes256CBC(JSON.parse(formValues))}>Giải Mã</Button.Ripple>
            </Col>
          </Row>
        </Row>
      </Card >
    </Fragment >
  )
}
