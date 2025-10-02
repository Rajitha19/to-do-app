import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validateTask } from '../validators/taskValidator';

const router = Router();
const taskController = new TaskController();

// GET /api/tasks - Get the 5 most recent incomplete tasks
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a new task
router.post('/', validateTask, taskController.createTask);

// PUT /api/tasks/:id/complete - Mark a task as completed
router.put('/:id/complete', taskController.completeTask);

export default router;
