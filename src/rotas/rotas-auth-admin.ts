import { Router } from 'express'
import { AdminAuth } from '../middlewares/auth-admin.js'
import carrinhoController from '../carrinho/carrinho.controller.js'
import albunsController from '../albuns/albuns.controller.js'
import usuariosController from '../usuarios/usuarios.controller.js'

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

// Rotas de administração de usuários
rotas.get('admin/usuarios', usuariosController.listar)
rotas.delete('/usuarios/:id', usuariosController.deletar)
rotas.put('/usuarios/:id/promover', usuariosController.promover)

export default rotas