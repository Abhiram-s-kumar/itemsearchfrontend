// // import React, { useEffect } from 'react';
// // import { Modal, Button } from 'react-bootstrap';
// // import { Html5QrcodeScanner } from 'html5-qrcode';

// // const QrScanner = ({ onScan, onClose }) => {
// //   useEffect(() => {
// //     const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
// //     scanner.render(
// //       (decodedText) => {
// //         scanner.clear();
// //         onScan(decodedText);
// //       },
// //       (error) => {
// //         // Optionally handle scan errors
// //         console.warn(error);
// //       }
// //     );
// //     return () => scanner.clear();
// //   }, [onScan]);

// //   return (
// //     <Modal show centered size="lg" onHide={onClose}>
// //       <Modal.Header closeButton>
// //         <Modal.Title className="text-successs">
// //           <i className="bi bi-qr-code-scan  me-2"></i>Scan QR Code
// //         </Modal.Title>
// //       </Modal.Header>
// //       <Modal.Body>
// //         <div className="d-flex flex-column align-items-center">
// //           <i className="bi bi-qr-code" style={{ fontSize: '5rem', color: '#0d6efd' }}></i>
// //           <div id="reader" style={{ width: '100%', maxWidth: '400px' }} className="mt-3"></div>
// //         </div>
// //       </Modal.Body>
// //       <Modal.Footer>
// //         <Button variant="outline-secondary" onClick={onClose}>
// //           <i className="bi bi-x-circle me-2"></i>Close Scanner
// //         </Button>
// //       </Modal.Footer>
// //     </Modal>
// //   );
// // };

// // export default QrScanner;



// import React, { useEffect } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import { Html5QrcodeScanner } from 'html5-qrcode';

// const QRScanner = ({ onScan, onClose, locCode }) => {
//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
//     scanner.render(
//       (decodedText) => {
//         let data;
//         try {
//           data = JSON.parse(decodedText);
//         } catch {
//           data = decodedText;
//         }

//         // Example filtering logic:
//         // If data is an object and has locCode property matching user's locCode
//         if (
//           (typeof data === 'object' && data.locCode === locCode) ||
//           // Or if data is string and contains locCode substring
//           (typeof data === 'string' && data.includes(locCode))
//         ) {
//           scanner.clear();
//           onScan(data);
//         } else {
//           // Ignore or optionally alert user
//           console.warn("Scanned QR code doesn't belong to your store location.");
//           // You can show a toast or alert here if you want
//         }
//       },
//       (error) => {
//         console.warn("QR scan error:", error);
//       }
//     );
//     return () => {
//       scanner.clear();
//     };
//   }, [onScan, locCode]);

//   return (
//     <Modal show centered size="lg" onHide={onClose}>
//       <Modal.Header closeButton>
//         <Modal.Title className="text-successs">
//           <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="d-flex flex-column align-items-center">
//           <i className="bi bi-qr-code" style={{ fontSize: '5rem', color: '#0d6efd' }}></i>
//           <div id="reader" style={{ width: '100%', maxWidth: '400px' }} className="mt-3"></div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="outline-secondary" onClick={onClose}>
//           <i className="bi bi-x-circle me-2"></i>Close Scanner
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default QRScanner;




import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { BrowserMultiFormatReader } from '@zxing/library';

const ZXingQRScanner = ({ onScan, onClose, locCode }) => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        // Use the first camera, or choose based on device kind or label if you want
        const firstDeviceId = videoInputDevices[0]?.deviceId;

        if (firstDeviceId) {
          codeReader.current.decodeFromVideoDevice(
            firstDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                let data;
                try {
                  data = JSON.parse(result.getText());
                } catch {
                  data = result.getText();
                }

                const validScan =
                  (typeof data === 'object' && data.locCode === locCode) ||
                  (typeof data === 'string' && data.includes(locCode));

                if (validScan) {
                  codeReader.current.reset(); // stop scanning
                  onScan(data);
                } else {
                  console.warn("Scanned QR code doesn't belong to your store location.");
                }
              }
              if (err && !(err.name === 'NotFoundException')) {
                console.error('QR scan error:', err);
              }
            }
          );
        } else {
          console.error('No video input devices found');
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [onScan, locCode]);

  return (
    <Modal show centered size="lg" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-success">
          <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={() => {
            if (codeReader.current) codeReader.current.reset();
            onClose();
          }}
        >
          <i className="bi bi-x-circle me-2"></i>Close Scanner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ZXingQRScanner;



