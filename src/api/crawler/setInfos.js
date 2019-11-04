const request = require('request');
const cheerio = require('cheerio');
const timer = require('../../helpers/timer').timer;

const sites = {
    'g1': {
        'url': 'https://g1.globo.com/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.feed-root .feed-post a.feed-post-link'
            },
            'post': {
                'title': '.content-head .title',
                'content': '.mc-article-body article'
            }
        }
    },
    'cgn': {
        'url': 'https://cgn.inf.br/',
        'timer': 10000,
        'selectors': {
            'list': {
                'link': '.mvp-main-blog-cont ul.mvp-blog-story-list li a'
            },
            'post': {
                'title': '.mvp-post-title',
                'content': '#mvp-content-body .descricao'
            }
        }
    },
    'terra': {
        'url': 'https://www.terra.com.br/noticias/',
        'timer': 1000,
        'selectors': {
            'list': {
                'link': '[data-source-name="Estadão Conteúdo"] h3 a.text'
            },
            'post': {
                'title': '.ctnHeadline .title.headline',
                'content': '.articleData '
            }
        }
    },
    'globoesporte': {
        'url': 'https://globoesporte.globo.com/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.feed-root .feed-post.type-basico a.feed-post-link'
            },
            'post': {
                'title': 'h1.content-head__title',
                'content': '.mc-article-body article'
            }
        }
    },
    'ig': {
        'url': 'https://www.ig.com.br',
        'timer': 100,
        'selectors': {
            'list': {
                'link': 'h3 .titulo'
            },
            'post': {
                'title': 'h1#noticia-titulo-h1',
                'content': 'section.noticia #noticia'
            }
        }
    },
    'catv': {
        'url': 'https://www.catve.com/ultimas-noticias',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.card-block a.link-noticia'
            },
            'post': {
                'title': 'article.jscroll h1.noticia-titulo',
                'content': 'article.jscroll .noticia-texto'
            }
        }
    },
    'yahoo': {
        'url': 'https://br.noticias.yahoo.com',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '[data-test-locator="mega"] h3 > a'
            },
            'post': {
                'title': '#YDC-Side h1',
                'content': '#Main article > .canvas-body'
            }
        }
    },
    'uol': {
        'url': 'https://noticias.uol.com.br/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': 'section.results-index .results-items a'
            },
            'post': {
                'title': 'article header h1',
                'content': 'article .content-article .image-content-pad'
            }
        }
    },
    'noticiasaominuto': {
        'url': 'https://www.noticiasaominuto.com.br/',
        'timer': 10,
        'selectors': {
            'list': {
                'link': '.article-thumb-text a'
            },
            'post': {
                'title': 'h1.news-headline',
                'content': '.news-main-text'
            }
        }
    },
    'motor1': {
        'url': 'https://motor1.uol.com.br',
        'timer': 0,
        'selectors': {
            'list': {
                'link': '.browseBox > .item > .info > .text-box h3 > a'
            },
            'post': {
                'title': '.articleTitle h1',
                'content': '.postContent .postBody'
            }
        }
    },
    'tecmundo': {
        'url': 'https://www.tecmundo.com.br/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '#listaUltimasNoticias a.tec--card__title__link'
            },
            'post': {
                'title': 'h1#js-article-title',
                'content': '.tec--article__body'
            }
        }
    },
    'papogula': {
        'url': 'https://www.papogula.com.br/category/papo-dicas/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.list .posts .post > a'
            },
            'post': {
                'title': 'h2.title',
                'content': '.conteudo .pf-content'
            }
        }
    },
    'ofuxico': {
        'url': 'https://www.ofuxico.com.br/noticias-sobre-famosos.html',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.post-news h3 > a'
            },
            'post': {
                'title': '.box-header h1',
                'content': '.box-text'
            }
        }
    },
    'opresente': {
        'url': 'https://www.opresente.com.br/ultimas-noticias/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.infinite-post > a'
            },
            'post': {
                'title': '#post-header .entry-title',
                'content': '#content-area #content-main'
            }
        }
    },
    'oparana': {
        'url': 'https://oparana.com.br/ultimas-noticias/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.xt-post-title > a'
            },
            'post': {
                'title': '.xt-post-title',
                'content': '.article-content .post-body'
            }
        }
    },
    'r7': {
        'url': 'https://www.r7.com/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.r7-flex-title-h2__link, .r7-flex-title-h5__link, .r7-flex-title-h4__link'
            },
            'post': {
                'title': '.heading-title > h1',
                'content': 'article.content'
            }
        }
    },
    'camaradetoledo': {
        'url': 'https://www.toledo.pr.leg.br/assessoria-de-imprensa/noticias/agregador2',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.tileItem > a'
            },
            'post': {
                'title': '#content #parent-fieldname-title',
                'content': '#content-core'
            }
        }
    },
    'lance': {
        'url': 'https://www.lance.com.br',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.modules-secondary .module-article a.title.page-link'
            },
            'post': {
                'title': '.article-main > h1.title',
                'content': '.article-body .left-content .content-modules p:nth-child(n)'
            }
        }
    },
    'canalrural': {
        'url': 'https://canalrural.uol.com.br/noticias/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': 'h2.fl-post-title > a'
            },
            'post': {
                'title': 'h1.heading-title > .title-text',
                'content': '.fl-module-content > .fl-rich-text'
            }
        }
    },
    'tudointeressante': {
        'url': 'https://www.tudointeressante.com.br/',
        'timer': 100,
        'selectors': {
            'list': {
                'link': 'h2.entry-title > a'
            },
            'post': {
                'title': '.entry-header h1.entry-title',
                'content': '.entry-content'
            }
        }
    },
    'gazetadopovo': {
        'url': 'https://www.gazetadopovo.com.br',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.type-default h2.title > a'
            },
            'post': {
                'title': '.c-content-header h1.c-title',
                'content': '.paywall-google'
            }
        }
    },
    'correiodolago': {
        'url': 'http://www.correiodolago.com.br',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.lista-noticias li a'
            },
            'post': {
                'title': 'header h2',
                'content': 'section #texto'
            }
        }
    },
    'sonoticiaboa': {
        'url': 'http://www.sonoticiaboa.com.br',
        'timer': 1000,
        'selectors': {
            'list': {
                'link': '#principais .single_post_dest a, #sustentavel .single_post_dest a, #negocios .single_post_dest a, #tecnologia .single_post_dest a'
            },
            'post': {
                'title': 'h2.entry-title',
                'content': '.entry-content'
            }
        }
    },
    'agenciabrasil': {
        'url': 'http://agenciabrasil.ebc.com.br',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.dest-content > a, .isoGrid-item > a'
            },
            'post': {
                'title': '.newsHeader > h1',
                'content': 'article'
            }
        }
    },
    'aquiagoranet': {
        'url': 'https://aquiagora.net/arquivo',
        'timer': 100,
        'selectors': {
            'list': {
                'link': '.collection > a'
            },
            'post': {
                'title': 'h1.noticia-header',
                'content': '#texto'
            }
        }
    },
};

function craw(site) {

    return new Promise((resolve, reject) => {

        request(sites[site].url, (error, response, body) => {

            if (error != null) {
                reject(error);
            }
            else {

                const $ = cheerio.load(body);
                const pageTitle = $("head > title");
                if (pageTitle.text() === "Error") {
                    reject(new Error("Request failed"));
                }

                resolve(body);
            }
        });
    });
}

function posts(craw, site) {

    let $ = cheerio.load(craw);

    let links = [];

    $(sites[site].selectors.list.link).each((index, element) => {

        //let title = $(this).text()
        let link;

        switch (site) {
            case 'catv':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'yahoo':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'motor1':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'ofuxico':
                link = 'https://www.ofuxico.com.br' + $(element).attr('href');
                break;
            case 'lance':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'tudointeressante':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'gazetadopovo':
                link = $(element).attr('href');

                if (link.search(sites[site].url) < 0) {
                    link = sites[site].url + link;
                }
                break;
            case 'correiodolago':
                link = sites[site].url + $(element).attr('href');
                break;
            case 'agenciabrasil':
                link = $(element).attr('href');

                if (link.search(sites[site].url) < 0) {
                    link = sites[site].url + link;
                }
                break;
            case 'aquiagoranet':
                link = 'https://aquiagora.net' + $(element).attr('href');
                break;
            default:
                link = $(element).attr('href');
        }

        if (link != null) {
            links.push(link);
        }
    });

    return links;
}

async function content(postsUrls, site) {

    const contents = [];

    console.log("postsUrls", postsUrls);

    for (let postUrl of postsUrls) {

        // Cada post é criado um wrapper na requisição http para engloba-la em uma promisa. Essa promisa é adicionada na Pool.
        const promise = new Promise((resolve, reject) => {
            // Isso só é executado quando chamamos Promise.all() (nesse momento todas as requisições são executadas ao mesmo tempo)
            // console.log(post.link)

            const req = {
                url: postUrl
            };

            request.get(req, (error, response, body) => {

                if (error != null) {
                    reject(error);
                }
                else {

                    const $ = cheerio.load(body);

                    const pageTitle = $("head > title");
                    if (pageTitle.text() === "Error") {
                        console.log(body);
                        reject(new Error("Request failed"));
                    }

                    const content = {
                        title: $(sites[site].selectors.post.title).text(),
                        body: $(sites[site].selectors.post.content).text()
                    };

                    // Marcar promisa como concluída.
                    resolve(content);
                }
            });
        });

        try {
            const content = await promise;

            if (content.body != null) {
                contents.push(content);
            }
        }
        catch (e) {
            //do nothing
            console.log("error", e);
        }

        await timer(sites[site].timer);
    }

    // Após todas as requisições concluidas, retornar o conteúdo.
    return contents;
}

module.exports.crawAPI = craw;
module.exports.postsAPI = posts;
module.exports.contentAPI = content;
module.exports.sites = sites;
