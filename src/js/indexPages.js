var usuarioDados = localStorage.getItem("usuarioDados");
usuarioDados = JSON.parse(usuarioDados);

document.addEventListener("DOMContentLoaded", function () {
    // Altera imagem do usuario
    const imagem_perfil = document.getElementById("imagem_perfil");
    imagem_perfil.setAttribute("src", usuarioDados.imagem_perfil);

    // Altera o nome do usuario
    const nome_usuario = document.getElementById("nome_usuario");
    nome_usuario.innerText = usuarioDados.nome_usuario;

    // Altera o cargo do usuário
    const cargo_usuario = document.getElementById("cargo");
    cargo_usuario.innerText = usuarioDados.cargo;

    // Altera o nivel de acesso do usuário
    const nivel_usuario = document.getElementById("nivel");
    nivel_usuario.innerText = "Nível " + usuarioDados.nivel_acesso;

    // Libera apenas as opções corretas para o usuário
    validaPermissoesFuncoes(usuarioDados.nivel_acesso);
});

function validaPermissoesFuncoes(nivel_acesso) {
    const agroBtn = document.getElementById("agrotoxicos");
    const propBtn = document.getElementById("propriedades");
    const investBtn = document.getElementById("investimento");
    const arqBtn = document.getElementById("arquivos");
    const telBtn = document.getElementById("telefones");
    const newsBtn = document.getElementById("noticias");

    // Bloqueia os itens certos
    if (nivel_acesso == 2) {
        investBtn.classList.add("disabledFunction");
        arqBtn.classList.add("disabledFunction");
    } else if (nivel_acesso == 1) {
        investBtn.classList.add("disabledFunction");
        arqBtn.classList.add("disabledFunction");
        agroBtn.classList.add("disabledFunction");
        propBtn.classList.add("disabledFunction");
    }
}

function deslogar() {
    
    const path = require('path');

    localStorage.removeItem('usuarioDados');
    window.location.href = path.join(__dirname,`/index.html`)

}
