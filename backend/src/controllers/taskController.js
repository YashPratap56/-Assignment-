const prisma = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Parse pagination parameters from query
 */
const parsePagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build ordering object from query
 */
const parseOrdering = (query, allowedFields) => {
  const orderBy = {};
  const sortField = query.sort || 'createdAt';
  const sortOrder = query.order === 'asc' ? 'asc' : 'desc';
  
  if (allowedFields.includes(sortField)) {
    orderBy[sortField] = sortOrder;
  } else {
    orderBy.createdAt = 'desc';
  }
  
  return orderBy;
};

/**
 * Build filter object from query
 */
const parseFilters = (query) => {
  const filters = {};

  if (query.status) {
    filters.status = query.status;
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.search) {
    filters.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } }
    ];
  }

  return filters;
};

/**
 * Get all tasks (Admin: all tasks, User: own tasks)
 * GET /api/v1/tasks
 */
const getTasks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const orderBy = parseOrdering(req.query, ['title', 'status', 'priority', 'dueDate', 'createdAt']);
  const filters = parseFilters(req.query);

  // Admin can see all tasks, users see only their own
  if (req.user.role !== 'ADMIN') {
    filters.userId = req.user.id;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: filters,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.task.count({ where: filters })
  ]);

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * Get single task
 * GET /api/v1/tasks/:id
 */
const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found.',
      code: 'NOT_FOUND'
    });
  }

  // Check if user has access to this task
  if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to view this task.',
      code: 'FORBIDDEN'
    });
  }

  res.json({
    success: true,
    data: { task }
  });
});

/**
 * Create new task
 * POST /api/v1/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: { task }
  });
});

/**
 * Update task
 * PUT /api/v1/tasks/:id
 */
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;

  // First check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id }
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: 'Task not found.',
      code: 'NOT_FOUND'
    });
  }

  // Check if user has access to this task
  if (req.user.role !== 'ADMIN' && existingTask.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this task.',
      code: 'FORBIDDEN'
    });
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  res.json({
    success: true,
    message: 'Task updated successfully.',
    data: { task }
  });
});

/**
 * Delete task
 * DELETE /api/v1/tasks/:id
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found.',
      code: 'NOT_FOUND'
    });
  }

  // Check if user has access to this task
  if (req.user.role !== 'ADMIN' && task.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this task.',
      code: 'FORBIDDEN'
    });
  }

  await prisma.task.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: 'Task deleted successfully.'
  });
});

/**
 * Get task statistics (Admin only)
 * GET /api/v1/tasks/stats
 */
const getTaskStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.',
      code: 'ADMIN_REQUIRED'
    });
  }

  const [statusStats, priorityStats, totalTasks, userCount] = await Promise.all([
    prisma.task.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.task.groupBy({
      by: ['priority'],
      _count: true
    }),
    prisma.task.count(),
    prisma.user.count()
  ]);

  res.json({
    success: true,
    data: {
      totalTasks,
      totalUsers: userCount,
      byStatus: statusStats,
      byPriority: priorityStats
    }
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
