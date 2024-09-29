import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: React.ReactNode; // Title as optional prop
  footer?: React.ReactNode; // Footer as optional prop
  children: React.ReactNode; // Main content of the modal
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, title, footer, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-[#141414] rounded-lg px-2 py-4 max-w-md w-full relative" data-aos="fade-up">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal Title */}
        {title && <div className="text-xl font-semibold mb-4">{title}</div>}

        {/* Modal Content */}
        <div className="mb-0">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
