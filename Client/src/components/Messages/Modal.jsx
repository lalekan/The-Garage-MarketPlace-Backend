import React, { useRef } from 'react'
import '../../styles/Modal.css'

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef()

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          &times
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
