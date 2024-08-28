
require('dotenv').config();

const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const port = 5500

//db connection
require('./db/connection')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

app.get("/", (req,res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`server is running at port ${port}`)
})