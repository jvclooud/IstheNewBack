import {Router} from 'express'

import albunsController from '../albuns/albuns.controller.js'
import usuariosController from '../usuarios/usuarios.controller.js'

const rotas = Router()



rotas.post('/adicionarUsuario',usuariosController.adicionar)
rotas.post('/login',usuariosController.login)
rotas.get('/albuns',albunsController.listar)
// Rota alternativa para produtos (mapeia para listar álbuns)
rotas.get('/produtos',albunsController.listar)


export default rotas