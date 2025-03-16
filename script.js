//fetching data from the server
async function fetchStudents() {
    try {
        const response = await fetch('data.php?action=get');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        console.log('Fetched Data:', data);
        if (data && data.success === false && data.message) {
            throw new Error(data.message);
        }

        if (Array.isArray(data)) {
            renderStudentTable(data);
        } else {
            throw new Error('Fetched data is not an array');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('There was an error fetching student data: ' + error.message);
    }
}

// Render the student table
function renderStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-2 border">${student.StudentID}</td>
            <td class="px-4 py-2 border">${student.StudentName}</td>
            <td class="px-4 py-2 border">${student.StudentGender}</td>
            <td class="px-4 py-2 border">${student.StudentPayment}</td>
            <td class="px-4 py-2 border">
                <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="editStudent(${student.StudentID})">Edit</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteStudent(${student.StudentID})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add event listener to the form
document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentID = document.getElementById('studentID').value;
    const studentName = document.getElementById('studentName').value;
    const studentGender = document.getElementById('studentGender').value;
    const studentPayment = document.getElementById('studentPayment').value;

    const formData = new FormData();
    formData.append('action', studentID ? 'update' : 'add');
    formData.append('StudentID', studentID);
    formData.append('StudentName', studentName);
    formData.append('StudentGender', studentGender);
    formData.append('StudentPayment', studentPayment);

    try {
        const response = await fetch('data.php', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.success) {
            fetchStudents();
            document.getElementById('formModal').style.display = 'none';
        } else {
            alert(data.message || 'Error saving data');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error saving the student data.');
    }
});

// Edit student 
async function editStudent(studentID) {
    try {
        const response = await fetch(`data.php?action=getById&id=${studentID}`);
        const student = await response.json();
        if (student.message) {
            alert(student.message);
        } else {
            console.log('Student to edit:', student);

            document.getElementById('studentID').value = student.StudentID;
            document.getElementById('studentName').value = student.StudentName;
            document.getElementById('studentGender').value = student.StudentGender;
            document.getElementById('studentPayment').value = student.StudentPayment;

            document.getElementById('formModal').style.display = 'flex';
            document.getElementById('submitBtn').textContent = 'Update Student';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
// Delete student
async function deleteStudent(studentID) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch('data.php', {
                method: 'POST',
                body: new URLSearchParams({ action: 'delete', id: studentID }),
            });
            const data = await response.json();
            if (data.success) {
                fetchStudents();
            } else {
                alert(data.message || 'Error deleting data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Event listeners
document.getElementById('cancelBtn').addEventListener('click', function () {
    document.getElementById('formModal').style.display = 'none';
    document.getElementById('studentForm').reset();
    document.getElementById('submitBtn').textContent = 'Add Student';
});

document.getElementById('btnPost').addEventListener('click', function () {
    document.getElementById('formModal').style.display = 'flex';
    document.getElementById('studentForm').reset();
    document.getElementById('studentID').value = '';
    document.getElementById('submitBtn').textContent = 'Add Student';
});



fetchStudents();
