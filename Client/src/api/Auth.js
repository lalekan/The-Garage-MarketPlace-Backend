import Client from './axios'

// Axios call to check token, verify and sign in user
export const SignInUser = async (data) => {
  try {
    const res = await Client.post('/auth/login', data)
    const { token, refreshToken, user } = res.data

    localStorage.setItem('authToken', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    return user
  } catch (error) {
    console.error('Sign-in error:', error)
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
  
export const CheckSession = async (token) => {
  try {
    const response = await Client.get('/auth/check-session', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.user
  } catch (err) {
    console.error('Error in CheckSession:', err.message)
    throw err
  }
}


export const RefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token found')

  try {
    const response = await Client.post('/auth/refresh-token', { refreshToken })
    const { token, user } = response.data

    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user)) 

    return token
  } catch (err) {
    console.error('Error refreshing token:', err.message)
    throw err
  }
}
