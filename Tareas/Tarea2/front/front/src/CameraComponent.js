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

  const sendPhoto = () => {
    // Aquí enviarías la foto a la API utilizando fetch
    console.log('Sending photo:', photo);
  };

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
