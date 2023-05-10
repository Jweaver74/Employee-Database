const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
const express = require("express");
const db = require("./config/connection");
const { type } = require("tedious/lib/data-types/null");

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

   

