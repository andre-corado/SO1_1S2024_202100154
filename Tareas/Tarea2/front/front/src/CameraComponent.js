import React, { useState, useRef } from 'react';

const CameraComponent = () => {
  const [photo, setPhoto] = useState('');
  const videoRef = useRef();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error accessing the camera:', err);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL('image/png');
    setPhoto(data);
  };

  const sendPhoto = async () => {
    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(photo)); // Suponiendo que 'photo' contiene la imagen en formato base64
  
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        console.log('Image uploaded successfully');
      } else {
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  // Función para convertir un Data URI a un objeto Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  

  return (
    <div>
      <button onClick={startCamera}>Start Camera</button>
      <br />
      <video ref={videoRef} autoPlay={true} style={{ maxWidth: '100%' }} />
      <br />
      <button onClick={takePhoto}>Take Photo</button>
      <br />
      {photo && (
        <>
          <img src={photo} alt="Preview" style={{ maxWidth: '100%' }} />
          <br />
          <button onClick={sendPhoto}>Send Photo</button>
        </>
      )}
    </div>
  );
};

export default CameraComponent;
