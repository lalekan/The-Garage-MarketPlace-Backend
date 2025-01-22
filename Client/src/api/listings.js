import API from './axios'

export const createListing = async (formData) => {
  const token = localStorage.getItem('authToken') 
  if (!token) throw new Error('No token found')

  const response = await API.post('/listing', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}


// Fetch all listings
export const getListings = async () => {
  try {
    const response = await API.get('/listing') 
    if (!response.ok) {
        throw new Error('Failed to fetch listings')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}

// Fetch a single listing by ID
export const getSingleListing = async (id) => {
    try {
      const response = await API.get(`/listing/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching listing by ID:', error.response?.data || error.message)
      throw error
    }
  }

// Update a listing
export const updateListing = async (id, listingData, imageFiles) => {
  try {
    const formData = new FormData()
    formData.append('title', listingData.title)
    formData.append('description', listingData.description)
    formData.append('price', listingData.price)

    imageFiles.forEach((file) => {
      formData.append('images', file)
    })

    const token = localStorage.getItem('authToken')
    const response = await API.put(`/listing/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error updating listing:', error.response?.data || error.message)
    throw error
  }
}

// Delete a listing
export const deleteListing = async (listingId) => {
  try {
    const response = await API.delete(`/listing/${listingId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting listing:', error.response?.data || error.message)
    throw error
  }
}
