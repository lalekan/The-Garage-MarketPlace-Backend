import { useState, useEffect } from "react"

const ListingForm = ({ existingListing, handleSubmit, buttonText }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [images, setImages] = useState([])

  // Populate fields when existingListing changes
  useEffect(() => {
    if (existingListing) {
      setTitle(existingListing.title || "")
      setDescription(existingListing.description || "")
      setPrice(existingListing.price || "")
      setImages(existingListing.images || [])
    }
  }, [existingListing])

  const handleFileChange = (e) => {
    setImages(e.target.files)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const updatedData = {
      title,
      description,
      price,
      images,
    }

    handleSubmit(updatedData)
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Images</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  )
}

export default ListingForm
