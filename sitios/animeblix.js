const Base = require('../src/class/sitio');
const axios = require('axios');

class Sitio extends Base {
    constructor(client){
        super(client, {
            nombre: 'Animeblix', 
            url: 'https://animeblix.com/',            
            skip: true
        });
    }

    async obtenerEpisodios(){
        const page = await this.client.cargarPagina(this.url);
        const episodios = await page.evaluate(() => {
            return Array
                .from(document.querySelectorAll('.episodeListItem'))
                .map(ep => {
                    return {
                        href: `https://${document.domain}${ep.querySelector('figure > a').getAttribute('href')}`,
                        serie: ep.querySelector('h3 > a').textContent,
                        episodio: ep.querySelector('div.rounded-end').innerText.match(/\d+$/)[0],
                    };
                });

        });

        await page.close();
        this.ultimosEpisodios = episodios;
    }

    async nuevoEpisodio(episodio){
        await axios.post(
            process.env.ANIMEBLIX_WEBHOOK,
            {
                username: this.nombre,
                avatar_url: 'https://i.imgur.com/2BQ3l8X.png',
                content: episodio.href,
            }
        );
    }
}

module.exports = Sitio;