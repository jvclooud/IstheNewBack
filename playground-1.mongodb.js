/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.


const database = 'newtrend';
const collection = 'album';
use('newtrend');


// Criar coleção de álbuns
db.createCollection('album');


// Criar coleção de usuários (autenticação)
db.createCollection('users');


db.album.insertOne({
  titulo: "Album de Teste",
  artista: "Artista Exemplo",
  preco: "29.90",
  ano_lancamento: "2024",
  genero: "Pop"
});

// Inserir um usuário normal
db.usuarios.insertOne({
  nome: "Usuario Normal",
  idade: 25,
  email: "usuario@example.com",
  senha: "$2b$10$YourHashedPasswordHere", // A senha será hasheada pelo bcrypt na API
  role: "user"
});

// Inserir um usuário administrador
db.usuarios.insertOne({
  nome: "Administrador",
  idade: 30,
  email: "admin@example.com",
  senha: "$2b$10$YourHashedPasswordHere", // A senha será hasheada pelo bcrypt na API
  role: "admin"
});

// Consultar todos os usuários
db.usuarios.find({});

// Consultar apenas administradores
db.usuarios.find({ role: "admin" });

// Consultar apenas usuários normais
db.usuarios.find({ role: "user" });

// Consultar um usuário específico por email
db.usuarios.findOne({ email: "admin@example.com" });

// Atualizar role de um usuário para admin
db.usuarios.updateOne(
  { email: "usuario@example.com" },
  { $set: { role: "admin" } }
);

// Contar quantidade de usuários por role
db.usuarios.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
]);