import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSingleListing } from '../../api/listings'

const ListingDetail = ({ listing, user, setListing }) => {
  const navigate = useNavigate()
  const [currentListing, setCurrentListing] = useState(listing)
  
  useEffect(() => {
    const fetchListing = async () => {
      const listingData = await getSingleListing(listing._id) 
      setListing(listingData)
      setCurrentListing(listingData)
    }

    if (!listing._id) {
      fetchListing()
    }
  }, [listing, setListing])

  const handleEditClick = () => {
    if (user._id === currentListing.userId) { // Ensure the user is the creator of the listing
      navigate(`/listings/${currentListing._id}/edit`)
    }
  }

  return (
    <div>
      <h2>{currentListing.title}</h2>
      
      {/* Show "Edit" button only if the logged-in user is the creator */}
      {user && user._id === currentListing.userId && (
        <button onClick={handleEditClick}>Edit Listing</button>
      )}
    </div>
  )
}

export default ListingDetail
