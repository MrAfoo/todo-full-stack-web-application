"""Tests for authentication endpoints."""

import pytest


def test_register_user(client):
    """Test user registration."""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_register_duplicate_username(client, test_user):
    """Test registration with duplicate username."""
    response = client.post(
        "/api/auth/register",
        json={
            "username": test_user["user"]["username"],
            "email": "different@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]


def test_register_duplicate_email(client, test_user):
    """Test registration with duplicate email."""
    response = client.post(
        "/api/auth/register",
        json={
            "username": "differentuser",
            "email": test_user["user"]["email"],
            "password": "password123",
        },
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_login_success(client, test_user):
    """Test successful login."""
    response = client.post(
        "/api/auth/login",
        json={
            "username": test_user["user"]["username"],
            "password": test_user["password"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_username(client):
    """Test login with invalid username."""
    response = client.post(
        "/api/auth/login",
        json={"username": "nonexistent", "password": "password123"},
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_login_invalid_password(client, test_user):
    """Test login with invalid password."""
    response = client.post(
        "/api/auth/login",
        json={
            "username": test_user["user"]["username"],
            "password": "wrongpassword",
        },
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]


def test_get_current_user(client, test_user):
    """Test getting current user information."""
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {test_user['token']}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user["user"]["username"]
    assert data["email"] == test_user["user"]["email"]


def test_get_current_user_invalid_token(client):
    """Test getting current user with invalid token."""
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid_token"},
    )
    assert response.status_code == 401
