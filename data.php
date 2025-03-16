<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$filePath = 'students.json';

if (file_exists($filePath)) {
    $fileContent = file_get_contents($filePath);
    $students = json_decode($fileContent, true);

    if (!is_array($students)) {
        $students = [];
    }
} else {
    $students = [];
} 


// Get the action from the request
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action == 'get') {
    echo json_encode($students);
} elseif ($action == 'getById') {
    $id = $_GET['id'] ?? null;
    if ($id === null) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }
    $student = null;
    foreach ($students as $s) {
        if ($s['StudentID'] == $id) {
            $student = $s;
            break;
        }
    }
    if ($student) {
        echo json_encode($student);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
    }
} elseif ($action == 'add') {
    $studentName = $_POST['StudentName'] ?? null;
    $studentGender = $_POST['StudentGender'] ?? null;
    $studentPayment = $_POST['StudentPayment'] ?? null;

    if (!$studentName || !$studentGender || !$studentPayment) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    $newStudent = [
        'StudentID' => count($students) + 1,
        'StudentName' => $studentName,
        'StudentGender' => $studentGender,
        'StudentPayment' => $studentPayment,
    ];

    $students[] = $newStudent;
    file_put_contents($filePath, json_encode($students));
    echo json_encode(['success' => true, 'message' => 'Student added successfully', 'student' => $newStudent]);
} elseif ($action == 'update') {
    $studentID = $_POST['StudentID'] ?? null;
    $studentName = $_POST['StudentName'] ?? null;
    $studentGender = $_POST['StudentGender'] ?? null;
    $studentPayment = $_POST['StudentPayment'] ?? null;

    if (!$studentID || !$studentName || !$studentGender || !$studentPayment) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    $studentFound = false;
    foreach ($students as &$student) {
        if ($student['StudentID'] == $studentID) {
            $student['StudentName'] = $studentName;
            $student['StudentGender'] = $studentGender;
            $student['StudentPayment'] = $studentPayment;
            $studentFound = true;
            break;
        }
    }
    if ($studentFound) {
        file_put_contents($filePath, json_encode($students));
        echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
    }
} elseif ($action == 'delete') {
    $studentID = $_POST['id'] ?? null;
    if (!$studentID) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }
    $studentFound = false;
    foreach ($students as $index => $student) {
        if ($student['StudentID'] == $studentID) {
            unset($students[$index]);
            $studentFound = true;
            break;
        }
    }
    if ($studentFound) {
        file_put_contents($filePath, json_encode(array_values($students)));
        echo json_encode(['success' => true, 'message' => 'Student deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
