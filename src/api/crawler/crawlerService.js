const Crawler = require('./crawler')

Crawler.methods(['get', 'post', 'put', 'delete'])
Crawler.updateOptions({ new: true, runValidators: true })

module.exports = Crawler