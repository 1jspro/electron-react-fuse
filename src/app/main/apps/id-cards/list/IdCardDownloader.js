import { Box, Typography } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import { useEffect, useState } from 'react';
import { contextSourcesMap } from 'tailwindcss/lib/lib/sharedState';

const IdCardDownloader = () => {
  const [cardImg, setCardImg] = useState();

  useEffect(() => {
    const card = document.getElementById('id-card-wrapper');

    if (card) {
      htmlToImage.toCanvas(card)
        .then((canvas) => {
          // const img = new Image();
          // img.src = dataUrl;
          //
          // console.log(img, dataUrl);
          // document.getElementById('new-card-wrapper').append(img);
          //
          // const canvas = document.getElementById('new-card-wrapper');
          const image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
          const link = document.createElement('a');
          link.download = "id-card.png";
          link.href = image;
          link.click();
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }
  }, []);

  return (
    <>
      <Box id='id-card-wrapper' sx={{backgroundColor: '#333', height: 456, width: 256}}>
        <Typography variant='h4' color='white'>Here, Download</Typography>
      </Box>
      <Box id='new-card-wrapper'/>
    </>
  )
}

export default IdCardDownloader;