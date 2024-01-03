// import Jimp from "jimp";
import jsQR from "jsqr";
import qrcode from 'qrcode';
import { Buffer } from 'buffer';
// import QrCode from 'qrcode-reader';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Authenticator } from '@otplib/core';
import { useState, useEffect, useCallback } from 'react';
import { keyDecoder, keyEncoder } from '@otplib/plugin-thirty-two';
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js';

import { Box, Card, Stack, Button, Divider, TextField, Typography } from '@mui/material';


// ----------------------------------------------------------------------

export default function TestTOTP() {

  const [authenticator, setAuthenticator] = useState();
  // const [secret, setSecret] = useState('MAXRCCKIEVVVAS3S');
  const [secret, setSecret] = useState('75KRKBUAEFF2LAAM');
  
  const [imageQRCode, setImageQRCode] = useState();
  const [verifyToken, setVerifyToken] = useState();
  const [imageUpload, setImageUpload] = useState();


  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const aBuffer = reader.result;

        console.log(aBuffer);
        // console.log(file);

        const blob = new Blob([aBuffer], { type: file.type });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        setImageUpload(imageUrl);
        // var img = document.querySelector( "#photo" );
        // img.src = imageUrl;


        const img = new Image()
        img.onload = () => {
          console.log(img.height, img.width);
        }
        img.src = imageUrl



        // const qrreader = new QrCode();
        // qrreader.callback = (er, value) => {
        //   if (er) {
        //     console.error(er);
        //   }
        //   console.log(value.result);
        // };

        // Jimp.read(aBuffer)
        //   .then((image) => {
        //     console.log(image);
        //     // qrreader.decode(image.bitmap);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        const arrayImage = new Uint8ClampedArray(aBuffer);
        console.log(arrayImage, arrayImage.size, blob);
        const imageData = new ImageData(arrayImage, 212, 212);
        const code = jsQR(imageData, 212, 212);

        if (code) {
          console.log("Found QR code", code);
        }

      }
      reader.readAsArrayBuffer(file);
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });



  useEffect(() => {
    console.log('init');
    // @ts-ignore
    window.Buffer = Buffer;
    // const d = createDigest(HashAlgorithms.SHA1, 'xx', '1');
    // const r = createRandomBytes(10, KeyEncodings.BASE64);
    // console.log(d, r);
    const newAuthenticator = new Authenticator({
      createDigest,
      createRandomBytes,
      keyDecoder,
      keyEncoder
    });
    setAuthenticator(newAuthenticator);
  }, []);







  const genSecret = () => {
    setSecret(authenticator.generateSecret());
  }

  const genQR = () => {
    // const token = totpToken(secret, totpOptions({ createDigest }));
    // console.log('afunc token', token);

    const token = authenticator.generate(secret);
    console.log('genQR secret =>', secret, ' | token =>', token);

    const user = 'nokflyingtest@gmail.com';
    const service = 'TestTOTP';
    const otpauth = authenticator.keyuri(user, service, secret);
    console.log('uri', otpauth);
    qrcode.toDataURL(otpauth, (err, imageUrl) => {
      if (err) {
        console.log('Error with QR');
        return;
      }
      // console.log(imageUrl);
      setImageQRCode(imageUrl);
    });
  }

  const verify = () => {
    try {
      const isValid = authenticator.check(verifyToken, secret);
      // const isValid = authenticator.verify({ verifyToken, secret });
      console.log('verify', secret, verifyToken, isValid);
    } catch (err) {
      // Possible errors
      // - options validation
      // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
      console.error(err);
    }
  }

  return (
    <>
      <Helmet>
        <title> TestTOTP </title>
      </Helmet>

      <Box>
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 800,
            }}
          >
            <Stack direction='column' spacing={2} alignItems='center'>
              <Button
                size="large"
                color="inherit"
                variant="outlined"
                onClick={() => {
                  genSecret();
                }}
              >
                Generate secret
              </Button>
              <TextField id="textSecret" variant="outlined"
                value={secret}
              // onChange={(e) => {
              //   setSecret(e.target.value);
              // }}
              />
              <Button
                size="large"
                color="inherit"
                variant="outlined"
                onClick={() => {
                  console.log('---');
                  genQR();
                  console.log('---');
                }}
              >
                Generate QR
              </Button>
              {
                imageQRCode ?
                  <img src={imageQRCode} alt='QR Code' width={212} />
                  :
                  <img src='/assets/qr-code-scan.png' alt='QR Code Place Holder' width={212} />
              }

              <Divider sx={{ my: 3, width: 400 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Verify
                </Typography>
              </Divider>

              <Stack direction='row' spacing={2}>
                <TextField id="textVerify" variant="outlined"
                  onChange={(e) => {
                    setVerifyToken(e.target.value);
                  }}
                />
                <Button
                  size="large"
                  color="inherit"
                  variant="outlined"
                  onClick={() => {
                    console.log('---');
                    verify();
                    console.log('---');
                  }}
                >
                  Verify
                </Button>
              </Stack>


              <Divider sx={{ my: 3, width: 400 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Read QR / Display Token
                </Typography>
              </Divider>



              <Box
                component='div'
                sx={{
                  backgroundColor: 'lightgrey',
                  cursor: 'pointer',
                  border: 1,
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  borderColor: 'grey',
                  padding: 4,
                  width: 300,
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag n drop here ...</p>
                }
              </Box>

              {
                imageUpload ?
                  <img src={imageUpload} alt='Uploaded' width={212} />
                  :
                  <img src='/assets/scan.png' alt='QR Place Holder' width={212} />
              }




            </Stack>

          </Card>
        </Stack>
      </Box>
    </>
  );
}
