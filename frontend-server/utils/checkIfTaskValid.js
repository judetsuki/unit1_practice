const checkIfTaskValid = (task) => {
  if (!task.title) {
    return { error: 'Title is required' };
  }
  if (!task.description) {
    return { error: 'Description is required' };
  }
  return true;
}

export default checkIfTaskValid