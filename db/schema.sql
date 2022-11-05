DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;

USE cms_db;


-- department table
CREATE TABLE department(
    id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL 
);


-- role table
CREATE TABLE roles(
    id INT  UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT  PRIMARY KEY ,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    dept_id INT UNSIGNED NOT NULL,
    INDEX dept_in(dept_id),
    FOREIGN KEY (dept_id) 
    REFERENCES department(id) 
    ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 0;

-- employee table
CREATE TABLE employee(
    id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY ,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) 
    ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    manager_confirm BOOLEAN,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) 
    REFERENCES employee(id) 
    ON DELETE SET NULL
    
);


