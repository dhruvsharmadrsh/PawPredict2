import React, { useState, useRef, useCallback } from 'react';

const FileUpload = ({
  onFileSelect,
  onError,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className = '',
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  // File validation function
  const validateFile = useCallback(
    (file) => {
      if (!acceptedTypes.includes(file.type)) {
        const acceptedFormats = acceptedTypes
          .map((type) => type.split('/')[1].toUpperCase())
          .join(', ');
        onError(`Please upload a valid image file (${acceptedFormats})`);
        return false;
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
        onError(`File size must be less than ${maxSizeMB}MB`);
        return false;
      }

      return true;
    },
    [acceptedTypes, maxSize, onError]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (file) => {
      if (!file || disabled) return;

      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect, disabled]
  );

  // Drag event handlers
  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setDragCounter((prev) => prev + 1);
      if (dragCounter === 0) {
        setIsDragging(true);
      }
    },
    [dragCounter, disabled]
  );

  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setDragCounter((prev) => {
        const newCounter = prev - 1;
        if (newCounter === 0) {
          setIsDragging(false);
        }
        return newCounter;
      });
    },
    [disabled]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setDragCounter(0);
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect, disabled]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    },
    [handleFileSelect]
  );

  // Open file dialog
  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Reset drag counter on mount
  React.useEffect(() => {
    setDragCounter(0);
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`file-upload-container ${className} ${
        isDragging ? 'dragging' : ''
      } ${disabled ? 'disabled' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={openFileDialog}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload file area"
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          openFileDialog();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        disabled={disabled}
        className="file-input-hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {children || (
        <div className="default-upload-content">
          <div className="upload-icon">{isDragging ? '📥' : '📁'}</div>
          <div className="upload-text">
            <h3>{isDragging ? 'Drop your file here' : 'Upload File'}</h3>
            <p>
              {isDragging
                ? 'Release to upload'
                : 'Drag and drop or click to browse'}
            </p>
            <div className="file-requirements">
              <span>
                {acceptedTypes
                  .map((type) => type.split('/')[1].toUpperCase())
                  .join(', ')}
              </span>
              <span>•</span>
              <span>Max {(maxSize / 1024 / 1024).toFixed(1)}MB</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          border: 3px dashed #cbd5e0;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(248, 250, 252, 0.5);
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .file-upload-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(102, 126, 234, 0.1),
            transparent
          );
          transition: left 0.5s ease;
        }

        .file-upload-container:hover::before {
          left: 100%;
        }

        .file-upload-container:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .file-upload-container:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .file-upload-container.dragging {
          border-color: #48bb78;
          background: rgba(72, 187, 120, 0.1);
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(72, 187, 120, 0.2);
        }

        .file-upload-container.dragging::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(72, 187, 120, 0.2),
            transparent
          );
        }

        .file-upload-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        .file-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .default-upload-content {
          position: relative;
          z-index: 1;
          pointer-events: none;
        }

        .upload-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .file-upload-container.dragging .upload-icon {
          animation: shake 0.5s ease-in-out;
          transform: scale(1.1);
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) scale(1.1);
          }
          25% {
            transform: translateX(-5px) scale(1.1);
          }
          75% {
            transform: translateX(5px) scale(1.1);
          }
        }

        .upload-text h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .upload-text p {
          font-size: 1rem;
          color: #718096;
          margin-bottom: 1rem;
        }

        .file-requirements {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #a0aec0;
          font-weight: 500;
        }

        .file-upload-container.dragging .upload-text h3 {
          color: #48bb78;
        }

        .file-upload-container.dragging .upload-text p {
          color: #38a169;
        }

        /* Pulse effect for better visual feedback */
        .file-upload-container:active {
          transform: scale(0.98);
        }

        /* Enhanced focus styles for better accessibility */
        .file-upload-container:focus-visible {
          outline: 3px solid #667eea;
          outline-offset: 2px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .file-upload-container {
            padding: 1.5rem;
            min-height: 150px;
          }

          .upload-icon {
            font-size: 2.5rem;
          }

          .upload-text h3 {
            font-size: 1.25rem;
          }

          .upload-text p {
            font-size: 0.875rem;
          }

          .file-requirements {
            flex-direction: column;
            gap: 0.25rem;
          }
        }

        @media (max-width: 480px) {
          .file-upload-container {
            padding: 1rem;
            min-height: 120px;
          }

          .upload-icon {
            font-size: 2rem;
            margin-bottom: 0.75rem;
          }

          .upload-text h3 {
            font-size: 1.125rem;
          }

          .file-requirements {
            font-size: 0.75rem;
          }
        }

        /* Reduced motion accessibility */
        @media (prefers-reduced-motion: reduce) {
          .file-upload-container,
          .upload-icon,
          .file-upload-container::before {
            animation: none;
            transition: none;
          }

          .file-upload-container:hover {
            transform: none;
          }

          .file-upload-container.dragging {
            transform: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .file-upload-container {
            border-color: #000;
            background: #fff;
          }

          .file-upload-container:hover,
          .file-upload-container.dragging {
            border-color: #000;
            background: #f0f0f0;
          }

          .upload-text h3,
          .upload-text p {
            color: #000;
          }
        }

        /* Print styles */
        @media print {
          .file-upload-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
