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


db.album.find();
db.users.find();




db.album.insertOne({
  titulo: "Album de Teste",
  artista: "Artista Exemplo",
  preco: "29.90",
  ano_lancamento: "2024",
  genero: "Pop"
});


