// Objeto que mapeia IDs de produtos para nome completo e caminho da imagem
const productsInfo = {
  mouse: {
    name: 'Mouse Gamer Redragon Cobra, Chroma RGB, 12400 DPI, 8 Botões, Preto - M711',
    image: 'img/mouse.png'
  }
};

// Inicializa o carrinho a partir do localStorage ou cria um array vazio
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Seleciona todos os elementos que exibem a quantidade de itens no carrinho
const cartCountEls = document.querySelectorAll('#cart-count');

// Atualiza a exibição do contador de itens e aplica animação "pop"
function updateCartCount() {
  cartCountEls.forEach(el => {
    el.textContent = cart.length;           // Insere o número de itens
    el.classList.add('pop');                // Adiciona classe para efeito visual
    setTimeout(() => el.classList.remove('pop'), 300); // Remove classe após 300ms
  });
}
// Chamada inicial para sincronizar o contador na abertura da página
updateCartCount();

// Exibe uma notificação (toast) com mensagem, tipo e duração personalizados
function showToast(message, type = 'success', duration = 1500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');               // Cria o elemento do toast
  toast.className = `toast ${type}`;                         // Aplica classes para estilo
  toast.textContent = message;                               // Define texto
  container.appendChild(toast);                              // Insere no DOM
  void toast.offsetWidth;                                    // Força reflow para animação
  toast.classList.add('show');                               // Dispara animação de entrada

  // Após 'duration', inicia animação de saída e remove o toast
  setTimeout(() => {
    toast.classList.remove('show');                          // Inicia fade-out
    toast.classList.add('hide');                             // Anima saída
    toast.addEventListener('transitionend', () => toast.remove()); // Remove ao fim
  }, duration);
}

// Evento de clique para todos os botões de adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;                               // Captura ID do produto
    cart.push({ id, date: Date.now() });                     // Adiciona item com timestamp
    localStorage.setItem('cart', JSON.stringify(cart));      // Persiste no localStorage
    updateCartCount();                                       // Atualiza contador
    showToast('✔️ Produto adicionado ao carrinho', 'success'); // Exibe toast de sucesso
  });
});

// Lógica para renderizar itens do carrinho na página de carrinho
const container = document.getElementById('cart-items');
if (container) {
  const emptyMsg = document.getElementById('empty-msg');    // Mensagem quando vazio
  const checkout = document.getElementById('checkout-btn'); // Botão de checkout

  if (cart.length === 0) {
    // Mostra mensagem de carrinho vazio
    emptyMsg.style.display = 'block';
  } else {
    // Oculta mensagem e exibe botão de checkout
    emptyMsg.style.display = 'none';
    checkout.style.display = 'inline-block';

    // Para cada item no carrinho, cria um card com imagem, nome e botão remover
    cart.forEach((item, idx) => {
      const info = productsInfo[item.id];                  // Busca dados do produto
      const div = document.createElement('div');
      div.className = 'cart-item';                          // Classe para styling
      div.innerHTML = `
        <img src="${info.image}" alt="${info.name}" class="cart-item-img">
        <span class="cart-item-name">${info.name}</span>
        <button class="btn remove-from-cart" data-index="${idx}">Remover</button>
      `;
      container.append(div);                                // Adiciona ao container
    });

    // Evento para remover itens do carrinho
    document.querySelectorAll('.remove-from-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);             // Converte índice para number
        cart.splice(idx, 1);                               // Remove item do array
        localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza localStorage
        updateCartCount();                                 // Atualiza contador
        showToast('🗑️ Produto removido do carrinho', 'error'); // Toast de erro
        // Recarrega a página após duração para refletir mudanças
        setTimeout(() => location.reload(), 1600);
      });
    });
  }
}