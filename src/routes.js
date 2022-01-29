const express = require ('express')
const routes = express.Router()
const fs = require('fs')
const logger = require('../log/logger')
const env_sms = require('../src/env_sms')
const env_whatsapp = require('../src/env_whatsapp')
const env_email = require('../src/env_email')
var save = []

// Buscar mensagens enviadas ao cliente
routes.get('/consultar', function(req, res){
    fs.readFile('envios.json', 'utf8', function(err, data){ 
      if (err) {
        var response = {status: 'falha', resultado: err}
        res.json(response)
      } else {
        var obj = JSON.parse(data)
        var result = []
            
        obj.mensagens.forEach(function(mensagem) {
          if (mensagem != null) {
            if (mensagem.cliente_id == req.query.cliente_id) {
              result.push (mensagem)
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
            if (cliente.cliente_id == req.query.cliente_id) {
            
            if (cliente.sms != null) {
                result.push ('Mensagem enviada por SMS')
                logger.info (('Mensagem enviada por SMS:')+' '+(cliente.sms) +' -> '+ (req.query.mensagem))
                save = (req.body)
                salvar ()

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
        var response = {status: 'sucesso', resultado: result}
        res.json(response);
      }
    })
   })


// Salvar mensagens na base
function salvar () {
  var result
    fs.readFile('envios.json', 'utf8', function(err, data){
      if (err) {
        logger.error ('Falha na inserção da mensagem JSON - 11000')
      } else {
        var obj = JSON.parse(data);
        
        id = obj.mensagens.length + 1;
        
        obj.mensagens.push(save);
        
        fs.writeFile('envios.json', JSON.stringify(obj), function(err) {
          if (err) {
            logger.error ('Falha na inserção da mensagem JSON - 12000')
          } else {
            logger.info ('Registro inserido com sucesso!')
          }
        })
      }
    })
    return result
  }

module.exports = routes