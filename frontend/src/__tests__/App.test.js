import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

describe('Task Tracker App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(<App />);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the heading', () => {
    expect(screen.getByText(/task tracker/i)).toBeInTheDocument();
  });

  it('renders no tasks message when there are no tasks', () => {
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('does not add empty tasks', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.click(buttonElement);

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('allows users to add a new task', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'New Task' } });
    fireEvent.click(buttonElement);

    expect(screen.getByText(/new task/i)).toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });

  it('allows users to delete a task', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    // Добавляем задачу
    fireEvent.change(inputElement, { target: { value: 'Task to delete' } });
    fireEvent.click(buttonElement);

    const deleteButton = screen.getByRole('button', { name: /×/i });
    // Моким window.confirm на true
    jest.spyOn(window, 'confirm').mockImplementation(() => true);

    fireEvent.click(deleteButton);

    expect(screen.queryByText(/task to delete/i)).not.toBeInTheDocument();

    window.confirm.mockRestore();
  });

  

  it('toggles priority flag opacity', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Task with flag' } });
    fireEvent.click(buttonElement);

    const flagIcon = screen.getByAltText(/priority/i);
    // Изначально opacity 0.5 (false)
    expect(flagIcon).toHaveStyle('opacity: 0.5');

    fireEvent.click(flagIcon);
    expect(flagIcon).toHaveStyle('opacity: 1');

    fireEvent.click(flagIcon);
    expect(flagIcon).toHaveStyle('opacity: 0.5');
  });

  it('opens the task menu editing the correct task', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Task 1' } });
    fireEvent.click(buttonElement);

    fireEvent.change(inputElement, { target: { value: 'Task 2' } });
    fireEvent.click(buttonElement);

    const editButtons = screen.getAllByTitle(/edit/i);
    fireEvent.click(editButtons[1]); // Открываем меню для Task 2

    const taskMenuTextarea = screen.getByPlaceholderText(/write notes here.../i);
    expect(taskMenuTextarea).toBeInTheDocument();

    // Проверяем, что меню для правильной задачи (пока пустое)
    expect(taskMenuTextarea.value).toBe('');
  });

  it('allows editing and saving notes in the task menu', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Task with notes' } });
    fireEvent.click(addButton);

    const editButton = screen.getByTitle(/edit/i);
    fireEvent.click(editButton);

    const taskMenuTextarea = screen.getByPlaceholderText(/write notes here.../i);
    fireEvent.change(taskMenuTextarea, { target: { value: 'Some notes here' } });
    expect(taskMenuTextarea.value).toBe('Some notes here');

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Закрытие меню после сохранения
    expect(screen.queryByPlaceholderText(/write notes here.../i)).not.toBeInTheDocument();

    // Повторно открыть меню и проверить сохраненный текст
    fireEvent.click(screen.getByTitle(/edit/i));
    expect(screen.getByPlaceholderText(/write notes here.../i).value).toBe('Some notes here');
  });

  it('closes menu and discards changes on close', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Task with notes' } });
    fireEvent.click(addButton);

    const editButton = screen.getByTitle(/edit/i);
    fireEvent.click(editButton);

    const taskMenuTextarea = screen.getByPlaceholderText(/write notes here.../i);
    fireEvent.change(taskMenuTextarea, { target: { value: 'Temporary notes' } });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByPlaceholderText(/write notes here.../i)).not.toBeInTheDocument();

    // Повторно открыть меню, чтобы проверить, что изменения не сохранились
    fireEvent.click(screen.getByTitle(/edit/i));
    expect(screen.getByPlaceholderText(/write notes here.../i).value).toBe('');
  });

 
});

/*it('allows users to toggle task completion', () => {
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const buttonElement = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: 'Task to complete' } });
    fireEvent.click(buttonElement);

    const taskElement = screen.getByText(/task to complete/i);
    fireEvent.click(taskElement);

    expect(taskElement).toHaveClass('completed');
  });
  
  it('TaskMenu textarea auto-resizes on value changes', () => {
    // Тестируем именно компонент TaskMenu из export default
    // Чтобы не импортировать отдельно TaskMenu, можно создать вспомогательный компонент в этом тесте:
    const { act: actRTL, rerender } = render(
      <App />
    );
    const inputElement = screen.getByPlaceholderText(/add new task/i);
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.change(inputElement, { target: { value: 'Task for resize test' } });
    fireEvent.click(addButton);
    // Открываем меню редактирования
    const editButton = screen.getByTitle(/edit/i);
    fireEvent.click(editButton);
    const textarea = screen.getByPlaceholderText(/write notes here.../i);
    // Сохраним начальную высоту
    const initialHeight = textarea.style.height;
    // Изменим значение и вызовем событие onChange
    fireEvent.change(textarea, { target: { value: 'Line1\nLine2\nLine3\nLine4\nLine5' } });
    // Ждем эффекта обновления высоты
    act(() => {
      jest.runAllTimers();
    });
  */