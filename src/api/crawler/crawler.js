const restful = require('node-restful')
const mongoose = restful.mongoose

const crawlerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
})

module.exports = restful.model('Crawler', crawlerSchema)