import React, { useState } from 'react';
import Header from '../components/Header';

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [missingPPE, setMissingPPE] = useState([]);
  const [imageURL, setImageURL] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAlerts(data.detections);
      setMissingPPE(data.missing_ppe);

      const timestamp = new Date().getTime();
      setImageURL(`http://127.0.0.1:5000${data.image_url}?timestamp=${timestamp}`);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
    }
  };

  return (
    <div>
      <Header />
      <h2>Phát hiện vi phạm an toàn</h2>
      <input type="file" onChange={handleFileUpload} accept="image/*" />

      <div className="detection-container">
        {imageURL && (
          <div className="left-panel">
            <h3>Kết quả phát hiện:</h3>
            <img src={imageURL} alt="Kết quả phát hiện" width="600" />
            {/* <ul>
              {alerts.map((alert, index) => (
                <li key={index}>
                  {alert.class_name} - Score: {alert.score.toFixed(2)}
                </li>
              ))}
            </ul> */}
          </div>
        )}

        {missingPPE.length > 0 && (
          <div className="right-panel">
            <h3>Thiếu các đồ bảo hộ:</h3>
            <ul>
              {missingPPE.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertsPage;
