import { useEffect, useState } from 'react'
import axios from '../../api/axios'
import { Link } from 'react-router-dom'

const ListingList = ({user}) => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/listing')
        setListings(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to fetch listings')
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) return <div>Loading listings...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>All Listings</h1>
      <div>
        {listings.map((listing) => (
          <div key={listing._id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
            <p>{listing.price}</p>
            <img src={`http://localhost:3000/${listing.images[0]}`} alt={listing.title} />
            <div>
              <Link to={`/listings/${listing._id}`}>View Listing</Link>
              {/* Conditional rendering for edit/delete or message */}
              {/* Check if the logged-in user is the creator */}
              {user?._id === listing.userId ? (
                <>
                  <Link to={`/listings/${listing._id}/edit`}>Edit</Link>
                  <button onClick={() => handleDeleteListing(listing._id)}>Delete</button>
                </>
              ) : (
                <Link to={`/message/${listing.userId}/${listing._id}`}>Message Seller</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListingList