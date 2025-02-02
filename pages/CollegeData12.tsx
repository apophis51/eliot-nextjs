
export default function CollegeData({ colleges }) {
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


  // This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://universities.hipolabs.com/search?country=United+Kingdom')
  const colleges = await res.json()
  console.log(colleges)
 
  return {
    props: {
      colleges,
    },
  }
}