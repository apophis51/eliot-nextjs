'use server'

export default async function CollegeData() {
    const res = await fetch('http://universities.hipolabs.com/search?country=United+Kingdom')
    const colleges = await res.json()

    return (
        <>
      <h1>Colleges in the UK</h1>
      <ul>
        {colleges.map((college) => (
          <li key={college.web_pages[0]}>{college.web_pages[0]}</li>
        ))}
      </ul>
      </>
    )
  }

