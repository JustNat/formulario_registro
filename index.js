// toda vez que ocorrer um evento do tipo "input" no elemento de ID "cpf", faça essa função 
document.getElementById('cpf').addEventListener("input", (e) => { // parâmetro 'e' refere-se ao evento que ocorreu
    // e.target refere-se ao elemento do HTML que disparou o evento
    // e.target.value é o valor que o elemento HTML possui no momento
    cpf = e.target.value
    // faz com que o campo cpf seja formatado automaticamente no formato : XXX.XXX.XXX-XX
    cpf = cpf
        .replace(/\D/g, '') // Remove qualquer coisa que não seja número
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o terceiro dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após o sexto dígito
        .replace(/(\d{3})(\d)/, '$1-$2') // Adiciona traço após o nono dígito
        .replace(/(-\d{2})\d+?$/, '$1') // Impede entrada de mais de 11 dígitos)
    // manda o cpf formatado para o valor do elemento
    e.target.value = cpf
})

document.getElementById('phone').addEventListener("input", (e) => { // parâmetro 'e' refere-se ao evento que ocorreu
    // e.target refere-se ao elemento do HTML que disparou o evento
    // e.target.value é o valor que o elemento HTML possui no momento
    phone = e.target.value
    // faz com que o campo telefone(phone) seja formatado automaticamente no formato : (XX)X-XXXX-XXXX
    phone = phone
    .replace(/\D/g, '') // Remove tudo que não for número
    .replace(/(\d{0})(\d)/, '$1($2')  // Adiciona o parêntese de abertura antes do primeiro dígito
    .replace(/(\d{3})(\d)/, '$1) $2')  // Fecha o parêntese após os três primeiros dígitos e adiciona espaço
    .replace(/(\d{1})(\d{4})(\d{4})/, '$1 $2-$3')// Formata o restante como "9 9865-9520"
    .replace(/(-\d{4})\d+?$/, '$1');  
    e.target.value = phone
})


// requisição para pegar o endereço com a informação do CEP pela api viacep
// deve ser async para indicar que um trecho do código deve ser esperado pelo resto
async function getAddressFromCep(cep) {
    const url = "https://viacep.com.br/ws"
    // código prometido
    const response = await fetch(`${url}/${cep}/json`, {
        method: "GET",
    })
    // se houve uma resposta, retorne um objeto json dessa resposta
    if (response.ok) {
        return response.json()
    }
}

// preencher os campos de endereço baseado no CEP
document.getElementById('cep').addEventListener('input', async (e) => {
    // impede a entrada de caracteres não numéricos
    e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{8})\d+?$/, '$1')
    // se os caracteres no campo CEP forem menor que 8, faça o input disponível
    if (e.target.value.length !== 8) {
        document.getElementById("country").disabled = true
        document.getElementById("state").disabled = true
        document.getElementById("city").disabled = true
        document.getElementById("neighborhood").disabled = true
        document.getElementById("street").disabled = true
    }
    // caso tiver 8 caracteres e o cep foi encontrado, preencha os campos e os deixe indisponível
    else {
        let response = await getAddressFromCep(e.target.value)
        if (!response.erro === true) {
            document.getElementById("country").value = "Brasil"
            document.getElementById("country").disabled = true
            document.getElementById("state").value = response.uf
            document.getElementById("state").disabled = true
            document.getElementById("city").value = response.localidade
            document.getElementById("city").disabled = true
            document.getElementById("neighborhood").value = response.bairro
            document.getElementById("neighborhood").disabled = true
            document.getElementById("street").value = response.logradouro
            document.getElementById("street").disabled = true
        }
    }
})




// Functions de validações especificas do formulario

function validateCpf(cpf) {

    // retira qualquer caractere não numérico
    cpf = cpf.replace(/\D/g, '')

    // se tiver menos de 11 caracteres retorna falso
    if (cpf.length !== 11) return { valido: false, mensagem: "CPF Deve ser maior que 11 digitos!" };
    let soma = 0;
    let resto;
    if (/^(\d)\1{10}$/.test(cpf)) return { valido: false, mensagem: "CPF INVALIDO" }; // Verifica sequências iguais

    // verifica se o CPF é válido utilizando toda lógica de CPF
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { valido: false, mensagem: "CPF INVALIDO" };

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { valido: false, mensagem: "CPF INVALIDO" };

    // se passou por toda validação acima, retorna verdadeiro
    return { valido: true, mensagem: "" };
    
}

function validarNome(nome) {

    nome = nome.trim();

    // Verifica se o nome está vazio ou nulo
    if (nome === "" || nome === null) {
        return { valido: false, mensagem: "Campo obrigatório." };
    }

    // Verifica se o nome tem pelo menos 2 caracteres
    if (nome.length < 2) {
        return { valido: false, mensagem: "Mínimo 2 caracteres." };
    }

    // Verifica se o nome contém apenas letras e espaços
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // Aceita letras (incluindo caracteres acentuados) e espaços
    if (!regex.test(nome)) {
        return { valido: false, mensagem: "Somente letras e espaços!." };
    }

    return { valido: true, mensagem: "" };
}

function validarDataNascimento(data) {

    // Verifica se a data está vazia
    if (!data) {
        return { valido: false, mensagem: "Selecione uma Data!" };
    }

    const dataNascimento = new Date(data);
    const dataAtual = new Date();

    // Verifica se a data é válida
    if (isNaN(dataNascimento.getTime())) {
        return { valido: false, mensagem: "Data de nascimento inválida." };
    }

    // Verifica se a data é futura
    if (dataNascimento > dataAtual) {
        return { valido: false, mensagem: "Data de nascimento inválida." };
    }

    // Verifica uma idade mínima
    const idadeMinima = 16;
    const anoAtual = dataAtual.getFullYear();
    const anoNascimento = dataNascimento.getFullYear();
    const idade = anoAtual - anoNascimento;

    if (idade < idadeMinima) {
        return { valido: false, mensagem: `Você deve ter pelo menos ${idadeMinima} anos.` };
    }

    return { valido: true, mensagem: "" };
}

function validarEmail(email) {

    // Verifica se o e-mail está vazio
    if (!email) {
        return { valido: false, mensagem: "Campo obrigatório." };
    }

    // Expressão regular para validar o formato do e-mail
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verifica se o e-mail corresponde ao formato esperado
    if (!regex.test(email)) {
        return { valido: false, mensagem: "E-mail inválido." };
    }

    return { valido: true, mensagem: "" };
}

function validarTelefone(telefone) {
    // Remove caracteres não numéricos
    telefone = telefone.replace(/\D/g, '');

    // Verifica se o telefone está vazio
    if (!telefone) {
        return { valido: false, mensagem: "Campo é obrigatório." };
    }

    if (telefone.length != 12) {
        return { valido: false, mensagem: "Telefone invalido" };
    }

    if(telefone[3] != 9){
        return { valido: false, mensagem: "Telefone invalido" };
    }

    return { valido: true, mensagem: "" };
}

function validarCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
        return { valido: false, mensagem: "O CEP deve ter 8 dígitos." };
    }
    return { valido: true, mensagem: "" };
}

function validarNumeroResidencial(numero) {

    // Remove espaços em branco no início e no final
    numero = numero.trim();

    // Verifica se o número está vazio ou nulo 
    if (numero === '' || numero === null) {
        return { valido: false, mensagem: "Campo Obrigatório" };
    }

    // Verifica se o número contém apenas caracteres válidos (números, letras, e caracteres como /, - ou .)
    const regex = /^[a-zA-Z0-9]+$/; // Permite letras, números e alguns caracteres especiais
    if (!regex.test(numero)) {
        return { valido: false, mensagem: "Campo Invalido" };
    }

    return { valido: true };
}


document.getElementById("form_data").addEventListener("submit", function(event) {

    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');

    const DataList = {
        'Nome': document.getElementById("name").value.trim(),
        'Sobrenome': document.getElementById("last-name").value.trim(),
        'Data de Aniversario': document.getElementById("birthday").value,
        'CPF': document.getElementById("cpf").value,
        'email': document.getElementById("email").value.trim(),
        'Telefone': document.getElementById("phone").value.trim(),
        'CEP': document.getElementById("cep").value,
        'Pais': document.getElementById("country").value.trim(),
        'Estado': document.getElementById("state").value.trim(),
        'Cidade': document.getElementById("city").value.trim(),
        'Bairro': document.getElementById("neighborhood").value.trim(),
        'Numero Residencia': document.getElementById("residential-number").value.trim(),
        'Rua': document.getElementById("street").value.trim(),
    };

    let camposVazios = [];

    // Validação do CPF  
    const resultadoCpf = validateCpf(DataList["CPF"]);
    if (!resultadoCpf.valido){
        camposVazios.push("CPF");
        document.getElementById("error-cpf").textContent = resultadoCpf.mensagem;
        event.preventDefault()
    }

    // Validação do nome
    const resultadoNome = validarNome(DataList["Nome"]);
    if (!resultadoNome.valido) {
        document.getElementById("error-name").textContent = resultadoNome.mensagem;
        camposVazios.push("NOME");
    }

    // Validação do Sobrenome
    const resultadoLastName = validarNome(DataList["Sobrenome"]);
    if (!resultadoLastName.valido) {
        document.getElementById("error-last-name").textContent = resultadoLastName.mensagem;
        camposVazios.push("Sobrenome");
    }

    // Validação da Data de Nascimento
    const resultadoDate = validarDataNascimento(DataList["Data de Aniversario"]);
    if (!resultadoDate.valido) {
        document.getElementById("error-birthday").textContent = resultadoDate.mensagem;
        camposVazios.push("Data de Aniversario");
    }

    // Validação do Email
    const resultadoEmail = validarEmail(DataList["email"]);
    if (!resultadoEmail.valido) {
        document.getElementById("error-email").textContent = resultadoEmail.mensagem;
        camposVazios.push("Email");
    }

    // Validação do Telefone
    const resultadoPhone = validarTelefone(DataList["Telefone"]);
    if (!resultadoPhone.valido) {
        document.getElementById("error-phone").textContent = resultadoPhone.mensagem;
        camposVazios.push("Telefone");
    }

    // Validação do Cep
    const resultadoCEP = validarCEP(DataList["CEP"]);
    if (!resultadoCEP.valido) {
        document.getElementById("error-cep").textContent = resultadoCEP.mensagem;
        camposVazios.push("CEP");
    }

    // Validação do Numero da Residência
    const resultadoNum = validarNumeroResidencial(DataList["Numero Residencia"]);
    if (!resultadoNum.valido) {
        document.getElementById("error-Rnumber").textContent = resultadoNum.mensagem;
        camposVazios.push("Numero Residencia");
    }





    // Exibindo os resultados
    if (camposVazios.length > 0) {
        alert("Os seguintes campos estão vazios ou invalidos: " + camposVazios.join(', '));
        event.preventDefault()
    } else {
        alert("Formulario Enviado");
    }

    })