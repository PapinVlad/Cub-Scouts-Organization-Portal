"use client"

import { useState } from "react"
import { register } from "../utils/auth"
import { FaUser, FaEnvelope, FaKey, FaIdCard, FaEye, FaEyeSlash } from "react-icons/fa" 
import { motion } from "framer-motion"

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "public",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")
  const [showPassword, setShowPassword] = useState(false) 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) 

  const { username, email, password, confirmPassword, firstName, lastName, role } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!username.trim()) newErrors.username = "Username is required"
    else if (username.length < 3) newErrors.username = "Username must be at least 3 characters"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format"
    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")
    if (!validateForm()) return
    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = formData
      const data = await register(registerData)
      setLoading(false)
      if (onRegisterSuccess) onRegisterSuccess(data)
    } catch (err) {
      setLoading(false)
      setServerError(err.message || "Registration failed. Please try again.")
    }
  }

  return (
    <motion.div
      className="relative bg-background-beige/80 backdrop-blur-sm rounded-xl p-6 shadow-2xl border-2 border-forest-green transform perspective-1000"
      initial={{ rotateY: 10, scale: 0.95 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full animate-pulse"></div>
      <h2 className="text-2xl font-accent text-woodland-brown text-center mb-6 relative z-10">
        Register
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
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
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
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
          />
          {errors.email && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
            />
            {errors.firstName && (
              <motion.p
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.firstName}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full pl-10 pr-3 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
            />
            {errors.lastName && (
              <motion.p
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.lastName}
              </motion.p>
            )}
          </motion.div>
        </div>

        <motion.div
          className="relative"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
          <input
            type={showPassword ? "text" : "password"} 
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green hover:text-woodland-brown transition-colors duration-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
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

        <motion.div
          className="relative"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-green" />
          <input
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-10 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown placeholder-woodland-brown/70"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-green hover:text-woodland-brown transition-colors duration-300"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="relative"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <select
            name="role"
            value={role}
            onChange={handleChange}
            className="w-full pl-3 pr-10 py-2 bg-transparent border-b-2 border-woodland-brown focus:border-forest-green transition-all duration-300 text-woodland-brown appearance-none"
          >
            <option value="public" className="text-woodland-brown">Public</option>
            <option value="helper" className="text-woodland-brown">Helper</option>
            <option value="leader" className="text-woodland-brown">Leader</option>
          </select>
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
            "Register"
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default RegisterForm