import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getSingleListing, updateListing } from "../../api/listings"
import ListingForm from "./ListingForm"

const EditListing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [existingListing, setExistingListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listing = await getSingleListing(id)
        setExistingListing(listing)
      } catch (err) {
        setError("Error fetching the listing")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const handleUpdateListing = async (updatedData) => {
    try {
      const { title, description, price, images } = updatedData
      const imageFiles = Array.isArray(images) ? images : Array.from(images)

      const updatedListing = await updateListing(
        id,
        { title, description, price },
        imageFiles
      )
      console.log("Listing updated successfully:", updatedListing)
      navigate(`/listings/${id}`)
    } catch (err) {
      console.error("Error updating listing:", err.response?.data || err.message)
      alert("Failed to update listing. Please try again.")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Edit Listing</h1>
      <ListingForm
        existingListing={existingListing}
        handleSubmit={handleUpdateListing}
        buttonText="Update Listing"
      />
    </div>
  )
}

export default EditListing
