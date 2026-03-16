const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination');
const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../constants/apiResponse');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return errorResponse(res, 400, 'Title is required');
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'pending',
        userId: req.user.id,
      },
    });

    return successResponse(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { status, search } = req.query;

    const whereClause = {
      userId: req.user.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = await prisma.task.count({
      where: whereClause,
    });

    const pagination = getPaginationMetadata(totalItems, page, limit);

    return successResponse(res, 200, 'Tasks retrieved successfully', { tasks, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(req.params.id, 10),
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, 404, 'Task not found');
    }

    return successResponse(res, 200, 'Task retrieved successfully', { task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    const { title, description, status } = req.body;

    let task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, 404, 'Task not found');
    }

    task = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, status },
    });

    return successResponse(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return errorResponse(res, 404, 'Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return successResponse(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};
