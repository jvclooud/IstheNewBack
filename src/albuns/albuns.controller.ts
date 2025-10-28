import { Request, Response } from 'express'
import { db } from '../database/banco-mongo.js'
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
}

export default new albunsController()