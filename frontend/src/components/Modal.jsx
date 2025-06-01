import React from 'react';

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">&times;</button>
        {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal; 