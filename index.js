const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken");
const mongoose= require("mongoose")
const {CreateUserInput,SigninInput,TodoInput} = require( "./type.js")
const {UserSchema} = require( "./models.js")

mongoose.connect("mongodb+srv://hzlnilsn2028:hazel%402004@todoapp.ww5tsbg.mongodb.net/Todoapp")


const UserModel = mongoose.model('users',UserSchema)


const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", function(req, res) {
    const response = CreateUserInput.safeParse(req.body);
    if(!response.success){
        return res.json({
            message:"Incorrect Inputs"
        })
    }
    const {username, password}= req.body;
    UserModel.create({
        username: username,
        password: password,
        todos: []
    })    
    res.json({
        message: "Signed up"
    })
})

app.post("/signin", function(req, res) {
    const response=SigninInput.safeParse(req.body)
    if(!response.success){
        return res.json({
            message:"Incorrect Inputs"
        })
    }
    const {username, password}= req.body;
    UserModel.findOne({
            username: username,
            password:password
    }).then(function(user){

        if (!user) {
        return res.status(403).json({
            message: "Incorrect creds"
        })
    } else {   
        let token = jwt.sign(username, "123random");
        res.json({
            token
        })
    }
    })
    
})

app.post("/todos", function(req, res) {
    const token = req.headers.token;
    let todo =TodoInput.safeParse(req.body.todo);
    let username = jwt.verify(token, "123random");
    // let user = users.find(u => u.username == username);
    UserModel.findOne({
        username: username,
    }).then(function(user){
          if (!user) {
        return res.status(403).json({
            message: "Unauthenticated"
        })
    } else {
        user.todos.push({
            title: todo});
        user.save()
        res.json({
            message: "Todo added"
        })
    }
    })
      
    })


app.get("/todos", function(req, res) {
    const token = req.headers.token;
    let username = jwt.verify(token, "123random");
    
    UserModel.findOne({
        username: username,
    }).then(function(user) {
        res.json({
            todos: user.todos.map(t => t.title)
        })
    })
})

app.listen(3000);