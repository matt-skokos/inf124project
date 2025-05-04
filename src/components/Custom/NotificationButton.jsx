
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './NotificationButton.css';

const DAYS = ['S','M','T','W','T','F','S'];

export default function NotificationButton({ schedule = {}, onSaveNotification }) {
  const [show, setShow] = useState(false);
  const [selectedDays, setSelectedDays] = useState(schedule.days || Array(7).fill(false));
  const [period, setPeriod] = useState(schedule.period || 'Morning');

  const toggleDay = i => {
    const copy = [...selectedDays];
    copy[i] = !copy[i];
    setSelectedDays(copy);
  };

  const handleSave = () => {
    onSaveNotification({ days: selectedDays, period });
    setShow(false);
  };
  const modal = (
    <div className="modal-backdrop" onClick={() => setShow(false)}>
      <div className="notification-modal" onClick={e => e.stopPropagation()}>
        <h4 className="modal-title">Notification</h4>

        <div className="day-toggles">
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={`day-toggle ${selectedDays[i] ? 'active' : ''}`}
              onClick={() => toggleDay(i)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="time-selector">
          {['Morning', 'Evening'].map(tp => (
            <button
              key={tp}
              className={`time-btn ${period === tp ? 'active' : ''}`}
              onClick={() => setPeriod(tp)}
            >
              {tp}
            </button>
          ))}
        </div>

        <button className="btn save-btn" onClick={handleSave}>
          Save
        </button>

        <button
          className="btn btn-link close-btn"
          onClick={() => setShow(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="btn btn-link notifications-button"
        onClick={() => setShow(true)}
        aria-label="Open notification settings"
      >
        <i className="bi bi-bell"></i>
      </button>
      {show && ReactDOM.createPortal(modal, document.body)}
    </>
  );
}
