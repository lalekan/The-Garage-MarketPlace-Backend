import { useState, useEffect } from 'react'
import { getInboxMessages } from '../../api/messages'

const Inbox = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getInboxMessages()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()
  }, [])

  return (
    <div>
      <h2>Your Inbox</h2>
      {messages.map((message) => (
        <div key={message._id}>
          <p>{message.content}</p>
          <small>From: {message.sender.name}</small>
        </div>
      ))}
    </div>
  )
}

export default Inbox
