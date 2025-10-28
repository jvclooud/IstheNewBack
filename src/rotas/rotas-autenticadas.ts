import {Router} from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import albunsController from '../albuns/albuns.controller.js'

const rotas = Router()
rotas.post('/albuns',albunsController.adicionar)


rotas.post('/adicionarItem',carrinhoController.adicionarItem)
rotas.post('/removerItem',carrinhoController.removerItem)
rotas.get('/carrinho/:usuarioId',carrinhoController.listar)
rotas.delete('/carrinho/:usuarioId',carrinhoController.remover)

export default rotas