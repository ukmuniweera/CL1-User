-- Login to MySQL
-- mysql -u root -p

-- Step 1: Create and Use Database
CREATE DATABASE IF NOT EXISTS UniversitySystem;
USE UniversitySystem;

-- Step 2: Create Students Table
CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create Courses Table
CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    credits INT CHECK (credits <= 5)
);

-- Step 4: Create Enrollments Table
CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    grade INT CHECK (grade BETWEEN 0 AND 100),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Step 5: Create Indexes

-- i. Index on email column in Students
CREATE INDEX idx_students_email ON Students(email);

-- ii. Index on student_id and course_id in Enrollments
CREATE INDEX idx_enrollments_student_course ON Enrollments(student_id, course_id);

-- iii. Unique index on course_name in Courses
CREATE UNIQUE INDEX idx_courses_name ON Courses(course_name);

-- iv. Drop the index idx_students_email
DROP INDEX idx_students_email ON Students;

-- v. Show all indexes on Enrollments
SHOW INDEX FROM Enrollments;

-- Step 6: Stored Procedures

DELIMITER //

-- i. GetEnrollmentCount
CREATE PROCEDURE GetEnrollmentCount(IN input_student_id INT)
BEGIN
    SELECT COUNT(*) AS total_courses
    FROM Enrollments
    WHERE student_id = input_student_id;
END;
//

-- ii. GetStudentAvgGrade
CREATE PROCEDURE GetStudentAvgGrade(IN input_student_id INT)
BEGIN
    SELECT AVG(grade) AS average_grade
    FROM Enrollments
    WHERE student_id = input_student_id;
END;
//

-- iii. UpdateStudentEmail
CREATE PROCEDURE UpdateStudentEmail(IN input_student_id INT, IN new_email VARCHAR(100))
BEGIN
    UPDATE Students
    SET email = new_email
    WHERE student_id = input_student_id;
END;
//

-- iv. AvgGradeByCourse
CREATE PROCEDURE AvgGradeByCourse(IN input_course_id INT)
BEGIN
    SELECT AVG(grade) AS avg_grade
    FROM Enrollments
    WHERE course_id = input_course_id;
END;
//

-- v. MaxGradeByCourse
CREATE PROCEDURE MaxGradeByCourse(IN input_course_id INT)
BEGIN
    SELECT MAX(grade) AS max_grade
    FROM Enrollments
    WHERE course_id = input_course_id;
END;
//

-- vi. MinGradeByCourse
CREATE PROCEDURE MinGradeByCourse(IN input_course_id INT)
BEGIN
    SELECT MIN(grade) AS min_grade
    FROM Enrollments
    WHERE course_id = input_course_id;
END;
//

-- vii. EnrollmentsByStudent
CREATE PROCEDURE EnrollmentsByStudent(IN input_student_id INT)
BEGIN
    SELECT COUNT(*) AS total_enrollments
    FROM Enrollments
    WHERE student_id = input_student_id;
END;
//

-- viii. EnrollmentsByCourse
CREATE PROCEDURE EnrollmentsByCourse(IN input_course_id INT)
BEGIN
    SELECT COUNT(*) AS total_students
    FROM Enrollments
    WHERE course_id = input_course_id;
END;
//

-- ix. DeleteEnrollmentsByStudent
CREATE PROCEDURE DeleteEnrollmentsByStudent(IN input_student_id INT)
BEGIN
    DELETE FROM Enrollments
    WHERE student_id = input_student_id;
END;
//

-- x. CourseListByStudent
CREATE PROCEDURE CourseListByStudent(IN input_student_id INT)
BEGIN
    SELECT C.course_name, E.grade
    FROM Enrollments E
    JOIN Courses C ON E.course_id = C.course_id
    WHERE E.student_id = input_student_id;
END;
//

DELIMITER ;

-- Step 7: Insert Sample Data

-- Insert Students
INSERT INTO Students (full_name, age, email) VALUES 
('Alice Perera', 20, 'alice@gmail.com'),
('Bob Silva', 22, 'bob@gmail.com'),
('Carol Fernando', 19, 'carol@gmail.com');

-- Insert Courses
INSERT INTO Courses (course_name, credits) VALUES
('Mathematics', 3),
('Physics', 4),
('Chemistry', 5);

-- Insert Enrollments
INSERT INTO Enrollments (student_id, course_id, grade) VALUES
(1, 1, 85),  -- Alice in Mathematics
(1, 2, 90),  -- Alice in Physics
(2, 1, 70),  -- Bob in Mathematics
(2, 3, 65),  -- Bob in Chemistry
(3, 2, 88);  -- Carol in Physics

-- Step 8: Test Stored Procedures

-- i. Get total enrollments for student_id = 1 (Alice)
CALL GetEnrollmentCount(1);

-- ii. Get average grade for student_id = 1
CALL GetStudentAvgGrade(1);

-- iii. Update Alice's email
CALL UpdateStudentEmail(1, 'alice.new@gmail.com');

-- iv. Get average grade in course_id = 1 (Mathematics)
CALL AvgGradeByCourse(1);

-- v. Get max grade in course_id = 2 (Physics)
CALL MaxGradeByCourse(2);

-- vi. Get min grade in course_id = 3 (Chemistry)
CALL MinGradeByCourse(3);

-- vii. Get total enrollments of student_id = 2 (Bob)
CALL EnrollmentsByStudent(2);

-- viii. Get total students in course_id = 2 (Physics)
CALL EnrollmentsByCourse(2);

-- ix. Delete enrollments of student_id = 3 (Carol)
CALL DeleteEnrollmentsByStudent(3);

-- x. Show list of course names and grades for student_id = 1 (Alice)
CALL CourseListByStudent(1);