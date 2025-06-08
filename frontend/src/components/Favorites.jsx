// frontend/src/components/Favorites.jsx

import React from 'react';
import API from '../api';
import PageContainer from './Custom/PageContainer';
import ContentCard from './Custom/ContentCard';
import { ConditionOverview } from './Home';
import './Favorites.css';

const mockFavorites = [
  {
    id: 'rockpile',
    name: 'Rockpile',
    swell: { dir: 'SSW', val: '2-3 ft' },
    wind:  { dir: 'SSW', val: '4 mph' },
    tide:  'Low',
  },
  {
    id: 'brooks',
    name: 'Brooks Street',
    swell: { dir: 'NW',  val: '>1 ft' },
    wind:  { dir: 'SSW', val: '4 mph' },
    tide:  'Low',
  },
  {
    id: 'thalia',
    name: 'Thalia Street',
    swell: { dir: 'SSW', val: '3-4 ft' },
    wind:  { dir: 'W',   val: '6 mph' },
    tide:  'Low',
  },
];

export default function Favorites() {
  const handleNotify = async spot => {
    try {
      // Get the current user ID from localStorage
      const userId = localStorage.getItem('UID');
      
      if (!userId) {
        alert('Please log in to receive notifications.');
        return;
      }

      // Send SMS notification using the correct endpoint
      await API.post('/notifications/sms/user', {
        userId: userId,
        body: `🏄‍♂️ Surf Alert for ${spot.name}!\n\nSwell: ${spot.swell.dir} ${spot.swell.val}\nWind: ${spot.wind.dir} ${spot.wind.val}\nTide: ${spot.tide}\n\nTime to surf! 🌊`,
      });
      alert(`Notification sent for ${spot.name}!`);
    } catch (err) {
      console.error(err);
      alert('Failed to send notification. Try again.');
    }
  };

  return (
    <PageContainer>
      {mockFavorites.map(spot => (
        <ContentCard key={spot.id}>
          <div className="favorites-header">
            <h3>{spot.name}</h3>
            <button
              className="btn btn-link notifications-button"
              onClick={() => handleNotify(spot)}
              aria-label={`Notify me about ${spot.name}`}
            >
              <i className="bi bi-bell"></i>
            </button>
          </div>
          
          <div className="favorites-conditions">
            <ConditionOverview icon="bi bi-water" label="Swell">
              <p>{spot.swell.dir}<br />{spot.swell.val}</p>
            </ConditionOverview>
            <ConditionOverview icon="bi bi-wind" label="Wind">
              <p>{spot.wind.dir}<br />{spot.wind.val}</p>
            </ConditionOverview>
            <ConditionOverview icon="bi bi-water" label="Tide">
              <p>{spot.tide}</p>
            </ConditionOverview>
          </div>
        </ContentCard>
      ))}
    </PageContainer>
  );
}
