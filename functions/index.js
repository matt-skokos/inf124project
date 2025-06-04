const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// Configuration for functions
const standardConfig = {
  memory: "256MB",
  timeoutSeconds: 120,
};

/**
 * Fetches detailed information about a place including multiple images
 * Prioritizes Google Places API results but has reliable fallbacks
 */
exports.getPlaceDetails = functions
  .runWith(standardConfig)
  .https.onRequest((request, response) => {
    return cors(request, response, async () => {
      try {
        // Get query parameters
        const name = request.query.name;
        const vicinity = request.query.vicinity || "";

        if (!name) {
          return response
            .status(400)
            .json({ error: "Missing place name parameter" });
        }

        // Get API key from Firebase config
        const apiKey = functions.config().googleplaces.key;
        if (!apiKey) {
          return response.json(generateFallbackResult(name));
        }

        // Store all API responses for debugging
        const apiResponses = [];

        // Try a variety of search terms to maximize chances of finding the right place
        const searchTerms = [
          `${name} surf spot ${vicinity}`, // Most specific
          `${name} beach ${vicinity}`, // Try as a beach
          `${name} ${vicinity}`, // More general
          name, // Just the name as fallback
        ];

        let place = null;

        // Try each search term until we find a good result
        for (const term of searchTerms) {
          try {
            console.log(`Searching Places API for: "${term}"`);

            const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
              term
            )}&key=${apiKey}`;
            const searchResponse = await axios.get(searchUrl);

            // Log the response for debugging
            const results = searchResponse.data.results || [];
            apiResponses.push({
              term,
              status: searchResponse.data.status,
              resultCount: results.length,
              hasPhotos: results.length > 0 ? !!results[0].photos : false,
            });

            // If we found any results
            if (results.length > 0) {
              // Find first result with photos if possible
              const placeWithPhotos = results.find(
                (p) => p.photos && p.photos.length > 0
              );
              place = placeWithPhotos || results[0];

              if (placeWithPhotos) {
                console.log(`Found place with photos using term: "${term}"`);
                break; // Exit loop when we find a good result with photos
              } else if (!place) {
                place = results[0]; // Take the first result if we haven't found any yet
              }
            }
          } catch (error) {
            console.error(`Error searching for "${term}": ${error.message}`);
            // Continue to next search term
          }
        }

        // Log all API responses for debugging
        console.log(
          `API search responses for "${name}":`,
          JSON.stringify(apiResponses)
        );

        // Create result object
        const result = {
          name: place ? place.name : name,
          formatted_address: place ? place.formatted_address || "" : "",
          place_id: place ? place.place_id || "" : "",
          rating: place ? place.rating || null : null,
          user_ratings_total: place ? place.user_ratings_total || null : null,
          images: [],
          apiResponses, // Include API responses for debugging
        };

        // Get photos if available
        if (
          place &&
          place.photos &&
          Array.isArray(place.photos) &&
          place.photos.length > 0
        ) {
          console.log(`Found ${place.photos.length} photos for "${name}"`);

          // Get up to 3 photos
          const photoCount = Math.min(place.photos.length, 3);

          for (let i = 0; i < photoCount; i++) {
            if (place.photos[i] && place.photos[i].photo_reference) {
              const photoRef = place.photos[i].photo_reference;
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
              result.images.push(photoUrl);
              console.log(`Added photo ${i + 1} for "${name}"`);
            }
          }

          // For backward compatibility
          if (result.images.length > 0) {
            result.photoUrl = result.images[0];
          }
        } else {
          console.log(`No photos found in Places API for "${name}"`);
        }

        // If we still don't have photos, use custom Unsplash images
        // that at least look like beaches/surf spots with the location name
        if (result.images.length === 0) {
          const spotSeed = name.replace(/[^a-z0-9]/gi, "").toLowerCase();

          result.images = [
            `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
              name
            )},surf,beach`,
            `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
              name
            )},waves`,
            `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(
              name
            )},coast`,
          ];

          result.photoUrl = result.images[0];
          result.fallback = true;
          console.log(`Using fallback images for "${name}"`);
        }

        // Log final result
        console.log(`Returning ${result.images.length} images for "${name}"`);
        return response.json(result);
      } catch (error) {
        console.error("Error in getPlaceDetails:", error.message);
        return response.status(500).json({
          error: "Failed to fetch place details",
          message: error.message,
          ...generateFallbackResult(name || "error"),
        });
      }
    });
  });

/**
 * Fetches a photo for a place using Google Places API
 */
exports.getPlaceImage = functions
  .runWith(standardConfig)
  .https.onRequest((request, response) => {
    return cors(request, response, async () => {
      try {
        // Get query parameters
        const name = request.query.name;
        const vicinity = request.query.vicinity || "";
        const photoRef = request.query.photoRef;

        if (!name && !photoRef) {
          return response
            .status(400)
            .json({ error: "Missing required parameters" });
        }

        // Get API key from Firebase config
        const apiKey = functions.config().googleplaces.key;
        if (!apiKey) {
          return fallbackToUnsplash(response, name);
        }

        // If we have a direct photoRef, use it immediately
        if (photoRef) {
          try {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
            return response.redirect(photoUrl);
          } catch (error) {
            console.error(`Error with direct photoRef:`, error.message);
            // Continue to search queries if direct fetch fails
          }
        }

        // Search for the place
        const searchQuery = `${name} surf spot ${vicinity}`;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          searchQuery
        )}&key=${apiKey}`;

        const searchResponse = await axios.get(searchUrl);
        const places = searchResponse.data.results;

        // Check if we found a place with photos
        if (
          places &&
          places.length > 0 &&
          places[0].photos &&
          places[0].photos[0].photo_reference
        ) {
          const photoRef = places[0].photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
          return response.redirect(photoUrl);
        }

        // No photos found, use fallback
        return fallbackToUnsplash(response, name);
      } catch (error) {
        console.error("Error fetching place image:", error.message);
        return fallbackToUnsplash(response);
      }
    });
  });

/**
 * Redirects to Unsplash for a fallback image
 */
function fallbackToUnsplash(response, name = "surf") {
  const query = name ? name.replace(/\s+/g, ",") : "ocean";
  const fallbackUrl = `https://source.unsplash.com/800x600/?surf,beach,${encodeURIComponent(
    query
  )}`;
  return response.redirect(fallbackUrl);
}

/**
 * Generates a set of random surf-related images
 */
function generateRandomImageSet(name = "surf", seed = Date.now()) {
  // Use the name to create a consistent seed for the same location
  const nameSeed = name.replace(/[^a-z0-9]/gi, "").toLowerCase();

  return [
    `https://source.unsplash.com/800x600/?surf,wave,${encodeURIComponent(
      nameSeed
    )}&sig=1`,
    `https://source.unsplash.com/800x600/?beach,${encodeURIComponent(
      nameSeed
    )}&sig=2`,
    `https://source.unsplash.com/800x600/?ocean,coast,${encodeURIComponent(
      nameSeed
    )}&sig=3`,
  ];
}

/**
 * Generates a fallback result object with images
 */
function generateFallbackResult(name) {
  const seed = Date.now();
  return {
    name: name,
    images: generateRandomImageSet(name, seed),
    photoUrl: `https://source.unsplash.com/800x600/?surf,wave&seed=${seed}`,
    fallback: true,
  };
}
