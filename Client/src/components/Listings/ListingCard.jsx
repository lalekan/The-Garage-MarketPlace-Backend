import { useEffect, useState } from 'react'
import axios from '../../api/axios'

function ListingCard({ listing }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios
      .get(`/messages/${listing._id}/messages`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error(error))
  }, [listing._id])

  return (
    <div>
      <h3>{listing.title}</h3>
      <p>{listing.description}</p>
      <p>{listing.price}</p>
      {listing.seller._id === user.id && (
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
      <button>Contact Seller</button>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListingCard