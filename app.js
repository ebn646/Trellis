const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const path = require('path')
const { notFoundHandler, errorHandler } = require('./middleware')
const boardHandler = require('./api/boardHandler')
const listHandler = require('./api/listHandler')
const cardHandler = require('./api/cardHandler')
const userHandler = require('./api/userHandler')
const activityHandler = require('./api/activityHandler')
const PORT = process.env.PORT || 1313

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})


app.use(morgan('tiny'))
app.use(helmet())

app.use(express.json())
app.use('/api/user/', userHandler)
app.use('/api/boards/', boardHandler)
app.use('/api/lists/', listHandler)
app.use('/api/cards/', cardHandler)
app.use('/api/activities/', activityHandler)
app.use(errorHandler)

if (process.env.NODE_ENV === 'production') {
    app.get('/',(req,res)=>{
        app.use(express.static(path.resolve(__dirname,'client','build')))
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.use(notFoundHandler)


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})


module.exports = app
