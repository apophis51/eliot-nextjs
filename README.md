## Index

- [Getting started](#getting-started)
- [API Routes](#api-routes)
- [Server-side Rendering (SSR)](#server-side-rendering-ssr)
- [Static Generation](#static-generation)
- [Server Actions](#server-actions)
- [Layout](#layout)



## Getting Started
These Examples can be run by cloning to your computer and running 

```bash
npm i
npm run dev
```

## Upgrading Your own code from 12 to 15 

NextJS provides upgrade instruction from 12 - 14, and also 15 :

- https://nextjs.org/docs/pages/building-your-application/upgrading
- https://nextjs.org/docs/app/building-your-application/upgrading


However, you might need to upgrade your Node version in the process.
Personally I started from Next-12 using Node-16 and switched to Node-19 before upgrading to 14, and then 15 with these commands


12 to 14: 

```bash
npm i next@next-14 react@18 react-dom@18 && npm i eslint-config-next@next-14 -D
```

Then 14 to Next15:

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

Also I ran into a bunch of eslint errors:
```bash
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! Found: eslint@9.19.0
```

and to correct it, I `npm uninstalled eslint` before running the update commands

--------------------------------------------------

## API Routes

API Routes in Next-15 no longer require a dedicated API route folder.  For the easiest way up upgrading once you go to Next-15 I would recommend leaving all your api routes how they are, and using the new format incrementally as you please. (all these examples can be seen by running the main program)

### API Folder Changes

For this example we have a standard Next 12 API structure:

```bash
│── /pages              
│   │── /api    
|   |   |-- hello.tsx
```
and when you go to http://localhost:3000/api/hello    you will see a hello message returned in the JSON which is standard Next-12
However, to take advantage of Next-15 routes you will need to structure this differently:

Next-15 code doesnt require your api routes to be in an api folder. Instead you call the api route what you want. In this case we just called the api route itself hello

and when you go to http://localhost:3000/hello   you will see the hello message.  The key structural change is any code in the route.tsx file will execute when that api is hit. But the beauty is all code in /app will run according to Next-15 rules and all code in /pages will run with Next-12 rules. They can exist side by side for incremental adoption.

```bash
|-- /app                    # Next-15 code needs to be in an app folder
|   |-- /hello
|   |   |-- route.tsx       #The New Next-15 Version can Run Side By side with your old Api Router Code
│── /pages                 
│   │── /api    
|   |   |-- hello.tsx
```


### API Code Changes

The Next-12 example in our code above looked like this

```tsx
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```


However our Next-15 version looks like this: 

```tsx
export async function GET() {
    return Response.json({ message: 'Hello from Next.js!' })
   }
```



A POST request in Next-12 would be structured like this:

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'Data received', data: req.body });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

However a key difference is that In Next - 15 you need to explicitly export the REST Method as a function

```tsx

export async function POST(req: Request) {
  const body = await req.json();
  return Response.json({ message: 'Data received', data: body });
}

// GET and other methods to the same route need to be defined seperatly in the file

//export async function GET(request: Request) {}
 
//export async function HEAD(request: Request) {}
 
 
//export async function PUT(request: Request) {}
 
//export async function DELETE(request: Request) {}
 
//export async function PATCH(request: Request) {}
 ```

 More usefull Docs: 

 - https://nextjs.org/docs/app/api-reference/file-conventions/route
 - https://nextjs.org/docs/app/building-your-application/routing/route-handlers



--------------------

## Server-side Rendering(SSR)

### SSR Folder Changes
In Next.js 15, client-side code must be saved into the /app folder as page.tsx. The name given to the folder determines the navigable route in the browser URL.

```bash
|-- /app                   # Next.js 15 code needs to be in an app folder
|   |-- /ISS15-server
|   |   |-- page.tsx      
|-- /pages                 
|   |-- /ISS12.tsx

```
In this case, we have two versions of the same route:

- http://localhost:3000/ISS15-server is our Next.js 15 route
- http://localhost:3000/ISS12 is our Next.js 12 route

You can Incrementaly use Next.js 15 and Next.js 12 side by side same as with the API routes

### SSR Code Changes

In Next.js 15, instead of using getServerSideProps, you can fetch data directly in server components. In this example, we fetch ISS location data directly in our page. This data is rendered on the server and then sent to the client each time the page is refreshed. Notice how we mark the page with 'use server'

```jsx
// file located in app/ISS15-server/page.tsx
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
```

This is the equivalent code in Next.js 12:

```jsx
  // file located in /pages/ISS12.tsx
  export async function getServerSideProps() {
    const res = await fetch(`http://api.open-notify.org/iss-now.json`)
    const data = await res.json()
    return { props: { data } }
  }

  export default function Page({ data }) {
    
    return (
      <div>
        <h1>ISS Location</h1>
        <p>Latitude: {data.iss_position.latitude}</p>
        <p>Longitude: {data.iss_position.longitude}</p>
      </div>
    )
  }
```

One key difference in Next.js 15 is that client-side code, such as useEffect and useState, is not allowed in server components. Next.js 15 uses 'use client' to mark a file as a client component. You can define the client-side code separately and import it into the server component.

```jsx
// file located in app/ISS15-server-and-client/page.tsx
'use server'

import Display from './Display'

export default async function Page() {

    const res = await fetch(`http://api.open-notify.org/iss-now.json`)
    const data = await res.json()

    return (
        <Display data={data} />
    )
}
```
We have to export the dynamic property to force Next.js to re-render the page on every request, because Next.js 15 statically generates pages by default, which would cause build time errors, since react dom properties are only available at render.

```jsx
// file located in app/ISS15-server-and-client/Display.tsx
'use client'

import {useState} from 'react'
export const dynamic = 'force-dynamic'

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
```

## Static Generation

In Next 12 you can use `getStaticProps` to fetch data at build time. Next 15 renders pages at build time by default and does not require this step

```tsx
export default function CollegeData({ colleges }) {
    return (
        <>
      <h1>Colleges in the UK</h1>
      <ul>
        {colleges.map((college) => (
          <li>{college.web_pages[0]}</li>
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
```

Next 15:

```tsx
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
```

## Server Actions

I'm not sure that something like this existed in Next 12, but in Next 15 in addition to api routes you can also use server actions for backend work. 
This is viewable at http://localhost:3000/DataBaseViewer




Here we interact with our database using a server action:
```tsx

'use client'

import { User } from '@prisma/client'
import { getAllUsers } from './databaseAction'
import { useState } from 'react'


export default function DataBaseViewer() {
    const [users, setUsers] = useState<User[]>([])     

    async function buttonHandler() {
        const users = await getAllUsers() // instead fetching this data from an api route we use a server action
        setUsers(users)
    }

    return (
        <>
            <button onClick={buttonHandler}>View all Users</button>
            {users && users.map((user) => {
                return (
                    <div key={user.id}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </div>
                )
            })}
        </>
    )
}
```

```tsx
'use server'          //code tagged as use server is executed on the backend

import { prisma } from '../lib/prisma'


export async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users
  }
  ```

  ## Layout 

  Instead of using _app.tsx or _app.js the root of your app folder must have a layout.tsx or layout.js file. This file will be used to wrap all your pages. If you do not create one, Next 15 will create one for you automatically when you create your /app page and run the server. 
-----------------------------------------------------------------------------------------

