import React, { useRef, useEffect } from 'react';
import { Button } from './ui/moving-border';

interface TransactionPopupProps {
  txHash: string | null;
  show: boolean;
  onClose: () => void;
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({ txHash, show, onClose }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="popup" ref={popupRef}>
      <div className="popup-content">
        {txHash ? (
          <div>
            <p>Transaction Hash:</p>
            <a
              href={`https://explorer.testnet.osmosis.zone/txs/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </div>
        ) : (
          <p>Transaction Failed</p>
        )}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default TransactionPopup;
