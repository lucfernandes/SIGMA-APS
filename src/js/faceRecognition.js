function initFaceRecognition(event) {
    event.preventDefault();

    defineLoading(true);

    const { exec } = require ('child_process');

    exec("py commands/index.py", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        validaUsuario(stdout)
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

    if(jsonReturned.Status != 200){
        defineLoading(false);
        alertDom.classList.add('bg-danger');
        alertDom.innerText = "Usuário não encontrado";
        // alertDom.innerText = window.location.href;
        alertDom.classList.remove('d-none');
    }else{
        
    }

}

validaUsuario(teste)
