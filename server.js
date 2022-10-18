const inquirer = require('inquirer');
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
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employees role',
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
    
            updateEmp()

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

        db.query(`SELECT * FROM roles LEFT JOIN department ON roles.dept_id = department.id`, (err, res) => {
  
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

    db.query(`SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id`, (err, res) => {

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
            type:'inout',
            name:'dept',
            message: 'What department does the role belong to?',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        }
    ])
    .then((result) => {
     db.query(`INSERT INTO roles (title, salary, dept_id) VALUES (?, ?, ?)`, [result.addRole, result.salary, result.dept])

     
        console.log(`Role ${result.addRole} was added to database!`)

        viewAllRoles(role)
  
    })
       
};


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
            type:'input',
            name:'role',
            message: 'What is the role id you want to assign to them?',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'input',
            name:'manager',
            message: 'What is the manager id?',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        }
      ])

     .then((result) => {
        

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [result.firstName, result.lastName, result.role, result.manager])
        
         console.log(`${result.firstName} ${result.lastName} was added to database!`)
       

         viewAllEmps(emp)
        

});


}
const updateEmp = async(update) => {

    await inquirer
    .prompt([
        {
            type:'input',
            name:'updateEmp',
            message: 'Which employee would you like to update? Please enter their ID',
            validate: (value) => {if(value){return true} else{return "Must make entry!"}},
        },
        {
            type:'list',
            name:'updateRole',
            message: 'Which role do you want to assign the selected employee?',
            choices:['Account Manager', 'Accountant', 'Lead Engineer', 'Software Engineer', 'Legal Team Lead', 'Lawyer', 'Sales Lead', 'Salesperson', 'Recruiter', 'HR Manager'],
            loop: false,
            validate: (value) => {if(value){return 'updated employees role'} else{return "Must make entry!"}},
        }
    ])
.then((result) => {
    console.log(result.updateRole, result.updateEmp)

     db.query('UPDATE employee SET role_id =  (SELECT id FROM roles WHERE title = ?) WHERE id = ?', [result.updateRole, result.updateEmp])


    viewAllEmps(update)


})


}


cms();
