// Seleciona (ou cria) o banco de dados
use('newtrend');

// Drop das coleções existentes para garantir um estado limpo
db.usuarios.drop();
db.albuns.drop();
db.carrinhos.drop();

// Criar coleção de usuários com validação
db.createCollection('usuarios', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['nome', 'email', 'senha', 'idade', 'role'],
      properties: {
        nome: {
          bsonType: 'string',
          description: 'Nome do usuário - obrigatório'
        },
        email: {
          bsonType: 'string',
          pattern: '^.+@.+\\..+$',
          description: 'Email válido - obrigatório'
        },
        senha: {
          bsonType: 'string',
          minLength: 60, // Para senha hash bcrypt
          description: 'Senha criptografada - obrigatória'
        },
        idade: {
          bsonType: 'number',
          minimum: 0,
          description: 'Idade do usuário - obrigatória'
        },
        role: {
          enum: ['user', 'admin'],
          description: 'Papel do usuário (user ou admin) - obrigatório'
        }
      }
    }
  }
});

// Criar coleção de álbuns com validação
db.createCollection('albuns', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['titulo', 'artista', 'preco', 'ano_lancamento', 'genero'],
      properties: {
        titulo: {
          bsonType: 'string',
          description: 'Título do álbum - obrigatório'
        },
        artista: {
          bsonType: 'string',
          description: 'Nome do artista - obrigatório'
        },
        preco: {
          bsonType: 'string',
          description: 'Preço do álbum (como string para manter compatibilidade) - obrigatório'
        },
        ano_lancamento: {
          bsonType: 'string',
          description: 'Ano de lançamento - obrigatório'
        },
        genero: {
          bsonType: 'string',
          description: 'Gênero musical - obrigatório'
        }
      }
    }
  }
});

// Criar coleção de carrinhos com validação
db.createCollection('carrinhos', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['usuarioId', 'itens', 'dataAtualizacao', 'total'],
      properties: {
        usuarioId: {
          bsonType: 'string',
          description: 'ID do usuário - obrigatório'
        },
        itens: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['albunsId', 'quantidade', 'precoUnitario', 'nome'],
            properties: {
              albunsId: {
                bsonType: 'string',
                description: 'ID do álbum - obrigatório'
              },
              quantidade: {
                bsonType: 'number',
                minimum: 1,
                description: 'Quantidade do item - obrigatório'
              },
              precoUnitario: {
                bsonType: 'number',
                minimum: 0,
                description: 'Preço unitário do item - obrigatório'
              },
              nome: {
                bsonType: 'string',
                description: 'Nome/título do álbum - obrigatório'
              }
            }
          }
        },
        dataAtualizacao: {
          bsonType: 'date',
          description: 'Data da última atualização - obrigatório'
        },
        total: {
          bsonType: 'number',
          minimum: 0,
          description: 'Valor total do carrinho - obrigatório'
        }
      }
    }
  }
});

// Criar índices
db.usuarios.createIndex({ "email": 1 }, { unique: true });
db.carrinhos.createIndex({ "usuarioId": 1 }, { unique: true });

// Criar usuário admin inicial para testes
const senhaAdmin = '$2b$10$YOUR_HASHED_PASSWORD'; // Substitua por uma senha hash real
db.usuarios.insertOne({
  nome: 'Admin',
  email: 'admin@example.com',
  senha: senhaAdmin,
  idade: 30,
  role: 'admin'
});

// Criar alguns álbuns de exemplo
db.albuns.insertMany([
  {
    titulo: 'Thriller',
    artista: 'Michael Jackson',
    preco: '29.90',
    ano_lancamento: '1982',
    genero: 'Pop'
  },
  {
    titulo: 'Back in Black',
    artista: 'AC/DC',
    preco: '34.90',
    ano_lancamento: '1980',
    genero: 'Rock'
  }
]);