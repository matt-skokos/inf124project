import React from 'react';
import ContentCard from './Custom/ContentCard';
import { ConditionOverview } from './Home';
import NotificationButton from './Custom/NotificationButton';
import './Favorites.css';

const mockFavorites = [
  {
    name: 'Rockpile',
    imgSrc: '/images/rockpile.jpg',
    swell: { dir: 'SSW', val: '2-3 ft' },
    wind:  { dir: 'SSW', val: '4 mph' },
    tide:  'Low',
    schedule: {},
  },
  {
    name: 'Brooks Street',
    imgSrc: '/images/brooks.jpg',
    swell: { dir: 'NW',  val: '>1 ft' },
    wind:  { dir: 'SSW', val: '4 mph' },
    tide:  'Low',
    schedule: {},
  },
  {
    name: 'Thalia Street',
    imgSrc: '/images/thalia.jpg',
    swell: { dir: 'SSW', val: '3-4 ft' },
    wind:  { dir: 'W',   val: '6 mph' },
    tide:  'Low',
    schedule: {},
  },
];

export default function Favorites() {
  return (
    <main className="container favorites-page">
      <h2 className="section-title mb-4">Favorites</h2>

      {mockFavorites.map((spot) => (
        <ContentCard key={spot.name} className="favorite-card">
          {/* 1. Image Panel */}
          <div className="favorite-image-cell">
            <img src={spot.imgSrc} alt={spot.name} />
          </div>

          {/* 2. Details Panel */}
          <div className="favorite-details-cell">
            {/* Header: Name + Bell */}
            <div className="favorite-header d-flex align-items-center justify-content-between mb-2">
              <h3 className="favorite-name mb-0">{spot.name}</h3>
              <NotificationButton
                schedule={spot.schedule}
                onSaveNotification={(sched) =>
                  console.log('Saved schedule for', spot.name, sched)
                }
              />
            </div>

            {/* Conditions Row */}
            <div className="favorite-conditions d-flex justify-content-around">
              <ConditionOverview icon="bi bi-tsunami" label="Swell">
                <p>
                  {spot.swell.dir}<br />
                  {spot.swell.val}
                </p>
              </ConditionOverview>

              <ConditionOverview icon="bi bi-wind" label="Wind">
                <p>
                  {spot.wind.dir}<br />
                  {spot.wind.val}
                </p>
              </ConditionOverview>

              <ConditionOverview icon="bi bi-water" label="Tide">
                <p>{spot.tide}</p>
              </ConditionOverview>
            </div>
          </div>
        </ContentCard>
      ))}
    </main>
  );
}
