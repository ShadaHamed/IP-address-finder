import React, { useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import "./App.css";

function App() {
  const [ipDetails, setIpDetails] = useState(null);
  const [center, setCenter] = useState({ lat: 22.5726, lng: 88.3832 });
  const [userIPAddress, setUserIPAddress] = useState('');
  const [userInput, setUserInput] = useState('');

  //set custom icon
  const customIcon = L.icon({
    iconUrl: require('./images/marker_icon.png'),
    iconSize: [32, 32],
  });

// Get initial user IP details
  useEffect(() => {
    axios.get('https://ipapi.co/json/').then((res) => {
      setIpDetails(res.data);
      setCenter({ lat: parseFloat(res.data.latitude), lng: parseFloat(res.data.longitude) });
    });
  }, []);

  // Fetch details for entered IP
  useEffect(() => {
    console.log('ip address is changed')
    if (userIPAddress.trim() !== '') {
      axios.get(`https://ipapi.co/${userIPAddress}/json/`)
        .then((res) => {
          setIpDetails(res.data);
          setCenter({ lat: parseFloat(res.data.latitude), lng: parseFloat(res.data.longitude) });
        })
        .catch((error) => {
          console.error('Error fetching IP location data:', error);
        });
    }
  }, [userIPAddress]); 

 const HandleInputChange = (e) => {
  setUserInput(e.target.value);
 }

 const handleIPSearch = () => {
    if (userInput.trim() !== '') {
      // API call handled in the useEffect above
      setUserIPAddress(userInput);
    } else {
      alert('Please enter an IP address.');
    }
  };

  // Update center when ipDetails changes
  useEffect(() => {
    if (ipDetails) {
      setCenter({ lat: parseFloat(ipDetails.latitude), lng: parseFloat(ipDetails.longitude) });
    }
  }, [ipDetails]);

  if (!ipDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='app'>
    {/* top-section */}
      <div className='top'>
        <h1 className="heading">IP Address Finder</h1>
        <div className='search-box'>
          <input
            type="text"
            placeholder="Enter IP Address"
            value={userInput}
            onChange={(e) => HandleInputChange(e)}
          />
          <button onClick={handleIPSearch}>Search</button>
        </div>
      </div>
      {/* search-result */}
      <div className="details">
        {/* details-section */}
          <div className="left">
            <h4>IP address</h4>
            <h1 id="ip">{ipDetails.ip}</h1>
            <h4>Approximate location:</h4>
            <p>{ipDetails.city}, {ipDetails.region}, {ipDetails.country_name}.</p>
            <h4>Internet Service Provider(ISP):</h4>
            <p>{ipDetails.org}</p>
          </div>
        {/* map-section */}
        <div className='map'>
          <MapContainer center={center} zoom={13} style={{height:400, width:600}} key={center.lat + ',' + center.lng}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center} icon={customIcon}>
              <Popup>{ipDetails.city}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;