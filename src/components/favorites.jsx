
import React, { useState } from 'react';
import PageContainer from './Custom/PageContainer';      
import ContentCard from './Custom/ContentCard';
import { ConditionOverview } from './Home';
import NotificationButton from './Custom/NotificationButton';
import './Favorites.css';

const mockFavorites = [
  { name: 'Rockpile',      swell: { dir: 'SSW', val: '2-3 ft' }, wind: { dir: 'SSW', val: '4 mph' }, tide: 'Low', schedule: {} },
  { name: 'Brooks Street', swell: { dir: 'NW',  val: '>1 ft' }, wind: { dir: 'SSW', val: '4 mph' }, tide: 'Low', schedule: {} },
  { name: 'Thalia Street', swell: { dir: 'SSW', val: '3-4 ft' }, wind: { dir: 'W',   val: '6 mph' }, tide: 'Low', schedule: {} },
];

const seededFavorites = mockFavorites.map(spot => ({
  ...spot,
  imgSrc: `https://picsum.photos/seed/${Math.floor(Math.random() * 1e6)}/300/300`
}));

export default function Favorites() {

  const [favorites] = useState(seededFavorites);

  return (
    <PageContainer title="Favorites" className="favorites-page">
      {favorites.map(spot => (
        <ContentCard key={spot.name} className="favorite-card">
          <div className="favorite-details-cell">
            {}
            <div className="favorite-header">
              <h3 className="favorite-name mb-0">{spot.name}</h3>
              <NotificationButton
                schedule={spot.schedule}
                onSaveNotification={sched =>
                  console.log('Saved schedule for', spot.name, sched)
                }
              />
            </div>

            {}
            <div className="favorite-bottom-row">
              <div className="favorite-image-cell">
                <img
                  src={spot.imgSrc}
                  srcSet={`${spot.imgSrc} 1x, ${spot.imgSrc.replace('/300/300','/600/600')} 2x`}
                  width={150}
                  height={150}
                  alt={spot.name}
                  className="favorite-image"
                />
              </div>

              <div className="favorite-conditions">
                <ConditionOverview icon="bi bi-tsunami" label="Swell">
                  <p>{spot.swell.dir}<br />{spot.swell.val}</p>
                </ConditionOverview>

                <ConditionOverview icon="bi bi-wind" label="Wind">
                  <p>{spot.wind.dir}<br />{spot.wind.val}</p>
                </ConditionOverview>

                <ConditionOverview icon="bi bi-water" label="Tide">
                  <p>{spot.tide}</p>
                </ConditionOverview>
              </div>
            </div>
          </div>
        </ContentCard>
      ))}
    </PageContainer>
  );
}
