import express from 'express'

const app=express();
app.use(express.json());

let users = [
    {id:1,name:"alice"},
]

//get
app.get('/users',(req,res) => {
    res.json(users)
});

//post
app.post('/user',(req,res)=>{
      const newUser ={
        id:users.length+1,
        name:req.body.name
      }
      users.push(newUser);
      res.status(201).json(newUser);
});


//get by id
app.get('/user/:id',(req,res)=>{
    const user=users.find(u=>u.id===parseInt(req.params.id));
    if(!user) return res.status(404).json({message:"user not found"});
    res.json(user)
})

//put
app.put('/user/:id',(req,res)=>{
    const user=users.find(u=>u.id===parseInt(req.params.id));
    if(!user) return res.status(404).json({message:"user not found"});

    user.name=req.body.name || user.name;
    res.json(user);
})

//delete
app.delete('/user/:id',(req,res)=>{
     users=users.filter(u=>u.id!==parseInt(req.params.id));
    res.json({message:"user deleted"})
})

// app.get('')
let PORT=5000;
app.listen(PORT,()=>{
    console.log(`running on the port ${PORT}`);
});