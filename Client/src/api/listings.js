import API from './axios'

export const createListing = async (listingData, imageFiles) => {
    try {
      const formData = new FormData()
      formData.append('title', listingData.title)
      formData.append('description', listingData.description)
      formData.append('price', listingData.price)
      
      // Get the user ID (seller) from the token
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('You must be signed in to create a listing.')
      }
  
      // Decode the JWT token to get the user ID (seller)
      const user = JSON.parse(atob(token.split('.')[1])) // Decodes the payload
      const seller = user._id // Assuming the token has the user ID as '_id'
  
      console.log("Seller ID:", seller)  // Debugging the seller ID
  
      if (!seller) {
        throw new Error('Seller ID is missing.')
      }
  
      // Append the seller ID to the form data
      formData.append('seller', seller)
  
      // Append images to the form data
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })
  
      console.log('Making POST request to:', '/listing/create')
  
      // Send the form data, including seller ID and image files, in a single request
      const response = await API.post('/listing/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Ensure Content-Type is set for formData
        },
      })
  
      console.log('Listing created:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating listing:', error.response?.data || error.message)
    }
  }
  

  // Fetch a single listing by ID
export const getListing = async (id) => {
    try {
      const response = await API.get(`/listing/${id}`)
      console.log('Fetched listing:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching listing:', error.response?.data || error.message)
      throw error
    }
  }

  // Fetch all listings
  export const fetchListings = async () => {
    try {
      const response = await API.get('/listing') // API call for getting all listings
      return response.data // Axios automatically handles response and parsing to JSON
    } catch (error) {
      console.error('Error fetching listings:', error)
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
  
      console.log('Making PUT request to:', `/listing/${id}`)
  
      const response = await API.put(`/listing/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
  
      console.log('Listing updated:', response.data)
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
      console.log('Listing deleted successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error deleting listing:', error.response?.data || error.message)
      throw error
    }
  }
  