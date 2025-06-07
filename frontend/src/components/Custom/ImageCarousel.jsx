import { useEffect, useState } from "react"
import './ImageCarousel.css';

function ImageCarousel({ locationName })
{
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationName) {
        setError("No location provided");
        setLoading(false); 
        return;
    }

    const fetchPhotos = async () => {
        setLoading(true); 
        setError(null); 

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/location/photos?loc=${locationName}`);
            // res.data.photos is an array of { url, originalWidth, originalHeight }
            const data = await res.json()
            setPhotos(data);
        } catch (err) {
            console.error("Error fetching photos:", err);
            setError("Unable to load photos");
        }finally{
            setLoading(false);
        }
    };

    fetchPhotos();
  }, [locationName]);

    if (loading){
        return(
            <div className="d-flex align-items-center">
                <strong>"Loading images......</strong>
                <div className="spinner-border ms-auto" role="status" aria-hidden="true"/>
            </div>        
        )
    }
    if (!loading && error) {
        return <div className="text-danger">{error}</div>;
    }
    if (photos.length === 0){
        return <div className="text-warning">No photos available for "{locationName}".</div>;
    }
    
    return (
        // Image Carousel
        <div 
            id="carouselExampleIndicators" 
            className="carousel slide rounded-3 overflow-hidden mx-auto mb-2"
            data-bs-ride="carousel"
        >

            {/* Indicators */}
            <div className="carousel-indicators">
                {photos.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        data-bs-target={`#carouselExampleIndicators`}
                        data-bs-slide-to={idx}
                        className={idx === 0 ? "active" : ""}
                        aria-current={idx === 0 ? "true" : undefined}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Slides */}
            <div className="carousel-inner">
                {photos.map((photo, idx) => (
                    <div
                        key={idx}
                        className={`carousel-item ${idx === 0 ? "active" : ""}`}
                    >
                        <img
                            src={photo.url}
                            className="carousel-image d-block w-100"
                            alt={`${locationName} photo ${idx + 1}`}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Prev and next buttons */}
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
)}

export default ImageCarousel;