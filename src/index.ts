import express, { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js'
import rotasAutenticadas from './rotas/rotas-autenticadas.js'
import rotasAuthAdmin from './rotas/rotas-auth-admin.js'
import Auth from './middlewares/auth.js'
import cors from 'cors'
const app = express()
app.use(cors())

app.use(express.json())
// Servir arquivos estáticos (pasta public) para páginas frontend simples
app.use(express.static('public'))


// Usando as rotas definidas em rotas.ts
app.use(rotasNaoAutenticadas)
app.use(Auth) // Middleware de autenticação global
app.use(rotasAutenticadas) // Rotas autenticadas normais
app.use('/admin', rotasAuthAdmin) // Rotas de administrador

// Criando o servidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})