(function(){
  const estadoEl = document.getElementById('estado')
  const listaEl = document.getElementById('lista')

  function criarCard(produto){
    const div = document.createElement('div')
    div.className = 'produto'
    const titulo = document.createElement('strong')
    titulo.textContent = produto.nome || produto.titulo || 'Produto sem nome'
    const desc = document.createElement('div')
    desc.textContent = produto.descricao || produto.description || ''
    const preco = document.createElement('div')
    if(produto.preco !== undefined) preco.textContent = 'Preço: ' + produto.preco
    div.appendChild(titulo)
    div.appendChild(desc)
    if(preco.textContent) div.appendChild(preco)
    return div
  }

  function mostrarErro(msg){
    estadoEl.innerHTML = ''
    const err = document.createElement('div')
    err.className = 'erro'
    err.textContent = msg
    listaEl.appendChild(err)
  }

  // === Mostrar info do usuário a partir do token (localStorage / cookie / url) ===
  function getTokenFromStorage(){
    // 1) localStorage
    try{ if(window.localStorage && localStorage.getItem('token')) return localStorage.getItem('token') }catch(e){}
    // 2) cookie named token
    try{
      const m = document.cookie.match(/(?:^|; )token=([^;]+)/)
      if(m) return decodeURIComponent(m[1])
    }catch(e){}
    // 3) url param ?token=...
    try{ const params = new URLSearchParams(location.search); if(params.get('token')) return params.get('token') }catch(e){}
    return null
  }

  function parseJwtPayload(token){
    if(!token) return null
    const parts = token.split('.')
    if(parts.length < 2) return null
    try{
      // base64url decode
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const json = decodeURIComponent(atob(payload).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(json)
    }catch(e){ console.warn('Erro parse JWT', e); return null }
  }

  function showUserInfoFromToken(){
    const token = getTokenFromStorage()
    if(!token) return
    const payload = parseJwtPayload(token)
    if(!payload) return
    const nome = payload.nome || payload.name || ''
    const tipo = payload.tipo || payload.role || ''
    if(!nome && !tipo) return
    const container = document.getElementById('user-info')
    const nomeEl = document.getElementById('user-nome')
    const tipoEl = document.getElementById('user-tipo')
    if(nomeEl) nomeEl.textContent = nome
    if(tipoEl) tipoEl.textContent = tipo
    if(container) container.style.display = 'block'
  }

  // Tentar mostrar info do token assim que a página carrega
  showUserInfoFromToken()

  // Busca /produtos
  axios.get('/produtos')
    .then(function(response){
      estadoEl.innerHTML = ''
      const data = response.data
      if(!data) return mostrarErro('Nenhum produto retornado')
      // Se data for objeto com array em property 'produtos' ou for um array
      const arr = Array.isArray(data) ? data : (Array.isArray(data.produtos) ? data.produtos : (Array.isArray(data.albuns) ? data.albuns : []))
      if(arr.length === 0) return mostrarErro('Nenhum produto encontrado')
      arr.forEach(p => listaEl.appendChild(criarCard(p)))
    })
    .catch(function(err){
      estadoEl.innerHTML = ''
      console.error(err)
      mostrarErro('Erro ao buscar produtos: ' + (err.response && err.response.status ? err.response.status + ' ' + err.response.statusText : err.message))
    })
})()
