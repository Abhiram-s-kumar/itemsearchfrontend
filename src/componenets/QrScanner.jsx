import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onScan, onClose, locCode }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render(
      (decodedText) => {
        // Assuming decodedText contains JSON or a string with locCode info
        let data;
        try {
          data = JSON.parse(decodedText); // parse if JSON
        } catch {
          data = decodedText; // treat as plain string if not JSON
        }

        // Check if data has locCode matching user’s locCode
        // Adjust this condition based on your QR code data structure
        if (typeof data === 'object' && data.locCode === locCode) {
          scanner.clear();
          onScan(data);
        } else if (typeof data === 'string' && data.includes(locCode)) {
          scanner.clear();
          onScan(data);
        } else {
          console.warn("Scanned data does not match user's store location");
          // optionally notify user or ignore silently
        }
      },
      (error) => {
        console.warn(error);
      }
    );
    return () => scanner.clear();
  }, [onScan, locCode]);

  return (
    <Modal show centered size="lg" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-successs">
          <i className="bi bi-qr-code-scan  me-2"></i>Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <i className="bi bi-qr-code" style={{ fontSize: '5rem', color: '#0d6efd' }}></i>
          <div id="reader" style={{ width: '100%', maxWidth: '400px' }} className="mt-3"></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          <i className="bi bi-x-circle me-2"></i>Close Scanner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QrScanner;
