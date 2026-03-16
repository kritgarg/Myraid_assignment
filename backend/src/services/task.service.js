const prisma = require('../config/db');
const { getPaginationParams, getPaginationMetadata } = require('../utils/pagination');

exports.createTask = async (userId, taskData) => {
  return prisma.task.create({
    data: {
      ...taskData,
      userId,
    },
  });
};

exports.getTasks = async (userId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { status, search } = query;

  const whereClause = {
    userId,
  };

  if (status) {
    whereClause.status = status;
  }

  if (search) {
    whereClause.title = {
      contains: search,
      mode: 'insensitive', // PostgreSQL specific
    };
  }

  const [tasks, totalItems] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({
      where: whereClause,
    }),
  ]);

  const pagination = getPaginationMetadata(totalItems, page, limit);

  return { tasks, pagination };
};

exports.getTaskById = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
      userId,
    },
  });

  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  return task;
};

exports.updateTask = async (userId, taskId, updateData) => {
  // Check if task belongs to user
  const task = await prisma.task.findFirst({
    where: { id: Number(taskId), userId },
  });

  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  return prisma.task.update({
    where: { id: Number(taskId) },
    data: updateData,
  });
};

exports.deleteTask = async (userId, taskId) => {
  // Check if task belongs to user
  const task = await prisma.task.findFirst({
    where: { id: Number(taskId), userId },
  });

  if (!task) {
    throw new Error('Task not found or unauthorized');
  }

  await prisma.task.delete({
    where: { id: Number(taskId) },
  });

  return { message: 'Task deleted successfully' };
};
