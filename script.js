// =====================================================
// STOCK MASTER
// JavaScript - Validação e consulta de CEP
// =====================================================


// ELEMENTOS DO DOM

const formulario = document.getElementById("formProduto");

const nome = document.getElementById("nome");
const sku = document.getElementById("sku");
const categoria = document.getElementById("categoria");
const quantidade = document.getElementById("quantidade");
const cep = document.getElementById("cep");

const logradouro = document.getElementById("logradouro");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

const mensagemFormulario =
    document.getElementById("mensagemFormulario");

const cepStatus =
    document.getElementById("cepStatus");


// =====================================================
// LIMPAR ERROS
// =====================================================

function limparErros() {

    document.getElementById("erroNome").textContent = "";
    document.getElementById("erroSku").textContent = "";
    document.getElementById("erroCategoria").textContent = "";
    document.getElementById("erroQuantidade").textContent = "";
    document.getElementById("erroCep").textContent = "";

    mensagemFormulario.textContent = "";

    mensagemFormulario.classList.remove("sucesso");
}


// =====================================================
// MOSTRAR ERRO
// =====================================================

function mostrarErro(campo, mensagem) {

    document.getElementById(
        "erro" + campo
    ).textContent = mensagem;

}


// =====================================================
// VALIDAÇÃO
// =====================================================

function validarFormulario() {

    let valido = true;

    limparErros();


    // NOME

    if (nome.value.trim() === "") {

        mostrarErro(
            "Nome",
            "Informe o nome do produto."
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


    // SKU

    if (sku.value.trim() === "") {

        mostrarErro(
            "Sku",
            "Informe o SKU do produto."
        );

        valido = false;

    }

    else if (sku.value.trim().length < 3) {

        mostrarErro(
            "Sku",
            "O SKU deve possuir pelo menos 3 caracteres."
        );

        valido = false;

    }


    // CATEGORIA

    if (categoria.value === "") {

        mostrarErro(
            "Categoria",
            "Selecione uma categoria."
        );

        valido = false;

    }


    // QUANTIDADE

    if (quantidade.value === "") {

        mostrarErro(
            "Quantidade",
            "Informe a quantidade."
        );

        valido = false;

    }

    else if (Number(quantidade.value) < 0) {

        mostrarErro(
            "Quantidade",
            "A quantidade não pode ser negativa."
        );

        valido = false;

    }


    // CEP

    const cepNumeros =
        cep.value.replace(/\D/g, "");

    if (cepNumeros.length !== 8) {

        mostrarErro(
            "Cep",
            "Informe um CEP válido."
        );

        valido = false;

    }


    return valido;

}


// =====================================================
// FORMATAÇÃO DO CEP
// =====================================================

cep.addEventListener("input", function () {

    let valor =
        cep.value.replace(/\D/g, "");

    if (valor.length > 8) {

        valor =
            valor.substring(0, 8);

    }

    if (valor.length > 5) {

        valor =
            valor.substring(0, 5)
            + "-"
            + valor.substring(5);

    }

    cep.value = valor;

});


// =====================================================
// CONSULTA ASSÍNCRONA DO CEP
// =====================================================

cep.addEventListener("blur", async function () {

    const cepNumeros =
        cep.value.replace(/\D/g, "");


    if (cepNumeros.length !== 8) {

        return;

    }


    // Mostra carregamento

    cepStatus.textContent = "Buscando...";

    cepStatus.style.color = "#2563eb";


    // Limpa endereço anterior

    logradouro.value = "";
    bairro.value = "";
    cidade.value = "";
    estado.value = "";


    try {

        const resposta = await fetch(
            `https://viacep.com.br/ws/${cepNumeros}/json/`
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro na consulta."
            );

        }


        const dados =
            await resposta.json();


        // CEP inexistente

        if (dados.erro) {

            mostrarErro(
                "Cep",
                "CEP não encontrado."
            );

            cepStatus.textContent = "✕";

            cepStatus.style.color = "#dc2626";

            return;

        }


        // Preenchimento automático

        logradouro.value =
            dados.logradouro || "";

        bairro.value =
            dados.bairro || "";

        cidade.value =
            dados.localidade || "";

        estado.value =
            dados.uf || "";


        // Sucesso

        cepStatus.textContent =
            "✓ Encontrado";

        cepStatus.style.color =
            "#16a34a";


        document.getElementById(
            "erroCep"
        ).textContent = "";


    }

    catch (erro) {

        mostrarErro(
            "Cep",
            "Não foi possível consultar o CEP."
        );

        cepStatus.textContent = "✕";

        cepStatus.style.color =
            "#dc2626";

        console.error(erro);

    }

});


// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

formulario.addEventListener(
    "submit",
    function (evento) {

        // Impede recarregamento

        evento.preventDefault();


        // Valida

        const valido =
            validarFormulario();


        if (!valido) {

            mensagemFormulario.textContent =
                "Verifique os campos destacados.";

            return;

        }


        // Sucesso

        mensagemFormulario.textContent =
            "✓ Produto validado com sucesso!";

        mensagemFormulario.classList.add(
            "sucesso"
        );


        // Exibe os dados no console

        console.log({

            nome: nome.value,

            sku: sku.value,

            categoria: categoria.value,

            quantidade: quantidade.value,

            cep: cep.value,

            endereco: logradouro.value,

            bairro: bairro.value,

            cidade: cidade.value,

            estado: estado.value

        });

    }
);


// =====================================================
// BOTÃO LIMPAR
// =====================================================

formulario.addEventListener(
    "reset",
    function () {

        setTimeout(function () {

            limparErros();

            cepStatus.textContent = "";

            logradouro.value = "";
            bairro.value = "";
            cidade.value = "";
            estado.value = "";

        }, 10);

    }
);