import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import '../../styles/EditListing.css'

const EditListing = () => {
  const { id } = useParams() // Get the listing ID from the URL
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  })
  const [images, setImages] = useState([]) // To store selected images
  const [existingImages, setExistingImages] = useState([]) // To display current images
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`/listings/${id}`) // Fetch listing details
        const { title, description, price, images } = response.data
        setFormData({ title, description, price })
        setExistingImages(images) // Load existing images
      } catch (err) {
        console.error('Error fetching listing:', err.message)
        setError('Unable to load listing details.')
      }
    }
    fetchListing()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setImages(e.target.files) // Set the selected files
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    for (const file of images) {
      formDataToSend.append('images', file) // Add each image to FormData
    }

    try {
      await axios.put(`/listings/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/') // Redirect to the home page
    } catch (err) {
      console.error('Error updating listing:', err.message)
      setError('Unable to update listing. Please try again.')
    }
  }

  return (
    <div className="edit-listing-page">
      <h1>Edit Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Existing Images:
          <div className="existing-images">
            {existingImages.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:3000/${image}`}
                alt="Listing"
                className="existing-image"
              />
            ))}
          </div>
        </label>
        <label>
          Upload New Images:
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <button type="submit">Update Listing</button>
      </form>
    </div>
  )
}

export default EditListing
