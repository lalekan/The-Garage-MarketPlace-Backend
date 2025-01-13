import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import '../../styles/Listings.css'

const Listings = ({ user, authenticated }) => {
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/listings')
        console.log('Fetched listings:', response.data) // Debug log
        setListings(response.data)
      } catch (err) {
        console.error('Error fetching listings:', err.message)
        setError('Failed to fetch listings. Please try again later.')
      }
    }

    fetchListings()
  }, [])

  if (error) {
    return <p className="error-message">{error}</p>
  }

  return (
    <div className="content-wrapper">
      {authenticated && (
        <div className="create-listing-container">
          <button
            className="create-listing-button"
            onClick={() => navigate('/create-listing')}
          >
            Create New Listing
          </button>
        </div>
      )}

      <div className="listing-wall">
        {listings.map((listing) => {
          const isOwner =
            authenticated &&
            user &&
            listing.userId &&
            listing.userId._id &&
            listing.userId._id === user.id

          console.log(
            `Listing: ${listing.title}, isOwner: ${isOwner}, Listing UserId: ${
              listing.userId?._id
            }, Logged-in UserId: ${user?.id}`
          )

          return (
            <div key={listing._id} className="listing-card">
              <h3>{listing.title}</h3>
              <p>{listing.description}</p>
              <p className="price">${listing.price.toFixed(2)}</p>

              <div className="listing-images">
                {listing.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/${image}`}
                    alt={listing.title}
                    className="carousel-image"
                  />
                ))}
              </div>

              {listing.userId && (
                <p className="posted-by">Posted by: {listing.userId.username}</p>
              )}

              <div className="action-buttons">
                {isOwner && (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/listings/${listing._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={async () => {
                        try {
                          await axios.delete(`/listings/${listing._id}`)
                          setListings((prev) =>
                            prev.filter((item) => item._id !== listing._id)
                          )
                        } catch (err) {
                          console.error('Error deleting listing:', err.message)
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}

                {!isOwner && authenticated && (
                  <button
                    className="message-button"
                    onClick={() =>
                      navigate('/send-message', {
                        state: {
                          receiverId: listing.userId?._id,
                          listingId: listing._id,
                        },
                      })
                    }
                  >
                    Message Seller
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Listings
