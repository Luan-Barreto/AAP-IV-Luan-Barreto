// =====================================================
// STOCK MASTER
// JavaScript - Controle do estoque
// =====================================================


// =====================================================
// ELEMENTOS DO DOM
// =====================================================

const formulario =
    document.getElementById("formProduto");

const nome =
    document.getElementById("nome");

const categoria =
    document.getElementById("categoria");

const sku =
    document.getElementById("sku");

const quantidade =
    document.getElementById("quantidade");

const localizacao =
    document.getElementById("localizacao");

const descricao =
    document.getElementById("descricao");

const tabelaProdutos =
    document.getElementById("tabelaProdutos");

const mensagemFormulario =
    document.getElementById("mensagemFormulario");

const textoPrevisao =
    document.getElementById("textoPrevisao");

const previsao =
    document.getElementById("previsaoEstoque");


// =====================================================
// ELEMENTOS DO RESUMO
// =====================================================

const totalProdutos =
    document.getElementById("totalProdutos");

const produtosDisponiveis =
    document.getElementById("produtosDisponiveis");

const produtosBaixos =
    document.getElementById("produtosBaixos");

const produtosSemEstoque =
    document.getElementById("produtosSemEstoque");


// =====================================================
// FUNÇÃO PARA LIMPAR ERROS
// =====================================================

function limparErros() {

    document.getElementById("erroNome").textContent = "";

    document.getElementById("erroCategoria").textContent = "";

    document.getElementById("erroSku").textContent = "";

    document.getElementById("erroQuantidade").textContent = "";

    document.getElementById("erroLocalizacao").textContent = "";

    document.getElementById("erroDescricao").textContent = "";

    mensagemFormulario.textContent = "";

    mensagemFormulario.classList.remove("sucesso");
}


// =====================================================
// FUNÇÃO PARA MOSTRAR ERRO
// =====================================================

function mostrarErro(campo, mensagem) {

    document.getElementById(
        "erro" + campo
    ).textContent = mensagem;

}


// =====================================================
// VALIDAÇÃO DO FORMULÁRIO
// =====================================================

function validarFormulario() {

    let valido = true;

    limparErros();


    // -------------------------------------------------
    // NOME
    // -------------------------------------------------

    if (nome.value.trim() === "") {

        mostrarErro(
            "Nome",
            "Informe o nome do item."
        );

        valido = false;

    }

    else if (nome.value.trim().length < 3) {

        mostrarErro(
            "Nome",
            "O nome deve possuir pelo menos 3 caracteres."
        );

        valido = false;

    }


    // -------------------------------------------------
    // CATEGORIA
    // -------------------------------------------------

    if (categoria.value === "") {

        mostrarErro(
            "Categoria",
            "Selecione uma categoria."
        );

        valido = false;

    }


    // -------------------------------------------------
    // SKU
    // -------------------------------------------------

    /*
        O SKU NÃO é obrigatório.

        Isso permite cadastrar componentes
        que não possuem código SKU.
    */

    if (
        sku.value.trim() !== "" &&
        sku.value.trim().length < 3
    ) {

        mostrarErro(
            "Sku",
            "O SKU deve possuir pelo menos 3 caracteres."
        );

        valido = false;

    }


    // -------------------------------------------------
    // QUANTIDADE
    // -------------------------------------------------

    if (quantidade.value === "") {

        mostrarErro(
            "Quantidade",
            "Informe a quantidade."
        );

        valido = false;

    }

    else if (
        Number(quantidade.value) < 0
    ) {

        mostrarErro(
            "Quantidade",
            "A quantidade não pode ser negativa."
        );

        valido = false;

    }


    return valido;

}


// =====================================================
// DETERMINAR SITUAÇÃO DO ESTOQUE
// =====================================================

function determinarSituacao(valor) {

    const quantidadeProduto =
        Number(valor);


    if (quantidadeProduto === 0) {

        return {
            nome: "Sem estoque",
            classe: "sem-estoque"
        };

    }


    if (quantidadeProduto <= 5) {

        return {
            nome: "Estoque baixo",
            classe: "baixo"
        };

    }


    return {
        nome: "Disponível",
        classe: "disponivel"
    };

}


// =====================================================
// ATUALIZAÇÃO DA PREVISÃO
// =====================================================

quantidade.addEventListener(
    "input",
    function () {

        if (quantidade.value === "") {

            textoPrevisao.textContent =
                "Informe a quantidade para visualizar a situação do estoque.";

            return;

        }


        const situacao =
            determinarSituacao(
                quantidade.value
            );


        textoPrevisao.textContent =
            "Este item será classificado como: "
            + situacao.nome
            + ".";

    }
);


// =====================================================
// CADASTRO DINÂMICO NA TABELA
// =====================================================

function adicionarProdutoNaTabela() {

    const situacao =
        determinarSituacao(
            quantidade.value
        );


    const novaLinha =
        document.createElement("tr");


    novaLinha.innerHTML = `

        <td>
            <strong>
                ${nome.value.trim()}
            </strong>
        </td>

        <td>
            ${
                sku.value.trim() === ""
                    ? "—"
                    : sku.value.trim()
            }
        </td>

        <td>
            ${categoria.options[categoria.selectedIndex].text}
        </td>

        <td>
            <strong>
                ${quantidade.value}
            </strong>
        </td>

        <td>
            ${
                localizacao.value.trim() === ""
                    ? "—"
                    : localizacao.value.trim()
            }
        </td>

        <td>
            <span class="badge ${situacao.classe}">
                ${situacao.nome}
            </span>
        </td>

    `;


    tabelaProdutos.prepend(
        novaLinha
    );

}


// =====================================================
// ATUALIZAÇÃO DOS CARDS
// =====================================================

function atualizarResumo() {

    const linhas =
        tabelaProdutos.querySelectorAll("tr");


    let disponiveis = 0;

    let baixos = 0;

    let semEstoque = 0;


    linhas.forEach(
        function (linha) {

            const badge =
                linha.querySelector(".badge");


            if (!badge) {
                return;
            }


            if (
                badge.classList.contains(
                    "disponivel"
                )
            ) {

                disponiveis++;

            }


            if (
                badge.classList.contains(
                    "baixo"
                )
            ) {

                baixos++;

            }


            if (
                badge.classList.contains(
                    "sem-estoque"
                )
            ) {

                semEstoque++;

            }

        }
    );


    totalProdutos.textContent =
        linhas.length;


    produtosDisponiveis.textContent =
        disponiveis;


    produtosBaixos.textContent =
        baixos;


    produtosSemEstoque.textContent =
        semEstoque;

}


// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

formulario.addEventListener(
    "submit",
    function (evento) {

        // Impede o recarregamento da página

        evento.preventDefault();


        // Executa a validação

        const valido =
            validarFormulario();


        if (!valido) {

            mensagemFormulario.textContent =
                "Verifique os campos destacados antes de continuar.";

            return;

        }


        // Adiciona o item à tabela

        adicionarProdutoNaTabela();


        // Atualiza os indicadores

        atualizarResumo();


        // Mensagem de sucesso

        mensagemFormulario.textContent =
            "✓ Item cadastrado com sucesso!";

        mensagemFormulario.classList.add(
            "sucesso"
        );


        // Limpa os campos

        formulario.reset();


        textoPrevisao.textContent =
            "Informe a quantidade para visualizar a situação do estoque.";


        // Remove a mensagem depois de alguns segundos

        setTimeout(
            function () {

                mensagemFormulario.textContent = "";

                mensagemFormulario.classList.remove(
                    "sucesso"
                );

            },
            4000
        );

    }
);


// =====================================================
// BOTÃO RESET
// =====================================================

formulario.addEventListener(
    "reset",
    function () {

        setTimeout(
            function () {

                limparErros();

                textoPrevisao.textContent =
                    "Informe a quantidade para visualizar a situação do estoque.";

            },
            10
        );

    }
);


// =====================================================
// ATUALIZA RESUMO INICIAL
// =====================================================

atualizarResumo();