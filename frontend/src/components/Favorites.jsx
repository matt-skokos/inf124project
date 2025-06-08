
import { useEffect, useState } from 'react';
import { ConditionOverview } from './Home';
import { useSurfConditions } from '../hooks/useSurfConditions';
import PageContainer from './Custom/PageContainer';
import ContentCard from './Custom/ContentCard';
import NotificationButton from './Custom/NotificationButton';
import API from '../api';
import './Favorites.css';

function FavoriteCard({ name, lat, lng }) {

  const [schedule, setSchedule] = useState({});

  const {
      conditions : waveCond,
      loading: waveLoading,
      error: waveError,
  } = useSurfConditions(lat, lng, "wave");
  const {
      conditions : windCond,
      loading: windLoading,
      error: windError,
  } = useSurfConditions(lat, lng, "wind");
  const {
      conditions : tideCond,
      loading: tideLoading,
      error: tideError,
  } = useSurfConditions(lat, lng, "tide");

    // If any of the three is still loading, show a loading state
  if (waveLoading || windLoading || tideLoading) {return(
      <div className="d-flex align-items-center">
          <strong>Loading favorite...</strong>
          <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
      </div>
  );}

  // If any of the three has an error, show an error message
  if (waveError || windError || tideError) {return (
      <p className="text-danger">
          {waveError && `Wave data error: ${waveError}`}
          {windError && `Wind data error: ${windError}`}
          {tideError && `Tide data error: ${tideError}`}
      </p>
  );}

  return(
    <ContentCard key={name} className="favorite-card">
      <div className="favorite-details-cell">
        <div className="favorite-header">
          <h3 className="favorite-name mb-0">{name}</h3>
          <NotificationButton
            schedule={schedule}
            onSaveNotification={sched =>
              console.log('Saved schedule for', name, sched)
            }
          />
        </div>

        <div className="favorite-bottom-row">

          <div className="favorite-conditions">
            <ConditionOverview icon="bi bi-tsunami" label="Swell">
              <p>
                  {waveCond.waveDirection}
                  <br />
                  {waveCond.waveHeight} ft
              </p>
            </ConditionOverview>

            <ConditionOverview icon="bi bi-wind" label="Wind">
              <p>
                  {windCond.windDirection}
                  <br />
                  {windCond.wind}
              </p>
            </ConditionOverview>

            <ConditionOverview icon="bi bi-water" label="Tide">
              <p>
                  {tideCond.tide}
                  <br />
                  {tideCond.tideTime}
              </p>
            </ConditionOverview>
          </div>
        </div>
      </div>
    </ContentCard>
  )

}

export default function Favorites() {

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFavorites (){
      setLoading(true);
      try{
        const res = await API.get("/favorites");
        setFavorites(res.data.favorites);
      }catch(err){
        console.error("Unable to fetch favorites from firestore db."); 
        setError("Unable to fetch favorites from firestore db.");
      }finally{
        setLoading(false)
      }
    } 
    fetchFavorites();
  }, [])

  return (
    <PageContainer title="Favorites" className="favorites-page">
      {loading && (
          <div className="d-flex align-items-center">
              <strong>Loading favorites...</strong>
              <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
          </div>
      )}

      {(!loading && error) && (
        <p className="text-danger">
            Error loading favorites
        </p>
      )}
      
      {(!loading && !error && favorites) && (
        favorites.map(spot => (
          // <p> {spot.name} {spot.location._latitude} {spot.location._longitude}</p>
          <FavoriteCard
            key={spot.id}
            name={spot.name}
            lat={spot.location._latitude}
            lng={spot.location._longitude}
          />
        ))
      )}
    </PageContainer>
  );
}
