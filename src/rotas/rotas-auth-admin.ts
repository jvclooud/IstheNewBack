import { Router } from 'express'
import { AdminAuth } from '../middlewares/auth-admin.js'
import carrinhoController from '../carrinho/carrinho.controller.js'
import albunsController from '../albuns/albuns.controller.js'

const rotas = Router()
rotas.use(AdminAuth) // Aplica o middleware de admin em todas as rotas

// Rotas de administração de álbuns
rotas.post('/albuns', albunsController.adicionar)
rotas.get('/albuns', albunsController.listar)
rotas.put('/albuns/:id', albunsController.atualizar)
rotas.delete('/albuns/:id', albunsController.remover)
//rotas.delete('/albuns', (req,res)=>{console.log("tESTE")})
rotas.post('/cadastro',albunsController.adicionar)

// Rotas de administração do carrinho
rotas.post('/removerItem', carrinhoController.removerItem)
rotas.get('/carrinho/:usuarioId', carrinhoController.listar)
rotas.delete('/carrinho/:usuarioId', carrinhoController.remover)

export default rotas