export default async function getAddressFromCep(cep) {
    const url = "https://h-apigateway.conectagov.estaleiro.serpro.gov.br/api-cep/v1/consulta/cep/"
    const response = await fetch(`${url}${cep}` , {
        method : "GET",
        headers: {
            "x-cpf-usuario" : "70048110426",
            "no-cors" : "true"
        }
    })
    return response
}