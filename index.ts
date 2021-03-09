import express from 'express'
import bodyParser, { json } from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'
import { fstat, fsync, fsyncSync } from 'node:fs'
import fs = require('fs');
import { userInfo } from 'node:os'
const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

const readDbFile =(): DbSchema => {
  const raw = fs.readFileSync('db.json','utf8')
  const db = JSON.parse(raw)
  return db;
}
interface JWTPayload {
  username: string;
  password: string;
}
interface Balance{
  amount: number;
}
interface DbSchema{
  users: User[]
  balance: Balance[]
}
app.post<any>('/login',
  (req, res) => {
    const { username, password } = req.body

    return res.status(200).json({
      message: 'Login succesfully',
    })
  })

app.post('/register',
  body('username').isString(),body('password').isString(),
  async(req, res) => {
    const { username, password, firstname, lastname, balance } = req.body
    const hashedPassword = await bcrypt.hash(username.password, 10);
    const user = await User.create({
      username,password:hashedPassword,firstname, lastname, balance
    });
    if(user.find(username => user.username === username)){
      res.status(400).json({
        message: 'Username is already in used ',
      })
    }
    return res.status(200).json({
      message: 'Register succesfully',
    })
  })
app.get('/balance',
  (req, res) => {
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
  
    }
    catch (e) {
      if(e.name === 'SequelizeUniqueContraintError'){
        res.status(400).json({message: "Invalid token"})
      }
    }
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {

    //Is amount <= 0 ?
    if (!validationResult(req).isEmpty())
      return res.status(400).json({ message: "Invalid data" })
  })

app.post('/withdraw',
  (req, res) => {
    User.balance=req;
  })

app.delete('/reset', (req, res) => {

  //code your database reset here
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  User.create({
      firstname: 'SARINYA',
      lastname: 'PAMONTREE',
      CODE: '620610810',
      gpa: 'D+'
  });
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))