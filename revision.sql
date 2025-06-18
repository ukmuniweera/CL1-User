mysql -u root -p

CREATE DATABASE university;

USE university;

CREATE TABLE departments(
    dept_id INT NOT NULL PRIMARY KEY, 
    dept_name VARCHAR(25)
);

CREATE TABLE students(
    student_id INT NOT NULL PRIMARY KEY, 
    name VARCHAR(25), 
    email VARCHAR(50), 
    dept_id INT,
    FOREIGN KEY(dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE courses(
    course_id INT NOT NULL PRIMARY KEY,  
    course_name VARCHAR(25), 
    dept_id INT,
    FOREIGN KEY(dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE enrollments(
    enroll_id INT NOT NULL PRIMARY KEY, 
    student_id INT, 
    course_id INT, 
    grade VARCHAR(5),
    FOREIGN KEY(student_id) REFERENCES students(student_id),
    FOREIGN KEY(course_id) REFERENCES courses(course_id)
);

INSERT INTO departments (dept_id, dept_name) VALUES
(1, 'Computer Science'),
(2, 'Mathematics'),
(3, 'Physics');

INSERT INTO students (student_id, name, email, dept_id) VALUES
(101, 'Alice', 'alice@example.com', 1),
(102, 'Bob', 'bob@example.com', 2),
(103, 'Charlie', 'charlie@example.com', 1),
(104, 'David', 'david@example.com', 3);

INSERT INTO courses (course_id, course_name, dept_id) VALUES
(201, 'Data Structures', 1),
(202, 'Algorithms', 1),
(203, 'Calculus', 2),
(204, 'Quantum Physics', 3);

INSERT INTO enrollments (enroll_id, student_id, course_id, grade) VALUES
(301, 101, 201, 'A'),
(302, 101, 202, 'B'),
(303, 102, 203, 'A'),
(304, 103, 201, 'C'),
(305, 104, 204, NULL);

-- 1
CREATE INDEX index_email ON students(email);

-- 2
ALTER TABLE students
MODIFY email VARCHAR(50) NOT NULL,
ADD CONSTRAINT check_email UNIQUE(email);

INSERT INTO students (student_id, name, email, dept_id) 
VALUES (1, 'Galvin', NULL, NULL);

ALTER TABLE students
ADD CONSTRAINT fk_student_department
FOREIGN KEY (dept_id) REFERENCES departments(dept_id);

-- 3
DELIMITER //
CREATE PROCEDURE getStudentCourses(INOUT stu_id INT)
BEGIN
    SELECT * FROM students WHERE student_id = stu_id;
END; //
DELIMITER ;

SET @id = 103;
CALL getStudentCourses(@id);

-- 4
START TRANSACTION;

INSERT INTO students (student_id, name, email, dept_id) 
VALUES (105, 'Bovis', 'bovis@example.com', 1);

INSERT INTO enrollments (enroll_id, student_id, course_id, grade) 
VALUES (306, 105, 201, 'A');

ROLLBACK;

-- 5
DELIMITER //
CREATE TRIGGER set_default_grade
BEFORE INSERT ON enrollments
FOR EACH ROW
BEGIN
    IF NEW.grade IS NULL THEN
        SET NEW.grade = 'F';
    END IF;
END; //
DELIMITER ;

CREATE TABLE deleted_students(
    student_id INT, 
    name VARCHAR(25), 
    email VARCHAR(50), 
    dept_id INT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER // 
CREATE TRIGGER log_student_deletion
BEFORE DELETE ON students
FOR EACH ROW
BEGIN
    INSERT INTO deleted_students (student_id, name, email, dept_id) 
    VALUES (OLD.student_id, OLD.name, OLD.email, OLD.dept_id);
END; //
DELIMITER ;

INSERT INTO students (student_id, name, email, dept_id) 
VALUES (0, 'Alvin', 'alvin@example.com', NULL);

SELECT * FROM students;

DELETE FROM students WHERE student_id = 0;

SELECT * FROM deleted_students;
