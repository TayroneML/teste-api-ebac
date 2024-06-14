Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarProduto', (token, produto, preco, descricao, quantidade) => {
    cy.request({
        method: 'POST',
        url: 'produtos',
        headers: { authorization: token },
        body: {
            "nome": produto,
            "preco": preco,
            "descricao": descricao,
            "quantidade": quantidade
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('cadastrarUsuario', (token, nome, email, password, administrador) => {
    cy.request({
        method: 'POST',
        url: 'usuarios',
        headers: { authorization: token },
        body: {
            "nome": nome,
            "email": email,
            "password": password,
            "administrador": administrador
        },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('excluirUsuario', (idUsuario) => {
    cy.request({
        method: 'DELETE',
        url: `usuarios/${idUsuario}`
    })
})

//Exclui, caso já exista, o último usuário inserido para resetar o cenário
Cypress.Commands.add('excluirUltimoUsuario', (idUsuario) => {
    cy.request('usuarios').then(response => {
        if (response.body.usuarios.length > 1)
            cy.excluirUsuario(response.body.usuarios[1]._id)
    })
})

