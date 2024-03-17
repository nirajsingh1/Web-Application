document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const courseID = document.getElementById('courseID').value;
    const taskName = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const details = document.getElementById('details').value;

    const data = {
        courseID,
        taskName,
        dueDate,
        details
    };

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Task submitted successfully!');
            document.getElementById('taskForm').reset();
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to submit task. Please try again.');
    }
});
