const uuid = require('uuid');
const Task = require('../db/connect.js');

const getAllTasks = (req,res)=>{
    Task.query('SELECT * FROM task_manager',(err,result)=>{
        if(err){
            console.log(err);
        }else{
            let value = JSON.parse(JSON.stringify(result));
            res.send(value);
        }
    })
    // res.send('all items from the file')
}

const createTask = (req, res) => {
    const id = uuid.v4();
    let title = req.body.title;
    let status = req.body.status;
    // console.log(title, status,req);
    Task.query("INSERT INTO task_manager(id,title,status) VALUES (?,?,?)",[id,title,status], (err, result)=>{
        if(err) throw err;
        res.send(result);
    })
        
}

const getTask = (req, res) =>{
    const id = req.params.id;
    Task.query('SELECT * FROM task_manager WHERE id=? ',id,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length == 0){
                res.send("id not present");
            }else{
                let value = JSON.parse(JSON.stringify(result));
                res.send(result);
            }
        }
    })
   // res.json({ id: req.params.id })// come back
}

const deleteAll = (req,res) =>{
    Task.query("DELETE FROM task_manager",(err,result)=>{
        if(err) throw err;
        res.send(result);
    })    
}

const updateStatus = (req, res) =>{
    const id = req.params.id;
    const stat = req.body.status;
    console.log(id, stat);
    Task.query("UPDATE task_manager SET status=? WHERE id=?",[stat,id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
}
const editTask = (req, res) =>{
    const id = req.params.id;
    const upTitle = req.body.title;
    // const upStatus = req.body.status;
    
    Task.query('UPDATE task_manager SET title=? WHERE id=?',[upTitle,id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
    // res.json({id: req.params.id });
}

const deleteTask = (req, res)=>{
    const deleteID = req.params.id;
    Task.query('DELETE FROM task_manager WHERE id=?',deleteID,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
    // res.send('delete task')
}

module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateStatus,
    deleteTask,
    editTask, 
    deleteAll
}