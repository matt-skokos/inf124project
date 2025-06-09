
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConditionOverview } from './Home';
import { useSurfConditions } from '../hooks/useSurfConditions';
import PageContainer from './Custom/PageContainer';
import ContentCard from './Custom/ContentCard';
import NotificationButton from './Custom/NotificationButton';
import Button from './Custom/Button';
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
            spotName={name}
            surfConditions={{
              wave: waveCond,
              wind: windCond,
              tide: tideCond
            }}
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
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFavorites (){
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('ID_TOKEN');
      if (!token) {
        setError("You must be logged in to view favorites. Please log in first.");
        setLoading(false);
        return;
      }

      try{
        const res = await API.get("/favorites");
        setFavorites(res.data.favorites);
      }catch(err){
        console.error("Unable to fetch favorites from firestore db:", err); 
        let errorMessage = "Unable to fetch favorites from firestore db.";

        if (err.response) {
          // Server responded with error status
          if (err.response.status === 401) {
            errorMessage = "Authentication failed. Please log out and log back in.";
          } else {
            errorMessage = `Server error: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`;
          }
        } else if (err.request) {
          // Network error - request was made but no response received
          errorMessage = "Network error: Unable to connect to server. Please check if the backend is running.";
        } else {
          // Something else went wrong
          errorMessage = `Error: ${err.message}`;
        }

        setError(errorMessage);
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
        <ContentCard>
          <p className="text-danger mb-3">
              {error}
          </p>
          {error.includes("must be logged in") && (
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          )}
          {error.includes("Authentication failed") && (
            <div className="d-flex gap-2">
              <Button 
                onClick={() => {
                  localStorage.removeItem('ID_TOKEN');
                  localStorage.removeItem('UID');
                  navigate('/login');
                }}
              >
                Clear Auth & Login
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Try Again
              </Button>
            </div>
          )}
        </ContentCard>
      )}
      
      {(!loading && !error && favorites) && (
        favorites.length === 0 ? (
          <ContentCard>
            <p className="text-center mb-3">
              You haven't added any favorites yet.
            </p>
            <div className="text-center">
              <Button onClick={() => navigate('/explore')}>
                Explore Surf Spots
              </Button>
            </div>
          </ContentCard>
        ) : (
          favorites.map(spot => (
            // <p> {spot.name} {spot.location._latitude} {spot.location._longitude}</p>
            <FavoriteCard
              key={spot.id}
              name={spot.name}
              lat={spot.location._latitude}
              lng={spot.location._longitude}
            />
          ))
        )
      )}
    </PageContainer>
  );
}
