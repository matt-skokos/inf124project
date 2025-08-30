
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './NotificationButton.css';

const DAYS = ['S','M','T','W','T','F','S'];

export default function NotificationButton({ schedule = {}, onSaveNotification, spotName, surfConditions }) {
  const [show, setShow] = useState(false);
  const [selectedDays, setSelectedDays] = useState(schedule.days || Array(7).fill(false));
  const [period, setPeriod] = useState(schedule.period || 'Morning');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are already enabled
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);



  const scheduleNotifications = (scheduleData) => {
    const { days, period } = scheduleData;
    
    // Clear any existing notifications for this spot
    const existingKey = `notifications-${spotName}`;
    const existingSchedule = JSON.parse(localStorage.getItem(existingKey) || '[]');
    
    // Cancel existing timeouts
    existingSchedule.forEach(item => {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
      }
    });

    const newSchedule = [];
    const now = new Date();

    days.forEach((isSelected, dayIndex) => {
      if (!isSelected) return;

      // Calculate the next occurrence of this day
      const targetDay = dayIndex; // 0 = Sunday, 1 = Monday, etc.
      const currentDay = now.getDay();
      
      let daysUntilTarget = targetDay - currentDay;
      if (daysUntilTarget <= 0) {
        daysUntilTarget += 7; // Next week
      }

      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() + daysUntilTarget);
      
      // Set the time based on period
      if (period === 'Morning') {
        targetDate.setHours(8, 0, 0, 0); // 8:00 AM
      } else {
        targetDate.setHours(18, 0, 0, 0); // 6:00 PM
      }

      const timeUntilNotification = targetDate.getTime() - now.getTime();
      
      if (timeUntilNotification > 0) {
        const timeoutId = setTimeout(() => {
          showNotification(spotName, period);
          // Reschedule for next week
          scheduleNotifications(scheduleData);
        }, timeUntilNotification);

        newSchedule.push({
          day: DAYS[dayIndex],
          period,
          scheduledFor: targetDate.toISOString(),
          timeoutId
        });
      }
    });

    // Save schedule to localStorage
    localStorage.setItem(existingKey, JSON.stringify(newSchedule));
  };

  const showNotification = (spot, timeOfDay) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(`🏄‍♂️ Surf Check Time!`, {
        body: `Time to check the surf conditions at ${spot}. Have a great ${timeOfDay.toLowerCase()} session!`,
        icon: '/favicon.ico',
        tag: `surf-${spot}-${timeOfDay}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  };

  const showTestNotification = () => {
    console.log('Test notification button clicked!');
    console.log('Notification permission:', Notification.permission);
    console.log('Spot name:', spotName);
    console.log('Surf conditions:', surfConditions);

    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    if (Notification.permission !== 'granted') {
      alert('Notifications not enabled. Please allow notifications first.');
      return;
    }

    // Create conditions summary
    let conditionsText = `Check current surf conditions`;
    
    if (surfConditions && surfConditions.wave && surfConditions.wind && surfConditions.tide) {
      const { wave, wind, tide } = surfConditions;
      conditionsText = `🌊 ${wave.waveHeight} ft ${wave.waveDirection} • 💨 ${wind.wind} ${wind.windDirection} • 🌊 ${tide.tide}`;
    }

    try {
      const notification = new Notification(`🏄‍♂️ ${spotName} Surf Update`, {
        body: conditionsText,
        icon: '/favicon.ico',
        tag: `surf-test-${spotName}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 15 seconds for test
      setTimeout(() => {
        notification.close();
      }, 15000);

      console.log('Test notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Error creating notification: ' + error.message);
    }
  };

  const handleBellClick = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
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

  const handleSave = () => {
    const scheduleData = { days: selectedDays, period };
    
    if (notificationsEnabled) {
      scheduleNotifications(scheduleData);
    }
    
    onSaveNotification(scheduleData);
    setShow(false);
  };
  const modal = (
    <div className="modal-backdrop" onClick={() => setShow(false)}>
      <div className="notification-modal" onClick={e => e.stopPropagation()}>
        <h4 className="modal-title">Notification Schedule</h4>
        
        {spotName && (
          <p className="spot-name">Set notifications for <strong>{spotName}</strong></p>
        )}

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
              {tp} ({tp === 'Morning' ? '8:00 AM' : '6:00 PM'})
            </button>
          ))}
        </div>

        {notificationsEnabled && (
          <div className="notification-info">
            <small className="text-success">
              ✓ Browser notifications are enabled
            </small>
            <button 
              className="btn test-btn"
              onClick={showTestNotification}
            >
              Test Notification Now
            </button>
          </div>
        )}

        <div className="modal-actions">
          <button 
            className="btn save-btn" 
            onClick={handleSave}
            disabled={!selectedDays.some(day => day)}
          >
            Save Schedule
          </button>

          <button
            className="btn btn-link close-btn"
            onClick={() => setShow(false)}
            aria-label="Close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={`btn btn-link notifications-button ${notificationsEnabled ? 'enabled' : ''}`}
        onClick={handleBellClick}
        aria-label={notificationsEnabled ? "Manage notifications" : "Enable notifications"}
        title={notificationsEnabled ? "Notifications enabled" : "Click to enable notifications"}
      >
        <i className={`bi ${notificationsEnabled ? 'bi-bell-fill' : 'bi-bell'}`}></i>
      </button>
      {show && ReactDOM.createPortal(modal, document.body)}
    </>
  );
}
