const express = require("express");
const bodyparser = require('body-parser');
const cors = require('cors');
const dbconfig = require('./db')

const app = express();


app.use("/uploads", express.static("uploads"));
app.use(express.json())
app.use(cors());
app.use(bodyparser.json());

const userRouter = require('./routes/userRoute')
const AdminRouter = require('./routes/adminRoute')

const users = require('./routes/userssRoute')
app.use('/api/user', userRouter)
app.use('/api/users', users)
app.use("/api/admin", AdminRouter)


const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Node server started by using nodemon"))