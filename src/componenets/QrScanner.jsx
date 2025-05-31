import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose, locCode }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const verbose = false;

    // Create scanner instance
    const html5QrcodeScanner = new Html5Qrcode('reader', verbose);

    // Start camera and scanning
    html5QrcodeScanner
      .start(
        { facingMode: "environment" }, // Use rear camera
        config,
        (decodedText, decodedResult) => {
          // console.log('Decoded text:', decodedText);
          let data;
          try {
            data = JSON.parse(decodedText);
          } catch {
            data = decodedText;
          }

          const validScan =
            (typeof data === 'object' && data.locCode === locCode) ||
            (typeof data === 'string' && data.includes(locCode));

          if (validScan) {
            html5QrcodeScanner.stop().then(() => {
              onScan(data);
            });
          } else {
            console.warn("Scanned QR code doesn't belong to your store location.");
            // Optional: you can alert the user here
          }
        },
        (errorMessage) => {
          // Optional: console.log('QR scan error:', errorMessage);
        }
      )
      .catch((err) => {
        console.error('Unable to start scanning:', err);
      });

    scannerRef.current = html5QrcodeScanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { /* ignore errors */ });
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
      <Modal.Body>
        <div
          id="reader"
          style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}
          className="mt-3"
        ></div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => {
          if (scannerRef.current) {
            scannerRef.current.stop().finally(() => {
              onClose();
            });
          } else {
            onClose();
          }
        }}>
          <i className="bi bi-x-circle me-2"></i>Close Scanner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;
