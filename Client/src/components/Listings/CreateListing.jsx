import { useState } from 'react'
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image file input
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { title, description, price, images } = formData

    // Validation
    if (!title || !description || !price) {
      setError('All fields except images are required.')
      setIsLoading(false)
      return
    }

    // Prepare form data for upload
    const form = new FormData()
    form.append('title', title)
    form.append('description', description)
    form.append('price', price)
    Array.from(images).forEach((image) => form.append('images', image))

    try {
      await axios.post('/listings', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/') // Redirect to home page after success
    } catch (err) {
      console.error('Error creating listing:', err.message)
      setError('Failed to create listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="create-listing-container">
      <h2>Create a New Listing</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the listing title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the listing description"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter the price"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}

export default CreateListing
