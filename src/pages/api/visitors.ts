import { NextApiRequest, NextApiResponse } from 'next'
import { trackVisitor, getTotalVisitors } from '../../lib/visitorService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await trackVisitor(req)
    return res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    const count = await getTotalVisitors()
    return res.status(200).json({ count })
  }

  return res.status(405).end()
}