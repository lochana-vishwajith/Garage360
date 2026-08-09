import { createContext, useContext, useState, useEffect } from 'react'
import {
  cognitoLogin,
  cognitoRegister,
  cognitoConfirmRegistration,
  cognitoResendCode,
  cognitoForgotPassword,
  cognitoConfirmPassword,
  cognitoLogout,
  getCurrentUser,
} from '../cognito/cognitoService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { result } = await cognitoLogin(email, password)
    const u = await getCurrentUser()
    setUser(u)
    return result
  }

  const register = async (email, password, name) => {
    return cognitoRegister(email, password, name)
  }

  const confirmRegistration = async (email, code) => {
    return cognitoConfirmRegistration(email, code)
  }

  const resendCode = async (email) => {
    return cognitoResendCode(email)
  }

  const forgotPassword = async (email) => {
    return cognitoForgotPassword(email)
  }

  const confirmPassword = async (email, code, newPassword) => {
    return cognitoConfirmPassword(email, code, newPassword)
  }

  const logout = () => {
    cognitoLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        confirmRegistration,
        resendCode,
        forgotPassword,
        confirmPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
