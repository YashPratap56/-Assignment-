const express = require('express');
const { body, query } = require('express-validator');
const taskController = require('../controllers/taskController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/tasks
 * @desc Get all tasks (with pagination and filtering)
 * @access Private
 */
router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100.'),
    query('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status value.'),
    query('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority value.'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Search term must be less than 100 characters.'),
    query('sort')
      .optional()
      .isIn(['title', 'status', 'priority', 'dueDate', 'createdAt'])
      .withMessage('Invalid sort field.'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc.')
  ],
  taskController.getTasks
);

/**
 * @route GET /api/v1/tasks/stats
 * @desc Get task statistics (Admin only)
 * @access Private (Admin)
 */
router.get(
  '/stats',
  authorize('ADMIN'),
  taskController.getTaskStats
);

/**
 * @route GET /api/v1/tasks/:id
 * @desc Get single task by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    body('id')
      .isUUID()
      .withMessage('Invalid task ID format.')
  ],
  taskController.getTask
);

/**
 * @route POST /api/v1/tasks
 * @desc Create new task
 * @access Private
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required.')
      .isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description must be less than 2000 characters.'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority value.'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
  ],
  taskController.createTask
);

/**
 * @route PUT /api/v1/tasks/:id
 * @desc Update task
 * @access Private
 */
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty.')
      .isLength({ max: 200 })
      .withMessage('Title must be less than 200 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description must be less than 2000 characters.'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority value.'),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
      .withMessage('Invalid status value.'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
  ],
  taskController.updateTask
);

/**
 * @route DELETE /api/v1/tasks/:id
 * @desc Delete task
 * @access Private
 */
router.delete(
  '/:id',
  taskController.deleteTask
);

module.exports = router;
