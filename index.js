import getAddressFromCep from './getAddressFromCep.js'

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
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    // se passou por toda validação acima, retorna verdadeiro
    return true;
}

function validateEmail(email) {
    email = email.toLowerCase()
    if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) 
        return true
    else false
}

document.getElementById('cep').addEventListener('input', (e) => {
    if (e.target.value.length !== 8) return
    else {
        const response = getAddressFromCep(e.target.value)
        if (response.ok) {
            document.getElementById("country").value = "Brasil"
            document.getElementById("state").value = response.uf
            document.getElementById("city").value = response.cidade
            document.getElementById("neighborhood").value = response.bairro
            document.getElementById("street").value = response.endereco
            document.getElementById("residential-number").value = response.complemento 
        }
    }
})