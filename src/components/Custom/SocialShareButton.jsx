import React, { useState } from "react";
import "./SocialShareButton.css";

const SocialShareButton = ({ color = "#23718f", size = 40 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Close modal if clicked outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("social-modal-overlay")) {
      closeModal();
    }
  };

  return (
    <>
      <button
        type="button"
        className="social-share-btn"
        aria-label="Share"
        onClick={openModal}
        style={{
          borderRadius: "50%",
          aspectRatio: "1/1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          padding: 0,
          color: color,
          borderColor: color,
          backgroundColor: "transparent",
        }}
      >
        <i
          className="bi bi-share-fill"
          style={{ fontSize: `${size * 0.6}px` }}
        ></i>
      </button>

      {isModalOpen && (
        <div className="social-modal-overlay" onClick={handleOutsideClick}>
          <div className="social-modal">
            <div className="social-modal-header">
              <h3>Share This Spot</h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="social-modal-body">
              <p>Share this surf spot with your friends</p>

              <div className="social-buttons">
                <button className="social-btn facebook">
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </button>

                <button className="social-btn instagram">
                  <i className="bi bi-instagram"></i>
                  <span>Instagram</span>
                </button>

                <button className="social-btn twitter">
                  <i className="bi bi-twitter-x"></i>
                  <span>Twitter</span>
                </button>

                <button className="social-btn copy-link">
                  <i className="bi bi-link-45deg"></i>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShareButton;
