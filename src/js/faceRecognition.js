function initFaceRecognition(event) {

    event.preventDefault();

    defineLoading(true);

    const { exec } = require ('child_process');
    const path = require('path');

    exec("py commands/index.py", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return false;
        }
        let jsonResult = validaUsuario(stdout);

        if(jsonResult){

            const {consultaUsuario} = require('../models/tbl_usuarios');
            
            consultaUsuario(jsonResult.user).then(function (result) {
                console.log('cheguei aqui');
                console.log(result);
                localStorage.setItem('usuarioDados',JSON.stringify(result))
                window.location.href = path.join(__dirname,`/acesso.html`)
            })

        }else{
            defineLoading(false);
            alertDom.classList.add('bg-danger');
            alertDom.innerText = "Usuário não identificado";
            alertDom.classList.remove('d-none');
        }
    });

}

function defineLoading(ativa) {
    
    const conteudoTela = document.getElementById('conteudoTela');
    const loadingTela = document.getElementById('loadingPage');

    if(ativa){
        conteudoTela.classList.add('d-none');
        loadingTela.classList.remove('d-none');
    }else{
        loadingTela.classList.add('d-none');
        conteudoTela.classList.remove('d-none');
    }

}

teste = `{"Status": 404, "user": "lucas-fernandes", "Tentativas": 0}`;

function validaUsuario(respostaServidor) {
    
    const alertDom = document.getElementById('alert');

    const jsonReturned = JSON.parse(respostaServidor)    

    console.log(jsonReturned.Status);

    if(jsonReturned.Status != 200){
        return false;
    }else{
        return jsonReturned;
    }

}
