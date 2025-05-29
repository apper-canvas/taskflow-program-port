import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: '1', name: 'Work', color: '#6366f1' },
    { id: '2', name: 'Personal', color: '#06b6d4' },
    { id: '3', name: 'Health', color: '#10b981' },
    { id: '4', name: 'Learning', color: '#f59e0b' }
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    categoryId: '1'
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error('Task title is required!')
      return
    }

    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
          : task
      ))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskForm,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
      toast.success('Task created successfully!')
    }

    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: '1'
    })
    setShowTaskForm(false)
  }

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      categoryId: task.categoryId
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}!`)
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      default: return 'text-surface-600 bg-surface-100 dark:bg-surface-700 dark:text-surface-400'
    }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd')
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesCategory = categoryFilter === 'all' || task.categoryId === categoryFilter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesCategory && matchesSearch
  })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'completed').length
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 sm:space-y-6"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient">
          Your Task Universe
        </h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          Transform chaos into clarity. Organize your world, one task at a time.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
      >
        {[
          { label: 'Total Tasks', value: taskStats.total, color: 'from-blue-500 to-blue-600', icon: 'List' },
          { label: 'Completed', value: taskStats.completed, color: 'from-green-500 to-green-600', icon: 'CheckCircle' },
          { label: 'Pending', value: taskStats.pending, color: 'from-amber-500 to-amber-600', icon: 'Clock' },
          { label: 'Overdue', value: taskStats.overdue, color: 'from-red-500 to-red-600', icon: 'AlertCircle' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -5 }}
            className="task-card p-4 sm:p-6 text-center group cursor-pointer"
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-card`}>
              <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
              {stat.value}
            </h3>
            <p className="text-surface-600 dark:text-surface-400 text-xs sm:text-sm font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Search and Add Task */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowTaskForm(true)
              setEditingTask(null)
              setTaskForm({
                title: '',
                description: '',
                dueDate: '',
                priority: 'medium',
                categoryId: '1'
              })
            }}
            className="btn-primary flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', icon: 'List' },
              { key: 'pending', label: 'Pending', icon: 'Clock' },
              { key: 'completed', label: 'Done', icon: 'CheckCircle' }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption.key)}
                className={`category-chip flex items-center space-x-2 ${
                  filter === filterOption.key
                    ? 'bg-primary text-white shadow-card'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
              >
                <ApperIcon name={filterOption.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{filterOption.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryFilter('all')}
              className={`category-chip ${
                categoryFilter === 'all'
                  ? 'bg-secondary text-white shadow-card'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
              }`}
            >
              All Categories
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(category.id)}
                className={`category-chip ${
                  categoryFilter === category.id
                    ? 'text-white shadow-card'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                }`}
                style={{
                  backgroundColor: categoryFilter === category.id ? category.color : undefined
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTaskForm(false)}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Add task description..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <select
                    value={taskForm.categoryId}
                    onChange={(e) => setTaskForm({ ...taskForm, categoryId: e.target.value })}
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="ListTodo" className="w-12 h-12 sm:w-16 sm:h-16 text-surface-400 dark:text-surface-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Create your first task to get started!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const category = categories.find(c => c.id === task.categoryId)
                const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`task-card p-4 sm:p-6 ${
                      task.priority === 'high' ? 'priority-high' :
                      task.priority === 'medium' ? 'priority-medium' : 'priority-low'
                    } ${task.status === 'completed' ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Checkbox */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-1 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <ApperIcon name="Check" className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-surface-900 dark:text-surface-100 mb-1 ${
                              task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-surface-600 dark:text-surface-400 text-sm mb-3 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            
                            {/* Task Meta */}
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                              {category && (
                                <span
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.name}
                                </span>
                              )}
                              
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              
                              {task.dueDate && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isOverdue 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}>
                                  {isOverdue && <ApperIcon name="AlertCircle" className="w-3 h-3 inline mr-1" />}
                                  {formatDueDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(task)}
                              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary transition-colors"
                            >
                              <ApperIcon name="Edit2" className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(task.id)}
                              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-red-500 transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature