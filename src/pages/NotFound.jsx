import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <ApperIcon name="AlertTriangle" className="w-24 h-24 sm:w-32 sm:h-32 text-accent mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-4">
          Task Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-sm sm:text-base">
          Looks like this task has escaped from your to-do list! Let's get you back to productivity.
        </p>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary text-sm sm:text-base"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Tasks</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound