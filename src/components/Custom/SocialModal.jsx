import "./SocialModal.css";
import ReactDOM from 'react-dom';

const SocialModal = ({isOpen, onClose}) => {

  const modal = (
        <div className="social-modal-overlay" onClick={onClose}>
          <div className="social-modal" onClick={e => e.stopPropagation()}>
            
            {/* modal header */}
            <header className="social-modal-header">
              <h3>Share This Spot</h3>
              <button className="social-modal-close-btn" onClick={onClose}>
                <i className="bi bi-x-lg"></i>
              </button>
            </header>
            
            {/* modal body */}
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
  )

  return (
    <>
      {isOpen && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

export default SocialModal;
