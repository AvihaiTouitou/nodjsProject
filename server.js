const express = require('express');
const connectDB=require('./config/db')

const app = express();

//connect db
connectDB();
//Init Middleware

app.use(express.json({extended:false}));

app.get('/',(req,res)=>res.send('API Running'));

//Define Routes
app.use('/api/users',require('./Routers/api/users'));
app.use('/api/auth',require('./Routers/api/auth'));
app.use('/api/posts',require('./Routers/api/posts'));
app.use('/api/profile',require('./Routers/api/profile'));

const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`server started on port ${PORT}`));