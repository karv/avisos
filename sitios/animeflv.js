const Base = require('../src/class/sitio');
const axios = require('axios');

class Sitio extends Base {
    constructor(client){
        super(client, {
            nombre: 'AnimeFLV', 
            url: 'https://www3.animeflv.net',
            intervalo: 5*60*1000
        });
    }
    
    async obtenerEpisodios(){
        try {
            console.log(`buscando episodios... (${this.nombre})`);
            const page = await this.client.cargarPagina(this.url);
            console.log(page);
            console.log((await test(page)));
            const episodios = await page.evaluate(() => {
                return Array
                    .from(document.querySelectorAll('li .fa-play'))
                    .map(ep => {
                        return {
                            href: `https://${document.domain}${ep.getAttribute('href')}`,
                            serie: ep.children[2].textContent,
                            episodio: ep.children[1].textContent.match(/(\d+)$/)[0]
                        };
                    });
            });        
            console.log(episodios.slice(0,5).map(x => x.href));
            await page.close();
            return episodios;

        }
        catch(err) {
            console.error(err);
        }        
    }

    async nuevoEpisodio(episodio){
        await axios.post(
            process.env.ANIMEFLV_WEBHOOK,
            {
                username: this.nombre,
                avatar_url: 'https://i.imgur.com/guSOHam.png',
                content: episodio.href,
            }
        );
        return;
    }
}

module.exports = Sitio;

async function test(page){    
    const domain = await page.evaluate(() => {
        return document.querySelector('h2').textContent;
    });
    return domain;
}