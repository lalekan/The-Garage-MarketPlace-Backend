import Client from './axios'

// Axios call to check token, verify and sign in user
export const SignInUser = async (data) => {
    try {
      const res = await Client.post('/auth/login', data)
      const token = res.data.token
  
      if (token) {
        localStorage.setItem('authToken', token)
      }
  
      return res.data.user
    } catch (error) {
      throw error
    }
  }
  

// Axios call to create a new user
export const RegisterUser = async (data) => {
  try {
    const res = await Client.post('/auth/register', data)
    return res.data
  } catch (error) {
    console.error('Error during registration:', error.response || error)
    throw error
  }
}

// Data needed as input in password update
export const PasswordUpdate = async ({
  userId,
  oldPassword,
  newPassword,
  confirmNewPassword
}) => {
  // Axios call to make update password
  try {
    const res = await Client.put(`auth/update/${userId}`, {
      oldPassword,
      newPassword,
      confirmNewPassword
    })
    localStorage.setItem('authToken', res.data.token)
    return res.data.user
  } catch (error) {
    throw error
  }
}

// Axios call to verify if user is still signed in and authorized to make certain requests.
// export const CheckSession = async () => {
//     const token = localStorage.getItem('authToken')
//     if (!token) {
//       throw new Error('No token found')
//     }
  
//     try {
//       const response = await Client.get('/api/auth/check-session', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       return response.data // Assuming response contains the user info
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Session expired')
//     }
//   }

export const CheckSession = async (token) => {
    try {
      const response = await axios.get('/api/auth/check-session', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data // Return user data from the backend
    } catch (err) {
      throw new Error('Session expired')
    }
  }