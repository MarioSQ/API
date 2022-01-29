const express = require ('express')
const env_sms = express.Router()
const fs = require('fs')
const logger = require('../log/logger')

env_sms.post('/api', function(req, res){
    fs.readFile('usuarios.json', 'utf8', function(err, data){
      if (err) {
        var response = {status: 'falha', resultado: err}
        res.json(response)
      } else {
        var obj = JSON.parse(data)
        req.body.usuario_id = obj.usuarios.length + 1
    
        obj.usuarios.push(req.body)
    
        fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
          if (err) {
            var response = {status: 'falha', resultado: err}
            res.json(response)
          } else {
            var response = {status: 'sucesso', resultado: 'Registro inserido com sucesso'}
            res.json(response)
          }
        })
      }
    })
   })

module.exports = env_sms