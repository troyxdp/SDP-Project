import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const Map = ({ onCoordinatesChange }) => {

    const mapStyles = {
        height: '400px',
        width: '400px',
      };
    
      const defaultCenter = {
        lat: -26.186129990422717, 
        lng: 28.029252482000715,
      }

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  console.log(apiKey)

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [address, setAddress] = useState('');

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setAddress(value);
    setSelectedMarker(latLng);

    if (onCoordinatesChange) {
      onCoordinatesChange(latLng);
    }
  };

  return (
    <LoadScript googleMapsApiKey={`AIzaSyAUADuZZbBzM7r6mlT-O4S573G9wvLxHiw&libraries=places`}>
      <div>
        {/* Search input for location */}
        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search for a location',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                  };
                  return (
                    <div {...getSuggestionItemProps(suggestion, { style })}>
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        {/* Google Map */}
        <GoogleMap mapContainerStyle={mapStyles} zoom={10} center={defaultCenter}>
          {/* Render the selected marker, if any */}
          {selectedMarker && <Marker position={selectedMarker} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
