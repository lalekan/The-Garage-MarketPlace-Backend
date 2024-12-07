import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing, updateListing } from '../../api/listings'
import ListingForm from './ListingForm'

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id)
        setListing(data)
      } catch (error) {
        console.error('Failed to fetch listing:', error)
        alert('Failed to load the listing.')
        navigate('/listings')
      }
    }
    fetchListing()
  }, [id, navigate])

  const handleSubmit = async (formData) => {
    console.log('EditListing handleSubmit called with:', formData)

    const { title, description, price, images } = formData
    try {
      await updateListing(id, { title, description, price }, images)
      alert('Listing updated successfully!')
      navigate(`/listing/${id}`)
    } catch (error) {
      console.error('Failed to update listing:', error)
      alert('Failed to update the listing.')
    }
  }

  console.log(handleSubmit, 'EditListing handleSubmit')
  console.log(listing, 'Current listing in EditListing');


  return (
    <div>
      <h1>Edit Listing</h1>
      {listing ? (
        <ListingForm 
          onSubmit={(data) => {
            console.log('EditListing ListingForm onSubmit:', data);
            handleSubmit(data);
          }} 
          initialData={listing}
        />

      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default EditListing
