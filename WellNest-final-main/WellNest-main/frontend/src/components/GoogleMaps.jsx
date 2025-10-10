import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

const GoogleMaps = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCi4TLqhSf0lThxcOX-uoEnxLNfz9sNT8g', // Replace with your API key
    libraries: ['places'],
  });

  const [psychiatrists, setPsychiatrists] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [locationInput, setLocationInput] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Show only 3 psychiatrists at a time
  const mapRef = useRef(null); // Ref to the map container

  // Function to handle location input and geocoding
  const handleLocationSearch = () => {
    if (!locationInput) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: locationInput }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const newCenter = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        setCenter(newCenter); // Update the map center
        searchNearbyPsychiatrists(newCenter); // Search for psychiatrists near the new location
      } else {
        alert('Location not found. Please try again.');
      }
    });
  };

  // Function to search for nearby psychiatrists
  const searchNearbyPsychiatrists = (location) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: location,
      radius: 5000, // Search within 5km
      type: 'doctor',
      keyword: 'psychiatrist',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPsychiatrists(results);
        setVisibleCount(3); // Reset visible count to 3 when new results are loaded
      }
    });
  };

  // Function to focus on a specific psychiatrist's location
  const focusOnPlace = (place) => {
    setCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setSelectedPlace(place);

    // Scroll to the map
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Function to show more psychiatrists
  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Increase visible count by 3
  };

  // Function to show fewer psychiatrists
  const showLess = () => {
    setVisibleCount(3); // Reset visible count to 3
  };

  // Initial search for psychiatrists when the map loads
  useEffect(() => {
    if (isLoaded) {
      searchNearbyPsychiatrists(center);
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="p-5 font-sans mt-32">
      {/* Page Title */}
      <h2 className="text-center mb-10 text-5xl font-semibold">
        Nearby Psychiatrists
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Enter your location (e.g., New York, NY)"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="p-3 w-80 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLocationSearch}
          className="ml-4 p-3 bg-[#29b5f6d5] text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>

      {/* List of Psychiatrists */}
      <div className="mb-8">
        {psychiatrists.length > 0 ? (
          <>
            <ul className="space-y-4">
              {psychiatrists.slice(0, visibleCount).map((place) => (
                <li
                  key={place.place_id}
                  className="p-4 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {place.name}
                    </h3>
                    <p className="text-gray-600">{place.vicinity}</p>
                    <p className="text-gray-600">
                      Rating: {place.rating || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => focusOnPlace(place)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Show on Map
                  </button>
                </li>
              ))}
            </ul>
            {psychiatrists.length > 3 && (
              <div className="mt-6 text-center">
                {visibleCount < psychiatrists.length ? (
                  <button
                    onClick={showMore}
                    className="px-4 py-2 bg-[#29b5f6d5] text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                  >
                    Show More
                  </button>
                ) : (
                  <button
                    onClick={showLess}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">
            No psychiatrists found in this area.
          </p>
        )}
      </div>

      {/* Google Map */}
      <div ref={mapRef} className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15} // Increase zoom level for better focus
          center={center}
        >
          {psychiatrists.map((place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              icon={{
                url:
                  selectedPlace && selectedPlace.place_id === place.place_id
                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker for selected place
                    : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Blue marker for others
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMaps;