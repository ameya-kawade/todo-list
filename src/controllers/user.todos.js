import { User } from "../models/user.models.js";
import { Todo } from "../models/todo.models.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const createTodo = async(req, res, next) =>{
    const {todoName} = req.body;
    // console.log(todoName);
    try{
        const todo = await Todo.create({
            name: todoName,
            owner:req.user._id,
            tasks:[]
        });
        const user = await User.findById(req.user._id);
        if(!user) throw new ApiError(404,'user by given id is not found')
        user.todos.push(todo._id);
        await user.save();
        
        res.status(201).json(new ApiResponse(201,'Successfully created todo',todo._id));
    }
    catch(err){
        console.log(err);
        throw new ApiError(500,err.message);
    }
};


const getData = async(req, res, next) =>{
    try {
        const user = await User.findById(req.user._id).select('name todos').populate('todos');
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        throw new ApiError(500,err.message);
    }
    
};


const deleteTodo = async(req, res, next) =>{
    const todo_id = req.body._id;

    const delTodoFromUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { todos: todo_id } },
        { new: true }
    ); 
    // console.log(delTodoFromUser);
    
    const delTodoFromTodos = await Todo.deleteOne(
        {   
            _id: todo_id , 
            owner: req.user._id
        }
    );

    // console.log(delTodoFromTodos);

    res.status(200).json(new ApiResponse(200, 'successfully deleted todo',null));
};

const saveData = async(req, res, next) =>{
    try {
        const data = req.body;
        // console.log('data',data);
        if(!data) throw new ApiError(402,'object is not provided'); 
        
        const map = new Map(Object.entries(data));
        // console.log('map',map);
        const user = await User.findById(req.user._id).populate('todos');
        
        if(!user) throw new ApiError(404, 'User by the _id not found');
        const updates = [];
        user.todos.forEach((todo)=>{
            const newTasks = map.get(todo.name);
            
            updates.push({
                updateOne:{
                    filter:{ _id:todo._id },
                    update:{ tasks:newTasks }
                }
            });
            // console.log(newTasks);
            // todo.tasks = newTasks;
        });
        const bulkWrite = await Todo.bulkWrite(updates);
        // console.log('bulkwirte',bulkWrite);
        // console.log(user);
        // await user.save();
        res.status(200).json(new ApiResponse(200,'success'));
    } catch (error) {
        console.log(error);
        throw new ApiError(500,error.message);
    }
};

export { createTodo, getData, saveData, deleteTodo };