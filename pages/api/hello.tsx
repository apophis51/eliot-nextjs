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



/*

This is The New Way
https://nextjs.org/docs/app/api-reference/file-conventions/route

GOTO  app/hello/route.tsx  in the files to see this example

export async function GET() {
  return Response.json({ message: 'Hello World' })
 }


*/