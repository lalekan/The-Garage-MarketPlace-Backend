import { useNavigate } from "react-router-dom"
import ListingForm from "./ListingForm"
import { createListing } from "../../api/listings"

const CreateListing = () => {
  const navigate = useNavigate()

  const handleCreateListing = async (listingData) => {
    try {
      const formData = new FormData();
      formData.append("title", listingData.title);
      formData.append("description", listingData.description);
      formData.append("price", listingData.price);
  
      if (listingData.images && listingData.images.length > 0) {
        Array.from(listingData.images).forEach((file) => {
          formData.append("images", file);
        });
      }
  
      const newListing = await createListing(formData);
      console.log("Listing created successfully:", newListing);
      navigate("/listings");
    } catch (err) {
      console.error("Error creating listing:", err.response?.data || err.message);
      alert("Failed to create listing. Please try again.");
    }
  };
  

  return (
    <div>
      <h1>Create a New Listing</h1>
      <ListingForm
        handleSubmit={handleCreateListing} // Pass the handler to the form
        buttonText="Create Listing"
      />
    </div>
  )
}

export default CreateListing
