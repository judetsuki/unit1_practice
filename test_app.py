import pytest
from app import app, db, Task
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture(autouse=True)
def app_context():
    """Set up app context and test database"""
    # Use the same PostgreSQL database as the main app
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['TESTING'] = True
    
    with app.app_context():
        # Start a transaction
        connection = db.engine.connect()
        transaction = connection.begin()
        
        # Create tables if they don't exist
        db.create_all()
        
        yield
        
        # Rollback the transaction after each test
        transaction.rollback()
        connection.close()

@pytest.fixture
def client():
    return app.test_client()

@pytest.fixture
def sample_task(client):
    """Create a sample task and return its ID"""
    task_data = {
        'title': 'Test Task',
        'description': 'Testing our task tracker API',
        'status': 'pending',
        'due_date': '2025-05-10T15:00:00'
    }
    
    response = client.post('/tasks', json=task_data)
    data = response.get_json()
    return data['id']

def test_create_task(client):
    """Test creating a new task"""
    task_data = {
        'title': 'Test Task',
        'description': 'Testing our task tracker API',
        'status': 'pending',
        'due_date': '2025-05-10T15:00:00'
    }
    
    response = client.post('/tasks', json=task_data)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['title'] == task_data['title']
    assert data['description'] == task_data['description']
    assert data['status'] == task_data['status']
    assert data['due_date'] == task_data['due_date']

def test_get_all_tasks(client, sample_task):
    """Test retrieving all tasks"""
    response = client.get('/tasks')
    assert response.status_code == 200
    
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert any(task['id'] == sample_task for task in data)

def test_get_specific_task(client, sample_task):
    """Test retrieving a specific task"""
    response = client.get(f'/tasks/{sample_task}')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['id'] == sample_task
    assert data['title'] == 'Test Task'

def test_update_task(client, sample_task):
    """Test updating a task's status"""
    update_data = {'status': 'in_progress'}
    response = client.put(f'/tasks/{sample_task}', json=update_data)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['status'] == 'in_progress'

def test_delete_task(client, sample_task):
    """Test deleting a task"""
    response = client.delete(f'/tasks/{sample_task}')
    assert response.status_code == 204
    
    # Verify task is deleted
    response = client.get(f'/tasks/{sample_task}')
    assert response.status_code == 404

def test_create_task_without_title(client):
    """Test creating a task without a required title"""
    task_data = {
        'description': 'Testing our task tracker API',
        'status': 'pending',
        'due_date': '2025-05-10T15:00:00'
    }
    
    response = client.post('/tasks', json=task_data)
    assert response.status_code == 400

def test_update_nonexistent_task(client):
    """Test updating a task that doesn't exist"""
    update_data = {'status': 'in_progress'}
    response = client.put('/tasks/999', json=update_data)
    assert response.status_code == 404

def test_delete_nonexistent_task(client):
    """Test deleting a task that doesn't exist"""
    response = client.delete('/tasks/999')
    assert response.status_code == 404