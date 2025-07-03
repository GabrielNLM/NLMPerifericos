// --- Dados de produtos ---
// Objeto que armazena informações de cada produto, usado para renderização e detalhes
const productsInfo = {
  mouse: {
    name: 'Mouse Gamer Redragon Cobra, Chroma RGB, 12400 DPI, 8 Botões, Preto - M711',
    image: 'img/mouse.png'
  }
};

// --- Menu responsivo com animação (off-canvas lateral) ---
// Seleciona botão de toggle e lista de menu
const toggle = document.querySelector('.menu-toggle');
const menu   = document.querySelector('.menu');

// Se ambos existem na página, adiciona evento de clique para abrir/fechar
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');                // Adiciona/Remove classe para mostrar painel lateral
    toggle.classList.toggle('open');              // Anima ícone do botão (☰ para X)
    document.body.classList.toggle('menu-open');  // Bloqueia/Permite scroll do resto da página
  });
}

// --- Reveal on scroll ---
// Aplica efeito de entrada suave aos elementos com classe .slide-up
document.querySelectorAll('.slide-up').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');     // Adiciona classe para iniciar animação via CSS
        observer.unobserve(entry.target);           // Para de observar após exibir
      }
    });
  }, { threshold: 0.2 });                            // 20% do elemento visível para disparar
  observer.observe(el);
});

// --- Carrinho e contador ---
// Recupera carrinho do localStorage ou inicializa vazio
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Seleciona todas as badges de contador de itens
const cartCountEls = document.querySelectorAll('#cart-count');

// Atualiza o contador de itens no menu com animação "pop"
function updateCartCount() {
  cartCountEls.forEach(el => {
    el.textContent = cart.length;                 // Exibe quantidade de itens
    el.classList.add('pop');                      // Adiciona classe para animação CSS
    setTimeout(() => el.classList.remove('pop'), 300); // Remove classe após 300ms
  });
}
updateCartCount(); // Chama logo ao carregar a página

// --- Função de toast com tipo ---
/**
 * Exibe notificação temporária na tela
 * @param {string} message - Texto a exibir
 * @param {number} duration - Tempo em ms antes de esconder
 * @param {string} type - 'success' ou 'error' para estilo
 */
function showToast(message, duration = 1500, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return; // Se não encontrar container, aborta

  // Cria elemento de toast e adiciona classes
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.textContent = message;
  container.appendChild(toast);

  // Força reflow para garantir animação de entrada
  void toast.offsetWidth;
  toast.classList.add('show');

  // Após duration, inicia animação de saída e remove do DOM
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

// --- Adicionar ao carrinho + toast ---
// Seleciona todos os botões de adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;                       // Obtém o ID do produto
    cart.push({ id, date: Date.now() });             // Adiciona item ao array
    localStorage.setItem('cart', JSON.stringify(cart)); // Persiste carrinho
    updateCartCount();                               // Atualiza contador
    showToast('✔️ Produto adicionado ao carrinho', 1500, 'success');
  });
});

// --- Renderizar carrinho (somente em carrinho.html) ---
// Seleciona container de itens do carrinho na página de carrinho
const cartContainer = document.getElementById('cart-items');
if (cartContainer) {
  const emptyMsg = document.getElementById('empty-msg');
  const checkout = document.getElementById('checkout-btn');

  if (cart.length === 0) {
    // Se carrinho vazio, mostra mensagem e esconde botão de checkout
    if (emptyMsg)   emptyMsg.style.display = 'block';
    if (checkout)   checkout.style.display = 'none';
  } else {
    // Se houver itens, esconde mensagem e mostra botão de checkout
    if (emptyMsg)   emptyMsg.style.display = 'none';
    if (checkout)   checkout.style.display = 'inline-block';

    // Para cada item no carrinho, cria um card e adiciona ao container
    cart.forEach((item, idx) => {
      const info = productsInfo[item.id];
      const div  = document.createElement('div');
      div.className = 'cart-item';
      // Define estrutura interna do card usando innerHTML
      div.innerHTML = `
        <img src="${info.image}" alt="${info.name}" class="cart-item-img">
        <span class="cart-item-name">${info.name}</span>
        <button class="btn remove-from-cart" data-index="${idx}">Remover</button>
      `;
      cartContainer.append(div);
    });

    // Adiciona evento de remoção para cada botão criado
    document.querySelectorAll('.remove-from-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(btn.dataset.index, 1);               // Remove item do array
        localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza localStorage
        updateCartCount();                               // Atualiza contador
        showToast('🗑️ Produto removido do carrinho', 1500, 'error');
        // Recarrega a página após a animação de remoção
        setTimeout(() => location.reload(), 300);
      });
    });
  }
}