"use client"

import { useState } from "react"
import { login } from "../utils/auth"
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { motion } from "framer-motion"

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false) // Состояние для фокуса

  const { username, password } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
    if (serverError) setServerError("")
  }

  const validateForm = () => {
    const newErrors = {}
    if (!username.trim()) newErrors.username = "Username is required"
    if (!password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validateForm()) return
    setLoading(true)
    try {
      const data = await login({ username, password })
      setLoading(false)
      if (onLoginSuccess) onLoginSuccess(data)
    } catch (err) {
      console.error("LoginForm - Login error:", err)
      setLoading(false)
      setServerError(err.message || "Login failed. Please try again.")
    }
  }

  return (
    <motion.div
      className="relative bg-background-beige/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-forest-green transform perspective-1000"
      initial={{ rotateY: 10, scale: 0.95 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-accent text-woodland-brown text-center mb-6 relative z-10">
        Login
      </h2>

      {serverError && (
        <motion.div
          className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <motion.div
          className="relative"
          // Убрали whileHover, чтобы избежать влияния на позиционирование
        >
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
          />
          {errors.username && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.username}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="relative"
          // Убрали whileHover
        >
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleChange}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
          />
          {(isPasswordFocused || password) && ( // Показываем кнопку только при фокусе или заполненном пароле
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green hover:text-woodland-brown transition-colors duration-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
          {errors.password && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-forest-green to-scout-green-light text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={loading ? { scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: Infinity } } : {}}
        >
          {loading ? (
            <span className="animate-spin">🔥</span>
          ) : (
            "Login"
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default LoginForm