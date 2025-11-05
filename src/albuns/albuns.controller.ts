import { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
import { ObjectId } from 'mongodb'

class albunsController {
    async adicionar(req: Request, res: Response) {
        const { titulo, artista, preco, ano_lancamento, genero } = req.body
        if (!titulo || !artista || !preco || !ano_lancamento || !genero)
            return res.status(400).json({ error: "Título, artista, preço, ano_lancamento e gênero são obrigatórios" })

        const album = { titulo, artista, preco, ano_lancamento, genero }
        const resultado = await db.collection('albuns').insertOne(album)
        res.status(201).json({ ...album, _id: resultado.insertedId })
    }
    async listar(req: Request, res: Response) {
        const albuns = await db.collection('albuns').find().toArray()
        res.status(200).json(albuns)
    }

    async atualizar(req: Request, res: Response) {
        const { id } = req.params
        const { titulo, artista, preco, ano_lancamento, genero } = req.body

        if (!titulo || !artista || !preco || !ano_lancamento || !genero) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" })
        }

        try {
            const resultado = await db.collection('albuns').updateOne(
                { _id: new ObjectId(id) },
                { $set: { titulo, artista, preco, ano_lancamento, genero } }
            )

            if (resultado.matchedCount === 0) {
                return res.status(404).json({ error: "Álbum não encontrado" })
            }

            res.status(200).json({ message: "Álbum atualizado com sucesso" })
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o álbum" })
        }
    }

    async remover(req: Request, res: Response) {
        const { id } = req.params

        try {
            const resultado = await db.collection('albuns').deleteOne({ _id: new ObjectId(id) })

            if (resultado.deletedCount === 0) {
                return res.status(404).json({ error: "Álbum não encontrado" })
            }

            res.status(200).json({ message: "Álbum removido com sucesso" })
        } catch (error) {
            res.status(500).json({ error: "Erro ao remover o álbum" })
        }
    }
}

export default new albunsController()