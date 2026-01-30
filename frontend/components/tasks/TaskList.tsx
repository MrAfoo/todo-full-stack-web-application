"use client";

import { Task, TaskUpdate } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<Task | null>;
  onDelete: (taskId: number) => Promise<boolean>;
}

export default function TaskList({
  tasks,
  loading,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-12 shadow-xl text-center border border-gray-200 dark:border-gray-700 animate-pulse-subtle">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-12 shadow-xl text-center border border-gray-200 dark:border-gray-700 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-6">
          <svg
            className="w-10 h-10 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first task to get started on your productivity journey!
        </p>
      </div>
    );
  }

  // Separate completed and incomplete tasks
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
      {/* Incomplete Tasks */}
      {incompleteTasks.length > 0 && (
        <div className="animate-slideInLeft">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Active Tasks
            </h2>
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              {incompleteTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {incompleteTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slideInLeft"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="animate-slideInRight">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Completed
            </h2>
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-full">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-4">
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slideInRight"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
