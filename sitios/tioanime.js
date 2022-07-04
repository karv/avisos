const Base = require('../src/class/sitio');
const axios = require('axios');

class Sitio extends Base {
    constructor(client){
        super(client, {
            nombre: 'TioAnime', 
            url: 'https://tioanime.com',            
            skip: true
        });
    }
    
    async obtenerEpisodios(){
        const page = await this.client.cargarPagina(this.url);
        const episodios = await page.evaluate(() => {
            return Array
                .from(document.querySelectorAll('article.episode > a'))
                .map(ep => { 
                    return {
                        href: ep.getAttribute('href'),
                        serie: ep.children[1].textContent.match(/(.*)\s\d+$/)[1].trim(),
                        episodio: ep.children[1].textContent.match(/\d+$/)[0].trim(),
                    };
                });
        });

        await page.close();
        this.ultimosEpisodios = episodios;
    }

    async nuevoEpisodio(episodio){
        await axios.post(
            process.env.TIOANIME_WEBHOOK,
            {
                username: this.nombre,
                avatar_url: 'https://i.imgur.com/CaayJhS.jpg',
                content: episodio.href,
            }
        );
    }
}

module.exports = Sitio;