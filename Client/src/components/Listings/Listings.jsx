import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { AuthContext } from '../../api/AuthContext'
import Modal from '../Messages/Modal'
import '../../styles/Listings.css'

const Listings = () => {
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')
  const [loadingListings, setLoadingListings] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sellerEmail, setSellerEmail] = useState('')
  const { user, authenticated, loading: loadingUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/listings')
        setListings(response.data)
      } catch (err) {
        console.error('Error fetching listings:', err.message)
        setError('Failed to fetch listings. Please try again later.')
      } finally {
        setLoadingListings(false)
      }
    }

    fetchListings()
  }, [])

  const handleMessageSeller = (email) => {
    setSellerEmail(email)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSellerEmail('')
  }

  if (loadingUser || loadingListings) {
    return <div>Loading...</div>
  }

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
            <i className="fas fa-plus"></i> Create New Listing
          </button>
        </div>
      )}

      <div className="listing-wall">
        {listings.map((listing) => {
          const isOwner = authenticated && user?._id === listing?.userId?._id

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
                {isOwner ? (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => navigate(`/listings/${listing._id}/edit`)}
                    >
                      <i className="fas fa-edit"></i> Edit
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
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="message-button"
                    onClick={() => handleMessageSeller(listing.userId.email)}
                  >
                    <i className="fas fa-envelope"></i> Message Seller
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3>Seller's Email</h3>
        <p>{sellerEmail}</p>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  )
}

export default Listings
