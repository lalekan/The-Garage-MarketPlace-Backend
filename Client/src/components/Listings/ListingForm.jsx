import { useState } from 'react'

const ListingForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '')
  const [description, setDescription] = useState(initialData.description || '')
  const [price, setPrice] = useState(initialData.price || '')
  const [images, setImages] = useState(initialData.images || [])
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 5) {
      alert('You can upload a maximum of 5 images.')
      return
    }
    setImages(selectedFiles)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if at least one image is uploaded
    if (images.length < 1) {
      alert('You must upload at least 1 image.')
      return
    }

    // Retrieve the sellerId from the stored token in localStorage (assuming it's in the token)
    const token = localStorage.getItem('authToken')
    if (!token) {
      setError('You must be signed in to create a listing.')
      return
    }

    // Decode the JWT token to get the user (seller) data
    const user = JSON.parse(atob(token.split('.')[1])) // Decodes the payload to get user data
    const sellerId = user._id // Assuming the token has _id for the seller

    if (!sellerId) {
      setError('Seller ID is missing.')
      return
    }

    // Prepare the listing data including the sellerId
    const listingData = { 
      title, 
      description, 
      price, 
      sellerId, // Include the sellerId here
    }

    if (typeof onSubmit === 'function') {
      onSubmit({ listingData, images }) // Pass the data to the parent component
    } else {
      console.error('onSubmit prop is not a function.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  )
}

export default ListingForm
