import {Router} from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import albunsController from '../albuns/albuns.controller.js'
import usuariosController from '../usuarios/usuarios.controller.js'
import pagamentoController from "../pagamentos/pagamento.controller.js"



const rotas = Router()
rotas.post('/albuns',albunsController.adicionar)
rotas.post('/cadastro',albunsController.adicionar)


rotas.post('/adicionarItem',carrinhoController.adicionarItem)
rotas.post('/removerItem',carrinhoController.removerItem)   

// Atualiza quantidade de um item no carrinho (envia quantidade absoluta)
rotas.post('/atualizarQuantidade', carrinhoController.atualizarQuantidade)


rotas.get('/carrinho',carrinhoController.listar)
rotas.delete('/carrinho',carrinhoController.remover)

rotas.post('/login',usuariosController.login)
rotas.get("/pagamento/total", pagamentoController.obterTotal);
rotas.post("/criar-pagamento-cartao", pagamentoController.criarPagamento);
export default rotas