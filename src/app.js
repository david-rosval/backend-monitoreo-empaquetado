import express from 'express'
import cors from 'cors'
import connectDb from './db/mongodb.js'
import { RegisteredPackage } from './models/mongodb.js'

export const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/registros', async (req, res) => {
  try {
    await connectDb()
    const registeredPackageQuery = RegisteredPackage.find()
    const registeredPackages = await registeredPackageQuery.exec()
    res.json(registeredPackages)
  } catch (error) {
    console.error('Error al obtener los registros:', error)
    res.status(500).json({ error: 'Error al obtener los registros' })
  }
})
