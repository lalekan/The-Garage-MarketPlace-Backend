import Client from './axios'

// Axios call to check token, verify and sign in user
export const SignInUser = async (data) => {
    try {
      const res = await Client.post('/auth/login', data)
      const { token, refreshToken, user } = res.data
  
    //   if (token && refreshToken) {
        localStorage.setItem('authToken', token) // Save authToken
        localStorage.setItem('refreshToken', refreshToken) // Save refreshToken
    //   }
  
      return user
    } catch (error) {
        console.error
      throw error
    }
  }

  export const LogoutUser = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
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
      });
      return response.data; // Return user data
    } catch (err) {
      console.error('Error in CheckSession:', err.response?.data || err.message);
      throw err;
    }
  };
  
  
  

  export const RefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) throw new Error('Refresh token not found')
  
      const res = await Client.post('/auth/refresh-token', { refreshToken })
      const { token } = res.data
  
      localStorage.setItem('authToken', token) // Update authToken
      return token
    } catch (error) {
      throw error
    }
  }
  
  