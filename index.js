// toda vez que ocorrer um evento do tipo "input" no elemento de ID "cpf", faça essa função 
document.getElementById("cpf").addEventListener("input", (e) => { // parâmetro 'e' refere-se ao evento que ocorreu
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

function validateCpf(cpf) {

    // retira qualquer caractere não numérico
    cpf.replace(/\D/g, '')

    // se tiver menos de 11 caracteres retorna falso
    if (cpf.length !== 11) return false;
    let soma = 0;
    let resto;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Verifica sequências iguais

    // verifica se o CPF é válido utilizando toda lógica de CPF
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    // se passou por toda validação acima, retorna verdadeiro
    return true;
}

// função para validar o email
function validateEmail(email) {
    email = email.toLowerCase()
    if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
        return true
    else false
}

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
    e.target.value = e.target.value.replace(/\D/g, '')
    // se os caracteres no campo CEP forem menor que 8, faça o input disponível
    if (e.target.value.length !== 8) {
        document.getElementById("country").disabled = false
        document.getElementById("state").disabled = false
        document.getElementById("city").disabled = false
        document.getElementById("neighborhood").disabled = false
        document.getElementById("street").disabled = false
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