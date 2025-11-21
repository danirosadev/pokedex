const cardContainer = document.querySelector("main"); // O container dos cards é o <main>
const campoBusca = document.querySelector("#campo-busca");
const botaoBusca = document.querySelector("#botao-busca");
let dados = [];

// Função para carregar os dados do JSON uma única vez.
async function carregarDados() {
    try {
        const resposta = await fetch("pokedex.json");
        const json = await resposta.json();
        dados = json.pokemon; // Acessa o array de pokémons dentro do JSON
        renderizarCards(dados, true); // Exibe todos os cards inicialmente, apenas com imagem
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>";
    }
}

// Função para renderizar os detalhes completos de um único Pokémon
function renderizarDetalhes(pokemon) {
    cardContainer.innerHTML = ""; // Limpa a tela
    const article = document.createElement("article");
    article.classList.add("card-detalhe"); // Adiciona uma classe para estilização específica
    
    // Constrói o HTML com os detalhes do Pokémon
    article.innerHTML = `
        <img src="${pokemon.img}" alt="Imagem de ${pokemon.name}">
        <h2>${pokemon.num} - ${pokemon.name}</h2>
        <p><strong>Tipo:</strong> ${pokemon.type.join(", ")}</p>
        <p><strong>Altura:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <p><strong>Fraquezas:</strong> ${pokemon.weaknesses.join(", ")}</p>
        <button id="voltar">Voltar para a lista</button>
    `;
    cardContainer.appendChild(article);

    // Adiciona evento ao botão "voltar"
    document.querySelector("#voltar").addEventListener("click", () => {
        renderizarCards(dados, true); // Renderiza a lista inicial novamente
        campoBusca.value = ""; // Limpa o campo de busca
    });
}

function iniciarBusca() {
    // Pega o termo da busca, remove espaços em branco e converte para minúsculas.
    const termoBusca = campoBusca.value.trim().toLowerCase();

    // Filtra os dados com base no nome ou número do Pokémon.
    const resultados = dados.filter(pokemon =>
        pokemon.name.toLowerCase().includes(termoBusca) ||
        pokemon.num.includes(termoBusca)
    );

    // Se encontrar exatamente um resultado, mostra os detalhes. Senão, mostra a lista filtrada.
    if (resultados.length === 1) {
        renderizarDetalhes(resultados[0]);
    } else {
        renderizarCards(resultados, true);
    }
}

function renderizarCards(pokemons, apenasImagem = false) {
    cardContainer.innerHTML = ""; // Limpa o container antes de adicionar novos cards.

    for (const pokemon of pokemons) {
        const article = document.createElement("article");
        article.innerHTML = `<img src="${pokemon.img}" alt="Imagem de ${pokemon.name}">`;
        
        // Adiciona um evento de clique para mostrar os detalhes
        article.addEventListener("click", () => renderizarDetalhes(pokemon));

        cardContainer.appendChild(article);
    }
}

// Carrega os dados assim que o script é executado.
carregarDados();

// Adiciona evento de clique ao botão de busca
botaoBusca.addEventListener("click", iniciarBusca);

// Opcional: busca ao pressionar Enter no campo de input
campoBusca.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});