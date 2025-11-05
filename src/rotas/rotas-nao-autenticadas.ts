import {Router} from 'express'

import albunsController from '../albuns/albuns.controller.js'
import usuariosController from '../usuarios/usuarios.controller.js'

const rotas = Router()



rotas.post('/adicionarUsuario',usuariosController.adicionar)
rotas.get('/albuns',albunsController.listar)
rotas.post('/login',usuariosController.login)

export default rotas