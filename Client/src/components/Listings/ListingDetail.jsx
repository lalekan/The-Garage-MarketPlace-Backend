import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../api/axios'

const ListingDetails = () => {
  const { id } = useParams()
  const [listing, setListing] = useState(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await API.get(`/listing/${id}`)
        setListing(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchListing()
  }, [id])

  if (!listing) return <p>Loading...</p>

  return (
    <div>
      <h1>{listing.title}</h1>
      <p>{listing.description}</p>
      <p>${listing.price}</p>
      <div className="images">
        {listing.images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:3000${img}`}
            alt={`Listing ${listing.title}`}
            width="200"
          />
        ))}
      </div>
    </div>
  )
}

export default ListingDetails
