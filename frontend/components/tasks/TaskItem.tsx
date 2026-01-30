"use client";

import { useState } from "react";
import { Task, TaskUpdate } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<Task | null>;
  onDelete: (taskId: number) => Promise<boolean>;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    setIsCompleting(true);
    
    // Add a small delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    await onUpdate(task.id, { completed: !task.completed });
    
    setLoading(false);
    setIsCompleting(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const result = await onUpdate(task.id, {
      title,
      description: description || undefined,
    });
    if (result) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      await onDelete(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-lg border-2 border-blue-500 dark:border-blue-400 animate-scaleIn">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 px-4 py-3 transition-all duration-200"
            placeholder="Task title"
            maxLength={200}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 px-4 py-3 transition-all duration-200 resize-none"
            placeholder="Task description"
            maxLength={2000}
          />
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading || !title.trim()}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description || "");
                setIsEditing(false);
              }}
              className="rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50 p-6 shadow-lg border-2 ${
        task.completed 
          ? "border-green-200 dark:border-green-800 opacity-75" 
          : "border-transparent hover:border-blue-200 dark:hover:border-blue-800"
      } transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.01] ${
        isCompleting ? "animate-pulse" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Priority/Status Indicator */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-2xl"></div>
      
      {/* Completion Celebration Effect */}
      {isCompleting && !task.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl animate-pulse"></div>
      )}

      <div className="flex items-start gap-4">
        {/* Enhanced Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              disabled={loading}
              className="sr-only peer"
            />
            <div className={`w-7 h-7 rounded-xl border-3 flex items-center justify-center transition-all duration-300 ${
              task.completed
                ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500"
                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
            } shadow-md peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800`}>
              {task.completed && (
                <svg className="w-5 h-5 text-white animate-scaleIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`text-lg font-bold transition-all duration-300 ${
                task.completed
                  ? "line-through text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}
            >
              {task.title}
            </h3>
            
            {/* Quick Status Badge */}
            {!task.completed && (
              <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                Active
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`mt-2 text-sm leading-relaxed transition-all duration-200 ${
                task.completed
                  ? "text-gray-400 dark:text-gray-600"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-2 transition-all duration-300 ${
          showActions ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}>
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            title="Edit task"
            className="group/btn rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-3 text-white disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            title="Delete task"
            className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-3 text-white disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 rounded-2xl transition-all duration-500 pointer-events-none"></div>
    </div>
  );
}
