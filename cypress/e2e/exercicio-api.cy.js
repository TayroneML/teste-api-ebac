/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  let token

  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });


  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.duration).to.be.lessThan(30)
    })
  });


  it('Deve cadastrar um usuário com sucesso', () => {
    cy.excluirUltimoUsuario()

    cy.cadastrarUsuario(token, faker.person.firstName() + ' ' + faker.person.lastName(), faker.internet.email(), faker.internet.password(), "true")
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  });


  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario(token, 'Novo Usuario da Silva', 'new_user&teste.com.br', "passteste#", "true")
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.email).to.equal('email deve ser um email válido')
      })
  });

  //*Validação adicional de não permitir usuários com mesmo email
  it('Não deve permitir cadastrar usuário com mesmo email', () => {
    cy.excluirUltimoUsuario()
    
    cy.cadastrarUsuario(token, 'Novo Usuario da Silva', 'new_user@teste.com.br', "passteste#", "true")
    cy.cadastrarUsuario(token, 'Usuario Mesmo Email', 'new_user@teste.com.br', "passteste#", "true")
      .then(response => {
        expect(response.body.message).to.equal('Este email já está sendo usado')
      })
  });


  it('Deve editar um usuário previamente cadastrado', () => {
    cy.excluirUltimoUsuario()

    cy.cadastrarUsuario(token, 'Novo Usuario da Silva', 'new_user@teste.com.br', "passteste#", "true")
    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[1]._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        headers: { authorization: token },
        body:
        {
          "nome": "Usuario Editado da Silva",
          "email": "edit_user@teste.com.br",
          "password": "teste",
          "administrador": "true"
        }
      }).then(response => {
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });


  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.excluirUltimoUsuario()

    let usuario = faker.person.firstName() + ' ' + faker.person.lastName()
    cy.cadastrarUsuario(token, usuario, 'del_user@teste.com.br', "passteste#", "true")

    cy.request('usuarios').then(response => {
      let id = response.body.usuarios[1]._id
      cy.excluirUsuario(id).then(response => {
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  })

});
