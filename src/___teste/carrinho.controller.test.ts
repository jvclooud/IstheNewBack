import { ObjectId } from 'bson'

// Mock do db do Mongo
const mockalbunsFind = jest.fn()
const mockalbunsFindOne = jest.fn()
const mockCarrinhosFindOne = jest.fn()
const mockCarrinhosInsertOne = jest.fn()
const mockCarrinhosUpdateOne = jest.fn()
const mockCarrinhosFind = jest.fn()
const mockCarrinhosDeleteOne = jest.fn()

interface ItemCarrinho {
    albunsId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

jest.mock('../database/banco-mongo.js', () => ({
  db: {
    collection: (name: string) => {
      if (name === 'albuns') {
        return { 
          findOne: mockalbunsFindOne,
          find: mockalbunsFind
        }
      }
      if (name === 'carrinhos') {
        return {
          find: mockCarrinhosFind,
          insertOne: mockCarrinhosInsertOne,
          updateOne: mockCarrinhosUpdateOne,
          findOne: mockCarrinhosFindOne,
          deleteOne: mockCarrinhosDeleteOne,
          toArray: () => mockCarrinhosFind()
        }
      }
      throw new Error('colecao desconhecida: ' + name)
    },
  },
}))

import controller from '../carrinho/carrinho.controller.js'

function createMockRes() {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('CarrinhoController.adicionarItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('deve validar campos obrigatórios', async () => {
    const req: any = { body: { usuarioId: 'u1', albunsId: '', quantidade: 1 } }
    const res = createMockRes()

    await controller.adicionarItem(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'usuarioId, albunsId e quantidade são obrigatórios' })
  })
  test("Deve buscar o albuns no banco de dados e retornar erro se não existir", async () => {
    const req: any = { body: { usuarioId: 'u1', albunsId: '123456789012123456789012', quantidade: 1 } }
    const res = createMockRes()
    mockalbunsFind.mockResolvedValue([]) // albuns não existe
    await controller.adicionarItem(req, res)
    expect(mockalbunsFind).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('123456789012123456789012') })
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'albuns não encontrado'})
  })
  test('Deve devolver um albuns quando o albuns existir com os campos corretors', async () => {
    const req: any = { body: { usuarioId: 'u1', albunsId: '123456789012123456789012', quantidade: 2 } }
    const res = createMockRes()
    mockalbunsFind.mockResolvedValue({ 
      _id: ObjectId.createFromHexString('123456789012123456789012'),
      nome: 'albuns 1',
      preco: 50,
      descricao: 'Descricao do albuns 1',
      urlfoto: 'http://foto.com/albuns1.jpg'
    }) // albuns existe
    await controller.adicionarItem(req, res)
    expect(mockalbunsFind).toHaveBeenCalledWith({ _id: ObjectId.createFromHexString('123456789012123456789012') })
  })

  test('Deve criar um novo carrinho se não existir um para o usuário', async () => {
    const req: any = { body: { usuarioId: '123123123123123123123123', albunsId: '123456789012123456789012', quantidade: 2 } }
    const res = createMockRes()
    const albuns = {
      _id: ObjectId.createFromHexString('123456789012123456789012'),
      nome: 'albuns 1',
      preco: 50,
      descricao: 'Descricao do albuns 1',
      urlfoto: 'http://foto.com/albuns1.jpg'
    }
    mockalbunsFind.mockResolvedValue([albuns]) // albuns existe
    mockCarrinhosFind.mockResolvedValue([]) // Carrinho não existe
    mockCarrinhosInsertOne.mockResolvedValue(
      { usuarioId: '123123123123123123123123', 
      itens: [{ albunsId: '123456789012123456789012', quantidade: 2, precoUnitario: 50, nome: 'albuns 1' }],
      dataAtualizacao: new Date(),
      total: 100 })
    await controller.adicionarItem(req, res)
    expect(mockCarrinhosFind).toHaveBeenCalledWith({ usuarioId: '123123123123123123123123' })
    expect(mockCarrinhosInsertOne).toHaveBeenCalledWith({ usuarioId: '123123123123123123123', 
      itens: [{ albunsId: '123456789012123456789012', quantidade: 2, precoUnitario: 50, nome: 'albuns 1' }],
      dataAtualizacao: expect.any(Date),
      total: 100
  })
})

  
})

