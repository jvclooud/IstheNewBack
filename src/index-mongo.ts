import express, { Request, Response, NextFunction } from 'express'
import 'dotenv/config'
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js'
import rotasAutenticadas from './rotas/rotas-autenticadas.js'
import Auth from './middlewares/auth.js'
import cors from 'cors'

// Configuração inicial do servidor
const app = express()
app.use(cors())

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

app.use(express.json())

// Servir arquivos estáticos (pasta public) para páginas frontend simples
app.use(express.static('public'))


// Usando as rotas definidas em rotas.ts
app.use(rotasNaoAutenticadas)
app.use(Auth)
app.use(rotasAutenticadas)

// Criando o servidor na porta 8000 com o express
app.listen(8000, () => {
    console.log('Server is running on port 8000')
})