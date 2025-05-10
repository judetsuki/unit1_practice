const checkIfTaskValid = (task) => {
  if (!task.title) {
    return { error: 'Title is required' };
  }
  if (!task.description) {
    return { error: 'Description is required' };
  }
  if (!task.status) {
    return { error: 'Status is required' };
  }
  if (!task.due_date) {
    return { error: 'Due date is required' };
  }
  return 1;
}

export default checkIfTaskValid