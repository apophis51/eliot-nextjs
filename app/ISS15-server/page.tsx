'use server'


export default async function Page() {

  const res = await fetch(`http://api.open-notify.org/iss-now.json`)
  const data = await res.json()


  return (
    <div>
      <h1>ISS Location</h1>
      <p>Latitude: {data.iss_position.latitude}</p>
      <p>Longitude: {data.iss_position.longitude}</p>
    </div>
  )
}

