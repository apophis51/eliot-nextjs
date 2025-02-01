'use client'

import {useState} from 'react'

  export default function Page({data}) {

    const [background, setBackground] = useState('gray');

    function toggleBackgroundColor() {
      if (background === 'gray') {
        setBackground('red');
      } else {
        setBackground('gray');
      }
    }
    
    return (
      <div  style={{ backgroundColor: background, color: 'white' }}>
        <h1>ISS Location</h1>
        <p>Latitude: {data.iss_position.latitude}</p>
        <p>Longitude: {data.iss_position.longitude}</p>
        <button onClick={() => toggleBackgroundColor()}>Toggle Color</button>
      </div>
    )
  }