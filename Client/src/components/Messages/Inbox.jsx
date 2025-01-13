import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../api/AuthContext'
import axios from '../../api/axios'
import '../../styles/Inbox.css'

const Inbox = () => {
  const { user, authenticated } = useContext(AuthContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      if (authenticated && user) {
        try {
          const response = await axios.get(`/messages/${user.id}`) // Fetch messages for the logged-in user
          setMessages(response.data.messages)
        } catch (err) {
          setError('Failed to fetch messages.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchMessages()
  }, [authenticated, user])

  if (!authenticated) {
    return <p>You need to log in to view your messages.</p>
  }

  if (loading) {
    return <p>Loading messages...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="messages-container">
      <h2>Your Messages</h2>
      {messages.length > 0 ? (
        <ul className="message-list">
          {messages.map((message) => (
            <li key={message._id} className="message-card">
              <h3>{message.listingId.title}</h3>
              <p><strong>From:</strong> {message.senderId.username}</p>
              <p><strong>To:</strong> {message.receiverId.username}</p>
              <p><strong>Message:</strong> {message.content}</p>
              <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  )
}

export default Inbox
