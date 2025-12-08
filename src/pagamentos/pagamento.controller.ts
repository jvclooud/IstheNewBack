import Stripe from "stripe";
import { Request, Response } from "express";
import { db } from "../database/banco-mongo.js";

declare global {
  namespace Express {
    interface Request {
      usuarioId?: string;
    }
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover", // recomendação Stripe
});

class PagamentoController {
  // Retorna apenas o total do carrinho (sem criar PaymentIntent)
  async obterTotal(req: Request, res: Response) {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." });
      }

      // Buscar carrinho no Mongo
      const carrinho = await db.collection("carrinhos").findOne({ usuarioId });

      if (!carrinho) {
        return res.status(400).json({ mensagem: "Carrinho não encontrado." });
      }

      return res.json({
        total: carrinho.total || 0,
      });

    } catch (erro: any) {
      console.log("Erro ao obter total:", erro);
      return res.status(500).json({ mensagem: "Erro ao obter total do carrinho" });
    }
  }

  // Cria PaymentIntent para pagamento com cartão
  async criarPagamento(req: Request, res: Response) {
    try {
      const usuarioId = req.usuarioId;

      if (!usuarioId) {
        return res.status(401).json({ mensagem: "Usuário não autenticado." });
      }

      // Buscar carrinho no Mongo
      const carrinho = await db.collection("carrinhos").findOne({ usuarioId });

      if (!carrinho || carrinho.total <= 0) {
        return res.status(400).json({ mensagem: "Carrinho vazio ou inválido." });
      }

      // Criar PaymentIntent no Stripe
      const pagamento = await stripe.paymentIntents.create({
        amount: Math.round(carrinho.total * 100), // valor em centavos
        currency: "brl",
        automatic_payment_methods: {
          enabled: true, // habilita PIX, cartão etc
        },
      });

      return res.json({
        clientSecret: pagamento.client_secret,
      });

    } catch (erro: any) {
      console.log("Erro Stripe:", erro);
      return res.status(500).json({ mensagem: "Erro ao criar pagamento", error: erro.message });
    }
  }
}

export default new PagamentoController();
