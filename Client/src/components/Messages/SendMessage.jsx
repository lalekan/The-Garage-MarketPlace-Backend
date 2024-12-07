import { useState } from "react"

const MessageForm = ({ receiverId }) => {
  const [message, setMessage] = useState("")

  const handleChange = (e) => setMessage(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ receiverId, content: message }),
      })
      const result = await response.json()
      if (response.ok) {
        alert("Message sent!")
      } else {
        alert(result.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Error sending message")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="Write your message..."
      ></textarea>
      <button type="submit">Send Message</button>
    </form>
  )
}

export default MessageForm
