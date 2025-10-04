import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types/task.types';

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description } = req.body;
  const errors: ValidationError[] = [];

  // Validate title
  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (title.trim().length > 255) {
    errors.push({
      field: 'title',
      message: 'Title cannot exceed 255 characters',
    });
  }

  // Validate description (optional)
  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push({
        field: 'description',
        message: 'Description must be a string',
      });
    } else if (description.length > 1000) {
      errors.push({
        field: 'description',
        message: 'Description cannot exceed 1000 characters',
      });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  next();
};
