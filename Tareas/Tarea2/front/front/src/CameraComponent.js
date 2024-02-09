import React, { useState, useRef } from 'react';

const CameraComponent = () => {
  const [originalPhoto, setOriginalPhoto] = useState('');
  // Elimina la variable 'reducedPhoto' si no la necesitas actualmente
  // const [reducedPhoto, setReducedPhoto] = useState(''); 

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

    // Reducir el tamaño de la imagen antes de convertirla a base64
    const maxWidth = 640; // Tamaño máximo de la imagen
    const maxHeight = 480;
    let width = canvas.width;
    let height = canvas.height;
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
    const resizedCanvas = document.createElement('canvas');
    const resizedContext = resizedCanvas.getContext('2d');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    resizedContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    // Convertir la imagen reducida a formato base64 y establecerla en el estado 'originalPhoto'
    const data = resizedCanvas.toDataURL('image/jpeg', 0.9); // Calidad de la imagen reducida
    setOriginalPhoto(data);
  };

  const sendPhoto = async () => {
    try {
      // Crear una versión reducida de la imagen original
      const reducedCanvas = document.createElement('canvas');
      const reducedContext = reducedCanvas.getContext('2d');
      reducedCanvas.width = videoRef.current.videoWidth * 0.25; // Reducir a la mitad el tamaño de la imagen
      reducedCanvas.height = videoRef.current.videoHeight * 0.25;
      reducedContext.drawImage(videoRef.current, 0, 0, reducedCanvas.width, reducedCanvas.height);
      const reducedData = reducedCanvas.toDataURL('image/jpeg', 0.001); // Calidad de la imagen reducida

      // Aquí puedes enviar reducedData al servidor
      console.log('Sending photo to server:', reducedData);
      // Enviar la imagen reducida al servidor
      const response = await fetch('http://localhost:3001/uploadPhoto', {
        method: 'POST',
        body: reducedData, // Enviar la imagen reducida como una cadena de texto
      });
      const responseData = await response.text();
      console.log(responseData);
    } catch (error) {
      console.error('Error sending photo to server:', error);
    }
  };

  return (
    <div>
      <button onClick={startCamera}>Start Camera</button>
      <br />
      <video ref={videoRef} autoPlay={true} style={{ maxWidth: '100%' }} />
      <br />
      <button onClick={takePhoto}>Take Photo</button>
      <br />
      {originalPhoto && <img src={originalPhoto} alt="Preview" style={{ maxWidth: '100%' }} />}
      <br />
      <button onClick={sendPhoto}>Send Photo</button>
    </div>
  );
};

export default CameraComponent;
