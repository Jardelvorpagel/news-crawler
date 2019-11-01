const express = require('express');

const crawAPI = require('../api/crawler/setInfos').crawAPI;
const postsAPI = require('../api/crawler/setInfos').postsAPI;
const contentAPI = require('../api/crawler/setInfos').contentAPI;
const sites = require('../api/crawler/setInfos').sites;
const timer = require('../helpers/timer').timer;

module.exports = function (server) {

    //API Routes
    const router = express.Router();
    server.use('/api', router);

    server.disable('x-powered-by');

    // Crawler Routes
    const crawlerService = require('../api/crawler/crawlerService');
    crawlerService.register(router, '/crawlers');

    server.get("/api/:siteIdentifier", async (req, res) => {

        console.log("siteIdentifier", req.params.siteIdentifier)

        try {

            console.log("start");
            const content = await doRequest(req.params.siteIdentifier);
            res.status(200).send(content);
            console.log("end");
        }
        catch (e) {
            console.error(e);
            res.status(500).json(e);
        }

    });


    // const setInfos = require('../api/crawler/setInfos')
    // setInfos.register(router, '/setinfos')
}


async function doRequest(site) {

    const body = await crawAPI(site);
    const posts = postsAPI(body, site);

    await timer(sites[site].timer);

    const content = await contentAPI(posts, site);

    return content;
}