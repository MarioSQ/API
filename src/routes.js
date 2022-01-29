const express = require ('express')
const routes = express.Router()
const fs = require('fs')
const logger = require('../log/logger')
const env_sms = require('../src/env_sms')
const env_whatsapp = require('../src/env_whatsapp')
const env_email = require('../src/env_email')


// Buscar canais do cliente e encaminhar solicitação
routes.get('/consultar', function(req, res){
    fs.readFile('clientes.json', 'utf8', function(err, data){ 
      if (err) {
        var response = {status: 'falha', resultado: err}
        res.json(response)
      } else {
        var obj = JSON.parse(data)
        var result = 'Nenhum usuário foi encontrado'
    
        obj.clientes.forEach(function(cliente) {
          if (cliente != null) {
            if (cliente.id == req.query.id) {
              result = cliente
              var sms = cliente.sms
              var whatsapp = cliente.whatsapp
              var email = cliente.email
              console.log(email) 
              console.log(whatsapp)
              console.log(sms) 
            }
        
          }
        })

        var response = {status: 'sucesso', resultado: result};
        res.json(response);
      }
    })
   })

// Buscar canais do cliente e encaminhar solicitação de envio
routes.post('/enviar', function(req, res){
    fs.readFile('clientes.json', 'utf8', function(err, data){ 
      if (err) {
        var response = {status: 'falha', resultado: err}
        res.json(response)
      } else {
        var obj = JSON.parse(data)
        var result = []
    
        obj.clientes.forEach(function(cliente) {
          if (cliente != null) {
            if (cliente.id == req.query.id) {
            
            if (cliente.sms != null) {
                result.push ('Mensagem enviada por SMS')
                logger.info (('Mensagem enviada por SMS:')+' '+(cliente.sms) +' -> '+ (req.query.mensagem))

            } 
            if (cliente.whatsapp != null) {
                result.push('Mensagem enviada por WhatsApp')
                logger.info (('Mensagem enviada por WhastApp:')+' '+(cliente.whatsapp) +' -> '+ (req.query.mensagem))

            } 
            if (cliente.email != null) {
                result.push ('Mensagem enviada por e-Mail')
                logger.info (('Mensagem enviada por e-Mail:')+' '+(cliente.email) +' -> '+ (req.query.mensagem))

            }
            if (cliente.sms == null && cliente.whatsapp == null && cliente.email == null) {
                result.push('Cliente não possui canais cadastrados para envio!')
                logger.info ('Cliente não possui canais cadastrados para envio!')

            }
          }
        }
        })
        var response = {status: 'sucesso', resultado: result};
        res.json(response);
      }
    })
   })

module.exports = routes