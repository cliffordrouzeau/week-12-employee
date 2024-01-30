const { prompt } = require("inquirer");
const login = require('./config/connection')

questions()

function questions() {

    prompt([
        {
            type:'list',
            name:'choices',
            message:'what are you looking for',
            choices: [
                {
                    name: "View All Departments",
                    value: "vDepartments"
                  },
                  {
                    name: "View All Roles",
                    value: "vRoles"
                  },
                {
                    name: "View All Employees",
                    value: "vEmployees"
                  },
                  {
                    name: "Add Department",
                    value: "aDepartment"
                  },
                  {
                    name: "Add Role",
                    value: "aRole"
                  },
                  {
                    name: "Add Employee",
                    value: "aEmployee"
                  },
                  {
                    name: "Update Employee Role",
                    value: "uEmployee"
                  }
            ]
        }
    ]).then(res => {
      switch(res.choices){
        case "vDepartments":
         return login.query('SELECT department.id, department.name FROM department')
         .then(([row]) => {
          console.table(row)
         }).then(() => questions())

         case "vRoles":
          return login.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;')
          .then(([row]) => {
           console.table(row)
          }).then(() => questions())

          case "vEmployees":
            return login.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
            .then(([row]) => {
             console.table(row)
            }).then(() => questions())
            

            case "aRole":
  prompt([
    {
      name: "title",
      message: "What is the title of the role?"
    },
    {
      name: "salary",
      message: "What is the salary of the role?"
    },
    {
      name: "department_id",
      message: "Which department does the role belong to?",
    }
  ]).then(res => {
    return login.query("INSERT INTO role (title,salary,department_id) VALUES (:title, :salary, :department_id)", {
      replacements: { title: res.title, salary: res.salary, department_id: res.department_id },
      type: login.QueryTypes.INSERT
    });
  }).then(result => {
    console.log(`Added role`);
    questions();
  }).catch(err => {
    console.error("Error:", err);
    questions();
  });
  break;

  case "aDepartment":
  prompt([
    {
      name: "name",
      message: "What is the department name?"
    }
  ]).then(res => {
    let name = res.name;
    return login.query("INSERT INTO department (name) VALUES (:name)", {
      replacements: { name: name },
      type: login.QueryTypes.INSERT
    });
  }).then(result => {
    console.log(`Added department`);
    questions();
  }).catch(err => {
    console.error("Error:", err);
    questions();
  });
  break;

  case "aEmployee":
  prompt([
    {
      name: "firstname",
      message: "What is the employee's first name?"
    },
    {
      name: "lastname",
      message: "What is the employee's last name?"
    },
    {
      name: "roleId",
      message: "What is the employee's role id?"
    },
    {
      name: "managerId",
      message: "What is the managers id? (optional)"
    }
  ]).then(res => {
    return login.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (:first_name,:last_name,:role_id,:manager_id)", {
      replacements: { first_name: res.firstname, last_name:res.lastname, role_id:res.roleId, manager_id:res.managerId },
      type: login.QueryTypes.INSERT
    });
  }).then(result => {
    console.log(`Added employee`);
    questions();
  }).catch(err => {
    console.error("Error:", err);
    questions();
  });
  break;

  case "uEmployee":
  prompt([
    {
      name: "employeeId",
      message: "What is the employee's id?"
    },
    {
      name: "roleId",
      message: "What is the id of the role you want to assign?"
    }
  ]).then(res => {
    return login.query("UPDATE employee SET role_id = :roleId WHERE id = :employeeId", {
      replacements: { roleId: res.roleId, employeeId: res.employeeId },
      type: login.QueryTypes.UPDATE
    });
  }).then(result => {
    console.log(`updated employee`);
    questions();
  }).catch(err => {
    console.error("Error:", err);
    questions();
  });
  break;





  
      }
    })
}