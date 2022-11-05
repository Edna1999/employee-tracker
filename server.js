const inquirer = require('inquirer');
const { listenerCount } = require('./Assets/script/connection');
const db = require('./Assets/script/connection');

const cms = async() => {
    inquirer
    .prompt([
            {
                type:'list',
                name:'options',
                message: 'What would you like to do?',
                choices:[
                'View all departments', 
                'View all roles', 
                'View all employees', 
                'View employees by department',
                'View employees by manager',
                'View total budget departments',
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employees role',
                'Update an employees manager',
                'Delete employee',
                'Delete role', 
                'Delete department',
                'Quit'
                 ],
                 loop:false,
                validate: (value) => {if(value){return true} else{return "Must choose one!"}},
            }
        ])
        .then((choice) => {
           
       switch(choice.options){
        
        case 'View all departments':
           
            viewAllDepts();
        
           
            break;

        case 'View all roles':
            viewAllRoles()
           
            break;  
            
        case 'View all employees':

            viewAllEmps()

            break;

        case 'View employees by department':

            viewByDept()

            break;
    
       case 'View employees by manager':

            viewByManager()

            break;

        case 'View total budget departments':

            viewSum()

            break;
        
        case 'Add a department':
 
             createDept();
               
                break;   
    
         case 'Add a role':
    
            addRole();
               
                break; 
     
        case 'Add an employee':
    
               addEmp()

               break;
    
        case 'Update an employees role':
    
            updateEmpRole()

                break;

        case 'Update an employees manager':
    
            updateEmpManager()
        
            break;
        
        case'Delete employee':
            
            deleteEmp()
       
            break;

        case'Delete role':
            
            deleteRole()
       
            break;

        case'Delete department':
            
            deleteDept()
       
            break;

        case 'Quit':

            process.exit()

    
        default:
        
               console.log('You must select one!');
        break;
       }

        })

    }
       
    //view all roles
    const viewAllRoles = () => {

        db.query(`SELECT * FROM roles INNER JOIN department ON roles.dept_id = department.id`, (err, res) => {
  
               if(err){
  
                console.error(err);
  
               } else {
                   
                console.table(res);
               }
            
                   cms();
               
      })
    
   }
   //view all depts
   const viewAllDepts = () => {

     db.query(`SELECT * FROM department`, (err, res) => {

       if(err){

        console.error(err);

       } else {
           
        console.table(res);
       }
      
       cms();
})
   };


   //view all emps
   const viewAllEmps = () => {

    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
    FROM employee 
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN roles ON employee.role_id = roles.id
    INNER JOIN department ON department.id = roles.dept_id;`, (err, res) => {

        if(err){

            console.error(err);

        } else {
            
            console.table(res);
        }

        cms();
})
};


//add new dept
const createDept = async(dept) => {
await inquirer
.prompt([
    {
        type:'input',
        name:'addDept',
        message: 'What is the name of the department?',
        validate: (value) => {if(value){return true} else{return "Must make entry!"}},
    }
])
.then((result) => {
   db.query(`INSERT INTO department (dept_name) VALUES (?)`, result.addDept)


    console.log(`Department ${result.addDept} was added to database!`)

    viewAllDepts(dept)
            
   
    

    
})
};


// function to push into empty array 
const employeesArray = [];
const query1 = 'SELECT first_name, last_name, CONCAT(first_name, " ", last_name) AS name FROM employee';
 db.query(query1, (err, res) => {
     if (err) throw err;
     res.forEach(({name}) => {
         employeesArray.push(name);
     });
 });

 const rolesArray = [];
 const query2 = `SELECT title FROM roles`
 db.query(query2, (err, res) => {
   if (err) throw err;
   res.forEach(({title}) => {
     rolesArray.push(title);
});
});

const deptsArray = [];
 const query3 = `SELECT dept_name FROM department`
 db.query(query3, (err, res) => {
   if (err) throw err;
   res.forEach(({dept_name}) => {
     deptsArray.push(dept_name);
});
});

const managerArray = []
   const query4 = 'SELECT employee.first_name, employee.last_name, CONCAT(manager.first_name, " ",manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id;'
    db.query(query4, (err, res) => {
     if (err) throw err; 
        res.forEach(({manager}) => {
            if(manager !== null && !managerArray.includes(manager)){

                managerArray.push(manager);
            }
            
        });
   
 });


 //add a role
const addRole = async(role) => {

   await inquirer
    .prompt([
        {
             type:'input',
             name:'addRole',
             message: 'What is the name of the role?',
             validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {   
            type:'input',
            name:'salary',
            message: 'What is the salary of the role?',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'dept',
            message: 'What department does the role belong to?',
            choices: deptsArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        }
    ])
    .then((result) => {

        let dept_id;

        for(let i = 0; i < deptsArray.length; i++){

            if(deptsArray[i] === result.dept){
                dept_id = i++;
            }
        }

     db.query(`INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`, [result.addRole, result.salary, dept_id])

     
        console.log(`Role ${result.addRole} was added to database!`)


        viewAllRoles(role)
    
  
    })
       
};


//add an employee
const addEmp = async(emp) =>{
     await inquirer
      .prompt([
        {
             type:'input',
             name:'firstName',
             message: 'What is the employees first name?',
             validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'input',
            name:'lastName',
            message: 'What is the employees last name?',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'role',
            message: 'What is the role id you want to assign to them?',
            choices: rolesArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'manager',
            message: 'Who is the manager you would like to assign to this employee?',
            choices: managerArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        }
      ])

     .then((result) => {

        let role_id;
        let manager_id;

        for(let i = 0; i < rolesArray.length; i++){
            if(rolesArray[i] === result.role){

                role_id = i++;
            }
        }

        for(let i = 0; i < managerArray.length; i++){
            if(managerArray[i] === result.manager){

                manager_id = i++;
            }
        }
        

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [result.firstName, result.lastName, role_id, manager_id])
        
         console.log(`${result.firstName} ${result.lastName} was added to database!`)
       

         viewAllEmps(emp)
        

});


}

//update an employee role
const updateEmpRole = async(update) => {

    await inquirer
    .prompt([
        {
            type:'list',
            name:'updateEmp',
            message: 'Which employee would you like to update?',
            choices: employeesArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'updateRole',
            message: 'Which role do you want to assign the selected employee?',
            choices: rolesArray,
            loop: false,
            validate: (value) => {if(value){return 'updated employees role'} else{return "Must make entry!"}},
        }
    ])
.then((result) => {
    let emp_id;

    for(let i = 0; i < employeesArray.length; i++){
        if(employeesArray[i] === result.updateEmp){

            emp_id = i++;
        }
    }


     db.query('UPDATE employee SET role_id =  (SELECT id FROM roles WHERE title = ?) WHERE id = ?', [result.updateRole, emp_id])

     console.log(`${result.updateEmp} was updated!`)

    viewAllEmps(update)


});

}

//update an employee manager
const updateEmpManager = async(update) => {
    
    await inquirer
    .prompt([
        {
            type:'list',
            name:'updateEmp',
            message: 'Which employee would you like to update?',
            choices: employeesArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'updateMan',
            message: 'Which manager do you want to assign the selected employee?',
            choices: managerArray,
            validate: (value) => {if(value){return 'updated employees role'} else{return "Must make entry!"}},
        }
    ])
.then((result) => {

    let manager_id;
    let emp_id;


    for(let i = 0; i < managerArray.length; i++){
        if(managerArray[i] === result.manager){

            manager_id = i + 10;
        }
    }


    for(let i = 0; i < employeesArray.length; i++){
        if(employeesArray[i] === result.updateEmp){

            emp_id = i++;
        }
    }


     db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [manager_id, emp_id])

     console.log(`${result.updateEmp} was updated!`)

    viewAllEmps(update)


});

}


//delete an employee
const deleteEmp = async(del) => {

    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'delEmp',
            message: 'Which employee would you like to delete?' ,
            choices: employeesArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}}
        }
    ])
  .then((result) => {

    let emp_id;

    for(let i = 0; i < employeesArray.length; i++){
        if(employeesArray[i] === result.delEmp){

            emp_id = i++;
        }
    }

    db.query('DELETE FROM employee WHERE id = ?', [emp_id]);

    console.log(`${result.delEmp} was deleted from database!`)

    viewAllEmps(del)

  })

}

//delete a role
const deleteRole = async(del) => {

    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'delRole',
            message: 'Which role would you like to delete?' ,
            choices: rolesArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}}
        }
    ])
  .then((result) => {

    let role_id;

    for(let i = 0; i < rolesArray.length; i++){
        if(rolesArray[i] === result.delRole){

            role_id = i++;
        }
    }

    db.query('DELETE FROM roles WHERE id = ?', [role_id]);

    console.log(`${result.delRole} was deleted from database!`)

    viewAllRoles(del)

  });

}


//delete a department
const deleteDept = async(del) => {

    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'delDept',
            message: 'Which department would you like to delete?' ,
            choices: deptsArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}}
        }
    ])
  .then((result) => {

    let dept_id;

    for(let i = 0; i < deptsArray.length; i++){
        if(deptsArray[i] === result.delDept){

            dept_id = i++;
        }
    }

    db.query('DELETE FROM department WHERE id = ?', [dept_id]);

    console.log(`${result.delDept} was deleted from database!`)

    viewAllDepts(del)

  })

}


//view employee by department
const viewByDept = async() => {
    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'dept',
            message: 'Which departments employees would you like to see?',
            choices: deptsArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}}

        }
    ])

    .then((result) => {


        db.query(`SELECT employee.first_name, employee.last_name, department.dept_name AS department FROM employee LEFT JOIN roles
             ON employee.role_id = roles.id LEFT JOIN department ON roles.dept_id = department.id WHERE department.dept_name = ?;`,[result.dept], (err, res) => {

            if(err){
     
             console.error(err);
     
            } else {
                
             console.table(res);
            }
        })

        console.log(`${result.dept} was selected!`)

        cms()


    })

}


//view employees by manager
const viewByManager = async() => {

    await inquirer
    .prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Which managers employees would you like to see?',
            choices: managerArray,
            validate: (value) => {if(value){return true} else{return "Must make entry!"}}
        }
    
    ])

    .then((result) => {

        let manager_id;

        for(let i = 0; i < managerArray.length; i++){
            if(managerArray[i] === result.manager){
    
                manager_id = i + 10;
            }
        }
          
            db.query(`SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE manager.id = ?;`, [manager_id], (err, res) => {

                if(err){
        
                    console.error(err);
        
                } else {
                    
                    console.table(res);
                }
        
                cms()
            })
    })
}


// view budget by department

const viewSum = async() => {
   
    db.query('SELECT department.id, department.dept_name AS department, SUM(roles.salary) AS budget FROM department LEFT JOIN roles ON roles.dept_id = department.id GROUP BY department.id',  (err, res) => {

        if(err){

            console.error(err);

        } else {
            
            console.table(res);
        }

        cms()
    
  })
}

cms();
