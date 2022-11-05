INSERT INTO department (dept_name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'), 
        ('HR'),
        ('Legal');


INSERT INTO roles (title, salary, dept_id)
VALUES  ('Account Manager', 90000.00, 3),
        ('Accountant', 72000.00, 3),
        ('Legal Team Lead', 185000.00, 5),
        ('Lawyer', 100000.00, 5),
        ('Sales lead', 80000.00, 1),
        ('Salesperson', 50000.00, 1),
        ('Lead Engineer', 150000.00, 2),
        ('Software Engineer', 125000, 2), 
        ('HR Manager', 100000.00, 4),
        ('Recruiter', 70000.00, 4);
        




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Josh', 'Smith', 2, 10),
        ('Logan', 'Lilley', 4, 11),
        ('Dale', 'Van Hoose', 6, 12),
        ('Mary', 'Charles', 8, 13),
        ('Joseline', 'Sanchez', 4, 11),
        ('Tom', 'Grady', 2, 10),
        ('Patricia', 'Ngeno', 8, 13),
        ('Brandon', 'Johnson', 6, 12), 
        ('Ray', 'Washington', 10, 14),
        ('Jim', 'Ussery', 1, NULL), 
        ('Olivia', 'Obrien', 3, NULL), 
        ('Christina', 'Paul', 5, NULL), 
        ('Thomas', 'Allen', 7, NULL), 
        ('Anna', 'Lawrence', 9, NULL);  



