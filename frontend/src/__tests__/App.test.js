import React from 'react';
import { render, screen, fireEvent,act , waitFor } from '@testing-library/react';

import App from '../App'; 
import * as postApi from '../utils/postTasksToServer';
import * as getApi from '../utils/getTasksFromServer'; 
import * as deleteApi from '../utils/deleteTaskFromServer'; 

jest.mock('../utils/postTasksToServer');
jest.mock('../utils/getTasksFromServer');
jest.mock('../utils/deleteTaskFromServer');

beforeAll(() => {
  window.confirm = jest.fn(() => true); 
});

describe('Task Tracker App', () => {
  beforeEach(() => {
    
    getApi.default.mockResolvedValue([
      { id: 1, title: 'Test Task 1', description: 'Description 1', status: false },
      { id: 2, title: 'Test Task 2', description: 'Description 2', status: false },
    ]);
  });

  test('displays no tasks message when there are no tasks', async () => {
  getApi.default.mockResolvedValueOnce([]); 
  await act(async () => {
    render(<App />);
  });
  const noTasksElement = await screen.findByText(/No tasks yet/i);
  expect(noTasksElement).toBeInTheDocument();
});

  test('displays no tasks message when there are no tasks', async () => {
    getApi.default.mockResolvedValueOnce([]); 
      await act(async () => {
          render(<App />);
      });
    const noTasksElement = await screen.findByText(/No tasks yet/i);
    expect(noTasksElement).toBeInTheDocument();
  });

  test('adds a new task', async () => {
      await act(async () => {
          render(<App />);
      });

    
    postApi.default.mockResolvedValueOnce(); 
    getApi.default.mockResolvedValueOnce([
      { id: 1, title: 'Test Task 1', description: 'Description 1', status: false },
      { id: 2, title: 'Test Task 2', description: 'Description 2', status: false },
      { id: 3, title: 'New Task', description: '', status: false }, 
    ]);

    const inputElement = screen.getByPlaceholderText(/Add new task/i);

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New Task' } });
      const buttonElement = screen.getByText(/Add/i);
      fireEvent.click(buttonElement);
    });

    
    await waitFor(() => {
      expect(screen.getByText(/New Task/i)).toBeInTheDocument();
    });

  });

  test('toggles task completion', async () => {
    render(<App />);

      let taskElement;
    await waitFor(async () => {
      taskElement = await screen.findByText(/Test Task 1/i); 
    });


    
    await act(async () => {
      fireEvent.click(taskElement); 
    });

  
    await waitFor(() => {
       expect(taskElement).toHaveClass('task-text');
    });

  });

  test('deletes a task', async () => {
    render(<App />);

    
    let deleteButtons;

    await waitFor(async () => {
       deleteButtons = await screen.findAllByRole('button', { name: /×/i });
    });

    
    deleteApi.default.mockResolvedValueOnce();
    getApi.default.mockResolvedValueOnce([
      { id: 2, title: 'Test Task 2', description: 'Description 2', status: false }, 
    ]);

    
    await act(async () => {
      fireEvent.click(deleteButtons[0]); 
    });


    await waitFor(() => {
      const taskElement = screen.queryByText(/Test Task 1/i);
      expect(taskElement); 
    });
  });


  test('renders the input field for adding a new task', async () => {
      await act(async () => {
          render(<App />);
      });
    const inputElement = screen.getByPlaceholderText(/Add new task/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('renders the add button', async () => {
      await act(async () => {
          render(<App />);
      });
    const buttonElement = screen.getByText(/Add/i);
    expect(buttonElement).toBeInTheDocument();
  });



  test('input field is initially empty', async () => {
      await act(async () => {
          render(<App />);
      });
    const inputElement = screen.getByPlaceholderText(/Add new task/i);
    expect(inputElement.value).toBe('');
  });

  test('clears input field after adding a task', async () => {
    render(<App />);
    
    
    postApi.default.mockResolvedValueOnce(); 
    getApi.default.mockResolvedValueOnce([
      { id: 1, title: 'Test Task 1', description: 'Description 1', status: false },
      { id: 2, title: 'Test Task 2', description: 'Description 2', status: false },
      { id: 3, title: 'New Task', description: '', status: false }, 
    ]);

    const inputElement = screen.getByPlaceholderText(/Add new task/i);
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New Task' } });
      const buttonElement = screen.getByText(/Add/i);
      fireEvent.click(buttonElement);
    });

   
    expect(inputElement.value).toBe('');
  });

  

  test('displays task titles correctly', async () => async () => {
      await act(async () => {
          render(<App />);
      });
    
    const task1Element = await screen.findByText(/Test Task 1/i);
    const task2Element = await screen.findByText(/Test Task 2/i);
    
    expect(task1Element).toBeInTheDocument();
    expect(task2Element).toBeInTheDocument();
  });

  
})
