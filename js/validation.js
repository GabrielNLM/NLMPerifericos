// Seleciona o formulário de contato pelo ID e adiciona um listener para o evento de envio
document.getElementById('form-contato').addEventListener('submit', function(evt) {
  // Impede o comportamento padrão de envio para podermos validar via JS
  evt.preventDefault();

  // Obtém os valores dos campos, removendo espaços em branco no início e fim
  const nome  = this.nome.value.trim();
  const email = this.email.value.trim();
  const msg   = this.mensagem.value.trim();

  // Array para armazenar mensagens de erro
  let errors = [];

  // Validações dos campos:
  // 1) Nome deve ter pelo menos 2 caracteres
  if (nome.length < 2) errors.push('Nome muito curto.');
  // 2) Email deve seguir formato básico (ex.: texto@texto.dominio)
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('E‑mail inválido.');
  // 3) Mensagem deve ter pelo menos 10 caracteres
  if (msg.length < 10) errors.push('Mensagem muito curta.');

  // Seleciona o container de feedback para exibir erros ou sucesso
  const fb = document.getElementById('form-feedback');

  if (errors.length) {
    // Se houver erros, monta um parágrafo para cada mensagem e aplica classe de erro
    fb.innerHTML = errors.map(e => `<p>${e}</p>`).join('');
    fb.className = 'erro';
  } else {
    // Se tudo estiver válido, exibe mensagem de sucesso e limpa o formulário
    fb.textContent = 'Mensagem enviada com sucesso!';
    fb.className = 'sucesso';
    this.reset();

    // Aqui você pode inserir lógica de envio via AJAX/fetch para um backend
    // Exemplo:
    // fetch('/api/contato', { method: 'POST', body: new FormData(this) })
    //   .then(response => response.json())
    //   .then(data => console.log('Enviado:', data));
  }
});