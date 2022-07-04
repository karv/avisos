const Base = require('../src/class/sitio');
const axios = require('axios');

class Sitio extends Base {
    constructor(client){
        super(client, {
            nombre: 'AnimeFénix', 
            url: 'https://www.animefenix.com',            
            skip: true
        });
    }
    
    async obtenerEpisodios(){
        const page = await this.client.cargarPagina(this.url);
        const episodios = await page.evaluate(() => {
            return Array
                .from(document.querySelectorAll('.capitulos-grid > .item a'))
                .map(ep => { 
                    return {
                        href: ep.getAttribute('href'),                            
                        serie: ep.getAttribute('title').match(/(.*)\s[\d.]+$/)[1].trim(),
                        episodio: ep.getAttribute('title').match(/\d+$/)[0].trim(),
                    };
                });
        });

        await page.close();
        this.ultimosEpisodios = episodios;
    }
    
    async nuevoEpisodio(episodio){
        await axios.post(
            process.env.ANIMEFENIX_WEBHOOK,
            {
                username: this.nombre,
                avatar_url: 'https://i.imgur.com/TFLwQVi.jpg',
                content: episodio.href,
            }
        );
    }
}

module.exports = Sitio;