# Instruções para rodar o projeto Node.js com express
Este projeto foi criado utilizando o Node.js com o framework Express. Siga as instruções abaixo para rodar o projeto localmente.
## Pré-requisitos
Antes de começar, certifique-se de ter o Node.js e o npm (Node Package Manager) instalados na sua máquina. Você pode baixar o Node.js, que já inclui o npm,
  do site oficial: [https://nodejs.org/](https://nodejs.org/)
## Passos para rodar o projeto
1. Clone o repositório do projeto para sua máquina local:
2. Navegue até o diretório do projeto:
    ```bash
    cd nome-do-projeto
    ```
3. Instale as dependências do projeto utilizando o npm:
    ```bash
    npm install
    ```
4. Mude o .env.exemple para .env e configure as variáveis de ambiente com seu banco de dados
5. Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento com o seguinte comando:
    ```bash
    npm start
    ```
6. O servidor de desenvolvimento será iniciado e o projeto estará disponível em [http://localhost:8000](http://localhost:8000) ou na porta que você configurou.
 
 ## Página de produtos (frontend simples)

 Após iniciar o servidor, abra no navegador:

 - Página HTML que lista produtos: http://localhost:8000/produtos.html
 - Endpoint JSON usado pela página: http://localhost:8000/produtos

 A página tenta mostrar no canto superior direito o nome e o tipo do usuário extraídos do token JWT. Para que apareça, o token deve estar disponível no navegador (a página procura nas seguintes fontes, nessa ordem):

 1. localStorage (chave: `token`)
 2. cookie `token`
 3. parâmetro de URL `?token=...`

 O login retorna um token JWT (agora incluindo `nome` e `tipo` no payload). Exemplo de uso via HTTP (PowerShell):

 ```powershell
 # Fazer login e obter token (substitua email/senha)
 Invoke-RestMethod -Method Post -Uri 'http://localhost:8000/login' -Body (@{ email='seu@email.com'; senha='suaSenha' } | ConvertTo-Json) -ContentType 'application/json'
 ```

 Copie o valor do campo `token` retornado e cole no console do navegador para teste:

 ```js
 // no console do navegador
 localStorage.setItem('token', '<COLE_AQUI_O_TOKEN>')
 location.reload()
 ```

 Observação: ao criar um usuário (rota `/adicionarUsuario`) o campo `tipo` é opcional e por padrão será `cliente`.
