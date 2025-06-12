import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './NotificationButton.css';

const DAYS = ['S','M','T','W','T','F','S'];

export default function NotificationButton({ schedule = {}, onSaveNotification, spotName }) {
  const [show, setShow] = useState(false);
  const [selectedDays, setSelectedDays] = useState(schedule.days || Array(7).fill(false));
  const [period, setPeriod] = useState(schedule.period || 'Morning');

  // New handler: request permission & show a local notification
  const handleBellClick = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: `You'll get notifications for ${spotName}`,
        });
      }
    }
    setShow(true);
  };

  const toggleDay = i => {
    const copy = [...selectedDays];
    copy[i] = !copy[i];
    setSelectedDays(copy);
  };

  const save = () => {
    const sched = { days: selectedDays, period };
    onSaveNotification(sched);
    setShow(false);
  };

  const modal = (
    <div className="notification-modal-overlay" onClick={() => setShow(false)}>
      <div className="notification-modal" onClick={e => e.stopPropagation()}>
        <h5>Set notification schedule</h5>
        <div className="days-selector">
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={selectedDays[i] ? 'day selected' : 'day'}
              onClick={() => toggleDay(i)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="period-selector">
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShow(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="btn btn-link notifications-button"
        onClick={handleBellClick}
        aria-label="Open notification settings"
      >
        <i className="bi bi-bell"></i>
      </button>
      {show && ReactDOM.createPortal(modal, document.body)}
    </>
  );
}
