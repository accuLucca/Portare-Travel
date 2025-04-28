let carrinho = [];
let total = 0;
const telefoneAgencia = '+971523811226';

document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinho();
});

function mostrarDestino(destino) {
    const menuInicialEl = document.getElementById('menu-inicial');
    const destinosEl = document.getElementById('destinos');
    const tituloEl = document.getElementById('titulo');

    menuInicialEl.style.display = 'none';
    destinosEl.style.display = 'block';
    tituloEl.innerText = `Destino: ${destino.charAt(0).toUpperCase() + destino.slice(1)}`;

    // Hide all destinations and subcategories
    document.querySelectorAll('.destino').forEach(el => el.style.display = 'none');
    esconderSubcategorias();

    // Show the selected destination
    const destinoEl = document.getElementById(destino);
    if (destinoEl) {
        destinoEl.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error(`Destino com id '${destino}' não encontrado.`);
    }

    // Change background for Dubai and Abu Dhabi
    if (destino === 'dubai' || destino === 'abu-dhabi') {
        document.body.style.background = "url('img/fundodeserto.jpg') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
    } else {
        document.body.style.background = "url('img/fundomarceu.jpg') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
    }
}

function voltarParaMenuInicial() {
    const menuInicialEl = document.getElementById('menu-inicial');
    const destinosEl = document.getElementById('destinos');
    const tituloEl = document.getElementById('titulo');

    destinosEl.style.display = 'none';
    menuInicialEl.style.display = 'flex';
    tituloEl.innerText = 'Escolha seu Destino';

    // Hide all subcategories and destinations
    esconderSubcategorias();
    document.querySelectorAll('.destino').forEach(el => el.style.display = 'none');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Restore the original background
    document.body.style.background = "url('img/fundomarceu.jpg') no-repeat center center fixed";
    document.body.style.backgroundSize = "cover";
}

function mostrarSubcategoria(destino, subcategoriaId) {
    const destinoEl = document.getElementById(destino);
    if (!destinoEl) {
        console.error(`Destino com id '${destino}' não encontrado.`);
        return;
    }

    // Hide all subcategories within the current destination
    destinoEl.querySelectorAll('.subcategoria').forEach(sub => {
        sub.style.display = 'none';
    });

    // Show the selected subcategory
    const subcategoriaEl = document.getElementById(subcategoriaId);
    if (subcategoriaEl) {
        subcategoriaEl.style.display = 'block';
        subcategoriaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.error(`Subcategoria com id '${subcategoriaId}' não encontrada.`);
    }
}

function esconderSubcategorias() {
    document.querySelectorAll('.subcategoria').forEach(subcategoria => {
        subcategoria.style.display = 'none';
    });
}

function adicionarAoCarrinho(nome, quantidadeId, preco, isConsultaOnly = false) {
    const quantidadeInput = document.getElementById(quantidadeId);
    if (!quantidadeInput) {
        console.error(`Elemento com id '${quantidadeId}' não encontrado.`);
        alert("Erro ao adicionar o item. Tente novamente.");
        return;
    }

    const quantidade = parseInt(quantidadeInput.value);
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira uma quantidade válida (maior que zero).");
        return;
    }

    const itemId = isConsultaOnly ? `${nome}-${quantidade}pax` : `${nome}-${preco}`;
    const itemNomeDisplay = isConsultaOnly ? `${nome} (${quantidade} pessoa${quantidade > 1 ? 's' : ''})` : nome;

    const itemExistente = carrinho.find(item => item.id === itemId);

    if (itemExistente && !isConsultaOnly) {
        itemExistente.quantidade += quantidade;
    } else if (itemExistente && isConsultaOnly) {
        alert(`${itemNomeDisplay} já está no carrinho para consulta.`);
        return;
    } else {
        carrinho.push({
            id: itemId,
            nome: itemNomeDisplay,
            quantidade: quantidade,
            precoUnitario: preco,
            isConsultaOnly: isConsultaOnly
        });
    }

    atualizarCarrinho();
    alert(`${isConsultaOnly ? '' : quantidade + ' x '}${nome} adicionado ao carrinho!${isConsultaOnly ? ' (Preço sob consulta)' : ''}${preco === 0 && !isConsultaOnly ? ' (Gratuito)' : ''}`);
}

function atualizarCarrinho() {
    const carrinhoListaEl = document.getElementById('carrinho-lista');
    const carrinhoTotalEl = document.getElementById('carrinho-total');

    carrinhoListaEl.innerHTML = '';
    total = 0;

    if (carrinho.length === 0) {
        carrinhoListaEl.innerHTML = '<li>Seu carrinho está vazio.</li>';
    } else {
        carrinho.forEach((item, index) => {
            const subtotal = item.quantidade * item.precoUnitario;
            total += subtotal;

            const li = document.createElement('li');
            li.innerHTML = `
                <div class="item-info">
                    ${item.nome} - ${item.quantidade} x $${item.precoUnitario.toFixed(2)} = $${subtotal.toFixed(2)}
                </div>
                <button class="remover-item" onclick="removerItem(${index})">Remover</button>
            `;
            carrinhoListaEl.appendChild(li);
        });
    }

    carrinhoTotalEl.innerText = `$${total.toFixed(2)}`;
    atualizarLinkWhatsApp();
}

function removerItem(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    }
}

function atualizarLinkWhatsApp() {
    const botaoOrcamentoEl = document.getElementById('botao-orcamento');

    if (!telefoneAgencia) {
        botaoOrcamentoEl.href = '#';
        botaoOrcamentoEl.onclick = (e) => {
            e.preventDefault();
            alert("Número de WhatsApp da agência não configurado.");
        };
        botaoOrcamentoEl.style.opacity = '0.7';
        botaoOrcamentoEl.style.cursor = 'not-allowed';
        return;
    }

    botaoOrcamentoEl.style.opacity = '1';
    botaoOrcamentoEl.style.cursor = 'pointer';
    botaoOrcamentoEl.onclick = null;

    let mensagem = "Olá Portare Travel, gostaria de fazer um orçamento para os seguintes itens:\n\n";
    if (carrinho.length > 0) {
        carrinho.forEach(item => {
            const subtotal = item.quantidade * item.precoUnitario;
            mensagem += `- ${item.nome} (${item.quantidade}x) - $${item.precoUnitario.toFixed(2)} cada = $${subtotal.toFixed(2)}\n`;
        });
        mensagem += `\nTotal Estimado: $${total.toFixed(2)}\n`;
        mensagem += "Aguardo o contato para detalhes e valores finais. Obrigado!";
    } else {
        mensagem = "Olá Portare Travel, gostaria de informações sobre seus passeios.";
    }

    const link = `https://wa.me/${telefoneAgencia}?text=${encodeURIComponent(mensagem)}`;
    botaoOrcamentoEl.href = link;
}
