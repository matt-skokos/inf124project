import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./SocialModal.css";

const SocialModal = ({isOpen, onClose}) => {

  const [copied, setCopied] = useState(false);

  // the URL we’ll share/copy
  const shareUrl = window.location.href;

  const handleFacebookShare = () => {
    const fbUrl =
      `https://www.facebook.com/sharer/sharer.php` +
      `?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const modal = (
        <div className="social-modal-overlay" onClick={onClose}>
          <div className="social-modal" onClick={e => e.stopPropagation()}>
            
            {/* modal header */}
            <header className="social-modal-header">
              <h3>Share Surf Report</h3>
              <button className="social-modal-close-btn" onClick={onClose}>
                <i className="bi bi-x-lg"></i>
              </button>
            </header>
            
            {/* modal body */}
            <div className="social-modal-body">

              <div className="social-buttons">
                <button 
                  className="social-btn facebook"
                  onClick={handleFacebookShare}
                >
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </button>

                <button 
                  className="social-btn copy-link"
                  onClick={handleCopyLink}
                >
                  <i className="bi bi-link-45deg"></i>
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
  )

  return (
    <>
      {isOpen && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default SocialModal;
