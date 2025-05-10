# Standard library imports
from datetime import datetime, timezone
from os import environ

# Third-party imports
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow all origins for testing
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Use environment database URL only if not in testing mode
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL', 'sqlite:///tasks.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Enable external access
app.config['SERVER_NAME'] = None

db = SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # Changed from Boolean to String
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

@app.route('/tasks', methods=['GET'])
def get_tasks():
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '').strip()
    
    query = Task.query
    
    # Apply search filter
    if search:
        query = query.filter(
            db.or_(
                Task.title.ilike(f'%{search}%'),
                Task.description.ilike(f'%{search}%')
            )
        )
    
    # Apply status filter
    if status_filter:
        query = query.filter(Task.status == status_filter)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    } for task in tasks])

@app.route('/tasks/search', methods=['GET'])
def search_tasks():
    query = request.args.get('q', '').strip()
    description_only = request.args.get('description_only', '').lower() == 'true'
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    if description_only:
        filters = [Task.description.ilike(f'%{query}%')]
    else:
        filters = [
            db.or_(
                Task.title.ilike(f'%{query}%'),
                Task.description.ilike(f'%{query}%')
            )
        ]
        
    tasks = Task.query.filter(*filters).order_by(Task.created_at.desc()).all()
    
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat(),
        'matches': {
            'title': query.lower() in task.title.lower(),
            'description': query.lower() in (task.description or '').lower()
        }
    } for task in tasks])

@app.route('/tasks/search/description', methods=['GET'])
def search_descriptions():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    # Search only in descriptions
    tasks = Task.query.filter(Task.description.ilike(f'%{query}%')).order_by(Task.created_at.desc()).all()
    
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat(),
        'match_position': task.description.lower().find(query.lower())
    } for task in tasks])

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    
    task = Task(
        title=data['title'],
        description=data.get('description'),
        status=data.get('status', False),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    }), 201

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        abort(404)
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        abort(404)
    data = request.get_json()
    
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    if 'due_date' in data:
        task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
    
    db.session.commit()
    
    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat()
    })

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = db.session.get(Task, task_id)
    if task is None:
        abort(404)
    db.session.delete(task)
    db.session.commit()
    return '', 204

@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Task Tracker API</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
            .endpoint { background: #f4f4f4; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
            code { background: #e0e0e0; padding: 0.2rem 0.4rem; border-radius: 2px; }
        </style>
    </head>
    <body>
        <h1>Welcome to the Task Tracker API!</h1>
        <p>Available endpoints:</p>
        
        <div class="endpoint">
            <h3>GET /tasks</h3>
            <p>Get all tasks</p>
            <p>Try it: <a href="/tasks" target="_blank">/tasks</a></p>
        </div>
        
        <div class="endpoint">
            <h3>GET /tasks/{task_id}</h3>
            <p>Get a specific task</p>
            <p>Example: <a href="/tasks/1" target="_blank">/tasks/1</a></p>
        </div>
        
        <div class="endpoint">
            <h3>POST /tasks</h3>
            <p>Create a new task</p>
            <code>
            {
                "title": "Task title",
                "description": "Task description",
                "status": "pending",
                "due_date": "2025-12-31T23:59:59"
            }
            </code>
        </div>
        
        <div class="endpoint">
            <h3>PUT /tasks/{task_id}</h3>
            <p>Update a task</p>
        </div>
        
        <div class="endpoint">
            <h3>DELETE /tasks/{task_id}</h3>
            <p>Delete a task</p>
        </div>
    </body>
    </html>
    """

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)