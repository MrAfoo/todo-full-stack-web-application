/**
 * Custom React hooks for task management.
 */

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Task, TaskCreate, TaskUpdate } from "@/lib/types";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<Task | null>;
  updateTask: (taskId: number, data: TaskUpdate) => Promise<Task | null>;
  deleteTask: (taskId: number) => Promise<boolean>;
}

export function useTasks(userId: number | null): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks(userId);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: TaskCreate): Promise<Task | null> => {
    if (!userId) return null;

    try {
      setError(null);
      const newTask = await api.createTask(userId, data);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create task");
      return null;
    }
  };

  const updateTask = async (
    taskId: number,
    data: TaskUpdate
  ): Promise<Task | null> => {
    if (!userId) return null;

    try {
      setError(null);
      const updatedTask = await api.updateTask(userId, taskId, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      return updatedTask;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update task");
      return null;
    }
  };

  const deleteTask = async (taskId: number): Promise<boolean> => {
    if (!userId) return false;

    try {
      setError(null);
      await api.deleteTask(userId, taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete task");
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
