'use server'

import Display from './Display'

export default async function Page() {

    const res = await fetch(`http://api.open-notify.org/iss-now.json`)
    const data = await res.json()

    return (
        <Display data={data} />
    )
}