'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm />
            <p className="mt-4 text-center">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:underline"
              >
                Regístrate
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm />
            <p className="mt-4 text-center">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}