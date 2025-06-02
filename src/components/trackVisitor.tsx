import { useEffect, useState } from 'react'

export default function Visitors() {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    // Track visit
    fetch('/api/visitors', { method: 'POST' })
    
    // Get total count
    fetch('/api/visitors')
      .then(res => res.json())
      .then(data => setVisitorCount(data.count))
  }, [])

  console.log(visitorCount)

  return (
    <div className='text-center text-white'>
      <p>Total Visitors : {visitorCount}</p>
    </div>
  )
}