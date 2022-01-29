const express = require ('express')
const env_email = express.Router()
const fs = require('fs')
const logger = require('../log/logger')

module.exports = env_email