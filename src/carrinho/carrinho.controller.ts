import { Request, Response } from "express";
import { ObjectId } from "bson";
import { db } from "../database/banco-mongo.js"; // Certifique-se que o caminho está correto

// Interfaces (sem alteração, 'nome' será o 'titulo' do álbum)
interface ItemCarrinho {
    albunsId: string; // ID do álbum
    quantidade: number;
    precoUnitario: number;
    nome: string; // Vai armazenar o 'titulo' do álbum
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

// Interface de autenticação (mantida)
interface AutenticacaoRequest extends Request {
    usuarioId?: string;
}

class CarrinhoController {

    /**
     * Adiciona um álbum ao carrinho do usuário logado.
     */
    async adicionarItem(req: AutenticacaoRequest, res: Response) {
        console.log("Chegou na rota de adicionar item ao carrinho");
        const { albunsId, quantidade } = req.body; // albunsId é o _id do álbum

        // 1. Validar usuário (Pode ser 401, OK)
        if (!req.usuarioId) {
            return res.status(401).json({ mensagem: "Usuário inválido!" });
        }
        const usuarioId = req.usuarioId;

        // 2. VALIDAR CAMPOS OBRIGATÓRIOS DO BODY (Nova adição ou move para antes do 401 se for o desejado)
        if (!albunsId) {
            return res.status(400).json({ mensagem: "albunsId (ID do álbum) é obrigatório." });
        }
        if (quantidade === undefined || quantidade === null) { // Checa se quantidade existe
            return res.status(400).json({ mensagem: "Quantidade é obrigatória." });
        }

        // 3. Validar quantidade (o seu código já faz isso, mas está na posição 2)
        const qtdNum = Number(quantidade);
        if (isNaN(qtdNum) || qtdNum <= 0) {
            return res.status(400).json({ mensagem: "Quantidade inválida. Deve ser um número maior que zero." });
        }

        try {
            // 3. Buscar o álbum no banco de dados. Mudar de "album" para "albuns" (plural)
            const album = await db.collection("albuns").findOne({ _id: ObjectId.createFromHexString(albunsId) });

            if (!album) {
                return res.status(404).json({ mensagem: "Álbum não encontrado" });
            }

            // 4. Pegar e converter o preço do álbum (de String para Number)
            let precoUnitario: number;
            if (typeof album.preco !== 'string') {
                return res.status(400).json({ mensagem: "Formato de preço inválido no banco de dados" });
            }
            // Substitui vírgula por ponto (se houver) e converte para float
            precoUnitario = parseFloat(album.preco.replace(',', '.'));

            if (isNaN(precoUnitario)) {
                return res.status(400).json({ mensagem: "Preço do álbum não é um número válido" });
            }

            // 5. Pegar o nome (título) do álbum
            const nome = album.titulo;

            // 6. Encontrar o carrinho do usuário
            const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });

            if (!carrinho) {
                // 7. Se não existir, criar um novo carrinho
                const novoCarrinho: Carrinho = {
                    usuarioId: usuarioId,
                    itens: [{
                        albunsId: albunsId,
                        quantidade: qtdNum,
                        precoUnitario: precoUnitario,
                        nome: nome
                    }],
                    dataAtualizacao: new Date(),
                    total: precoUnitario * qtdNum
                };
                await db.collection("carrinhos").insertOne(novoCarrinho);
                return res.status(201).json(novoCarrinho);
            }

            // 8. Se o carrinho existir, atualizar os itens
            const itemExistente = carrinho.itens.find(item => item.albunsId === albunsId);

            if (itemExistente) {
                // Se o item já existir, soma a quantidade
                itemExistente.quantidade += qtdNum;
            } else {
                // Se o item não existir, adiciona ao array
                carrinho.itens.push({
                    albunsId: albunsId,
                    quantidade: qtdNum,
                    precoUnitario: precoUnitario,
                    nome: nome
                });
            }

            // 9. Recalcular o total e atualizar data
            carrinho.total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
            carrinho.dataAtualizacao = new Date();

            // 10. Salvar as alterações no banco de dados
            await db.collection("carrinhos").updateOne(
                { usuarioId: usuarioId },
                { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
            );

            // 11. Responder com o carrinho atualizado
            return res.status(200).json(carrinho);

        } catch (error) {
            console.error("Erro ao adicionar item ao carrinho:", error);
            if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'BSONError') {
                return res.status(400).json({ mensagem: "albunsId (ID do álbum) inválido." });
            }
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }
    }

    /**
     * Remove um item específico (álbum) do carrinho do usuário logado.
     */
    async removerItem(req: AutenticacaoRequest, res: Response) {
        const { albunsId } = req.body; // ID do álbum a remover

        if (!req.usuarioId) {
            return res.status(401).json({ mensagem: "Usuário inválido!" });
        }
        const usuarioId = req.usuarioId;

        if (!albunsId) {
            return res.status(400).json({ mensagem: "albunsId (ID do álbum) é obrigatório." });
        }

        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });

        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        const itemIndex = carrinho.itens.findIndex(item => item.albunsId === albunsId);

        if (itemIndex === -1) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }

        // Remove o item do array
        carrinho.itens.splice(itemIndex, 1);

        // Recalcular o total e atualizar data
        carrinho.total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        carrinho.dataAtualizacao = new Date();

        await db.collection("carrinhos").updateOne(
            { usuarioId: usuarioId },
            { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
        );

        return res.status(200).json(carrinho);
    }

    /**
     * Atualiza a quantidade de um item (álbum) no carrinho do usuário logado.
     */
    async atualizarQuantidade(req: AutenticacaoRequest, res: Response) {
        const { albunsId, quantidade } = req.body;

        if (!req.usuarioId) {
            return res.status(401).json({ mensagem: "Usuário inválido!" });
        }
        const usuarioId = req.usuarioId;

        const qtdNum = Number(quantidade);
        if (isNaN(qtdNum) || qtdNum <= 0) {
            // Se a quantidade for zero ou menor, o correto seria remover o item
            return res.status(400).json({ mensagem: "Quantidade deve ser maior que zero. Para remover, use a rota de remoção." });
        }

        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });

        if (!carrinho) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        const item = carrinho.itens.find(item => item.albunsId === albunsId);

        if (!item) {
            return res.status(404).json({ mensagem: "Item não encontrado no carrinho" });
        }

        item.quantidade = qtdNum;

        // Recalcular o total e atualizar data
        carrinho.total = carrinho.itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
        carrinho.dataAtualizacao = new Date();

        await db.collection("carrinhos").updateOne(
            { usuarioId: usuarioId },
            { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
        );

        return res.status(200).json(carrinho);
    }

    /**
     * Lista o conteúdo do carrinho do usuário logado.
     */
    async listar(req: AutenticacaoRequest, res: Response) {
        if (!req.usuarioId) {
            return res.status(401).json({ mensagem: "Usuário inválido!" });
        }
        const usuarioId = req.usuarioId;

        const carrinho = await db.collection<Carrinho>("carrinhos").findOne({ usuarioId: usuarioId });

        if (!carrinho) {
            // Retorna um carrinho vazio em vez de 404, o que é uma experiência melhor
            return res.status(200).json({
                usuarioId: usuarioId,
                itens: [],
                total: 0,
                dataAtualizacao: new Date()
            });
        }

        return res.status(200).json(carrinho);
    }

    /**
     * Remove (esvazia) o carrinho inteiro do usuário logado.
     */
    async remover(req: AutenticacaoRequest, res: Response) {
        if (!req.usuarioId) {
            return res.status(401).json({ mensagem: "Usuário inválido!" });
        }
        const usuarioId = req.usuarioId;

        const resultado = await db.collection("carrinhos").deleteOne({ usuarioId: usuarioId });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Carrinho não encontrado" });
        }

        return res.status(200).json({ mensagem: "Carrinho removido com sucesso" });
    }
}

export default new CarrinhoController();