import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { AuthContext } from '../../api/AuthContext'
import '../../styles/SendMessage.css'

const SendMessage = () => {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { authenticated, user } = useContext(AuthContext)

  const { receiverId, listingId } = location.state || {}

  const handleSendMessage = async (e) => {
    e.preventDefault()
  
    if (!content.trim()) {
      setError('Message cannot be empty.')
      return
    }
  
    try {
      const token = localStorage.getItem('authToken')
  
      const response = await axios.post(
        '/messages/send',
        { receiverId, listingId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setSuccess('Message sent successfully!')
      setTimeout(() => navigate('/messages'), 2000)
    } catch (err) {
      console.error('Failed to send message:', err.response?.data || err.message)
      setError('Failed to send message.')
    }
  }
  


  return (
    <div className="send-message-container">
      <h2>Send Message</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSendMessage}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message here..."
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}

export default SendMessage
