import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ListingsList = ({ listings }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (listings) {
      setLoading(false)
    }
  }, [listings])

  if (loading) return <div>Loading listings...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="listings-list">
      <h2>All Listings</h2>
      {listings.length === 0 ? (
        <p>No listings available</p>
      ) : (
        <div className="listings-container">
          {listings.map((listing) => (
            <div key={listing._id} className="listing-item">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p>Price: ${listing.price}</p>
              <p>Seller: {listing.seller.username}</p>
              <Link to={`/listings/${listing._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListingsList
