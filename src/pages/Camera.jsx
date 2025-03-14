import React, { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import './Camera.css';

function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);
  const [missingPPE, setMissingPPE] = useState([]);

  useEffect(() => {
    startCamera();
    const interval = setInterval(captureAndSendImage, 2000); // Chụp ảnh mỗi 2 giây
    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureAndSendImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/jpeg');
    const blob = dataURItoBlob(imageDataURL);
    const formData = new FormData();
    formData.append('image', blob, 'camera.jpg');

    try {
      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setImageURL(`http://127.0.0.1:5000${data.image_url}`);
      setMissingPPE(data.missing_ppe);
    } catch (error) {
      console.error('Lỗi khi gửi ảnh:', error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div>
      <Header />

      <div className="camera-container">
        <div className="camera-section">
          <h3>Camera Real-time</h3>
          <video ref={videoRef} autoPlay playsInline muted></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        <div className="result-section">
          <h3>Kết quả phát hiện PPE</h3>
          {imageURL && <img src={imageURL} alt="Kết quả phát hiện PPE" />}
        </div>

        <div className="missing-ppe">
          <h3>❗ Thiếu các đồ bảo hộ:</h3>
          <ul>
            {missingPPE.length > 0 ? (
              missingPPE.map((item, index) => (
                <li key={index}>⚠️ {item}</li>
              ))
            ) : (
              <li>✅ Đã đủ trang bị bảo hộ</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CameraPage;
