INSERT INTO department (name)
VALUES 
('Sales'), 
('Engineering'), 
('Finance'), 
('Legal');


INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Lead', 100000.00, 1), 
('Salesperson', 80000.00, 1), 
('Lead Engineer', 150000.00, 2), 
('Software Engineer', 120000.00, 2), 
('Accountant', 125000.00, 3), 
('Junior Accountant', 70000.00, 3),
('Legal Team Lead', 250000.00, 4), 
('Lawyer', 190000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Jason', 'Weaver', 1, NULL), 
('Mike', 'Chan', 2, 1), 
('Ashley', 'Rodriguez', 3, NULL), 
('Kevin', 'Little', 4, 3), 
('Martha', 'Brown', 5, NULL), 
('Sarah', 'James', 6, 5), 
('Tom', 'Allen', 7, NULL), 
('Mike', 'Smith', 8, 7);
```