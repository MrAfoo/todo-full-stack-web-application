"""Task-related Pydantic schemas."""

from datetime import datetime
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    completed: bool | None = None


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: int
    title: str
    description: str | None
    completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
