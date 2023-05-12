const inquirer = require("inquirer");
const express = require("express");
const db = require("./config/connection");
const mysql = require("mysql2/promise");



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



//Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

//Start the application
function startPrompt(){
    inquirer.prompt({
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
            "Exit"
        ]

    }).then(answer => {
        switch(answer.options){
            case "View all Departments":
                viewDepartments();
                break;
            case "View all Roles":
                viewRoles();
                break;
            case "View all Employees":
                viewEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update an Employee Role":
                updateEmployee();
                break;
            case "Exit":
                db.end();
                break;
        }
    })
}

//View all Departments
function viewDepartments(){
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.table(res);
        startPrompt();
    });
}

//View all Roles
function viewRoles(){
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, res) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        console.table(res);
        startPrompt();
    });
}

//View all Employees
function viewEmployees(){
    const sql = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title AS job_title,
    department.department_name, 
    role.salary, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    ORDER BY employee.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
    });
}

//Add a Department
function addDepartment(){
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "What is the name of the department you would like to add?"
    }).then(answer => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        db.query(sql, answer.department, (err, res) => {
            if (err) throw err;
            console.log("Department added.");
            startPrompt();
        });
    });
}

//Add a Role
function addRole(){
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the role you would like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "department",
            message: "What is the department ID for this role?"
        }
    ]).then(function(res){
        db.query("INSERT INTO role(title, salary, department_id) VALUES (?,?,?)", [res,title, res.salary, res.department_id], function(err,data) {
            if (err) {
                res.status(500).json({ error: err.message });
                startPrompt();
            }
            console.table(res);
            startPrompt();
        });
    });

        }

//Add an Employee
function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee you would like to add?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee you would like to add?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the role ID for this employee?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is the manager ID for this employee?"
        }
    ]).then(function(res){
        db.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [res.first_name, res.last_name, res.role_id, res.manager_id], function(err,data) {
            if (err) throw err;
            console.log("Employee added.");

            db.query(`SELECT * FROM employee`, (err, res) => {
                if (err) {
                res.status(500).json({ error: err.message });
                startPrompt();
            }
            console.table(res);
            startPrompt();
        });
    });
});
}

//Update an Employee Role   
function updateEmployee(){
    inquirer.prompt([
        {
            type: "input",
            name: "employee_id",
            message: "What is the ID of the employee you would like to update?"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the new role ID for this employee?"
        }
    ]).then(function(res){
        db.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.employee_id], function(err,data) {
            if (err) throw err;
            console.log("Employee updated.");

            db.query(`SELECT * FROM employee`, (err, res) => {
                if (err) {
                res.status(500).json({ error: err.message });
                startPrompt();
            }
            console.table(res);
            startPrompt();
        });
    });
});
}

//Start the application
startPrompt();

        

   

   

