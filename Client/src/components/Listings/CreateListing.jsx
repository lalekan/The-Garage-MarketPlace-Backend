import { useParams, useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const { sellerId } = useParams(); // Get sellerId from URL params
  const navigate = useNavigate()

  const handleSubmit = async ({ listingData, images }) => {
    try {
      const formData = new FormData();
      formData.append('title', listingData.title);
      formData.append('description', listingData.description);
      formData.append('price', listingData.price);
      formData.append('seller', sellerId); // Use sellerId from URL instead of decoded token
  
      images.forEach((file) => formData.append('images', file));
  
      // Make the API call to create the listing
      const response = await API.post('/listing/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/listings')
  
      console.log('Listing created:', response.data);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Listing</h1>
      <ListingForm
        onSubmit={(data) => {
          console.log('CreateListing ListingForm onSubmit:', data);
          handleSubmit(data);
        }}
      />
    </div>
  );
};

export default CreateListing;
