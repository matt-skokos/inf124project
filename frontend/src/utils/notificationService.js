// Notification Service for managing surf spot notifications

export const notificationService = {
  
  // Initialize and restore any scheduled notifications on page load
  init() {
    this.restoreScheduledNotifications();
  },

  // Restore notifications that were scheduled before page refresh
  restoreScheduledNotifications() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // Get all notification keys from localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('notifications-'));
    
    keys.forEach(key => {
      const spotName = key.replace('notifications-', '');
      const schedule = JSON.parse(localStorage.getItem(key) || '[]');
      
      schedule.forEach(notification => {
        const scheduledTime = new Date(notification.scheduledFor);
        const now = new Date();
        
        // If the scheduled time has passed, reschedule for next week
        if (scheduledTime <= now) {
          this.scheduleWeeklyNotification(spotName, notification.day, notification.period);
        } else {
          // Reschedule the existing notification
          const timeUntilNotification = scheduledTime.getTime() - now.getTime();
          
          const timeoutId = setTimeout(() => {
            this.showNotification(spotName, notification.period);
            this.scheduleWeeklyNotification(spotName, notification.day, notification.period);
          }, timeUntilNotification);
          
          // Update the timeout ID in localStorage
          notification.timeoutId = timeoutId;
        }
      });
      
      // Save updated schedule
      localStorage.setItem(key, JSON.stringify(schedule));
    });
  },

  // Schedule a notification for a specific day and time, repeating weekly
  scheduleWeeklyNotification(spotName, dayLetter, period) {
    const DAYS = ['S','M','T','W','T','F','S'];
    const dayIndex = DAYS.indexOf(dayLetter);
    
    if (dayIndex === -1) return;
    
    const now = new Date();
    const currentDay = now.getDay();
    
    let daysUntilTarget = dayIndex - currentDay;
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
        this.showNotification(spotName, period);
        // Reschedule for next week
        this.scheduleWeeklyNotification(spotName, dayLetter, period);
      }, timeUntilNotification);

      // Update localStorage with new schedule
      const key = `notifications-${spotName}`;
      const existingSchedule = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Remove any existing notification for this day/period
      const filteredSchedule = existingSchedule.filter(
        item => !(item.day === dayLetter && item.period === period)
      );
      
      // Add new notification
      filteredSchedule.push({
        day: dayLetter,
        period,
        scheduledFor: targetDate.toISOString(),
        timeoutId
      });
      
      localStorage.setItem(key, JSON.stringify(filteredSchedule));
    }
  },

  // Show a notification
  showNotification(spotName, timeOfDay) {
    if (Notification.permission !== 'granted') return;
    
    const notification = new Notification(`🏄‍♂️ Surf Check Time!`, {
      body: `Time to check the surf conditions at ${spotName}. Have a great ${timeOfDay.toLowerCase()} session!`,
      icon: '/favicon.ico',
      tag: `surf-${spotName}-${timeOfDay}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Optionally navigate to the surf spot
    };

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  },

  // Clear all notifications for a specific spot
  clearNotifications(spotName) {
    const key = `notifications-${spotName}`;
    const schedule = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Cancel all timeouts
    schedule.forEach(item => {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
      }
    });
    
    // Remove from localStorage
    localStorage.removeItem(key);
  },

  // Get notification status for a spot
  getNotificationStatus(spotName) {
    const key = `notifications-${spotName}`;
    const schedule = JSON.parse(localStorage.getItem(key) || '[]');
    return schedule.length > 0;
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => notificationService.init());
  } else {
    notificationService.init();
  }
} 