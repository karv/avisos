// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');
const { readdir } = require('fs/promises');

class Client {
    constructor(dir){
        // Directorio en el que se encuentran los sitios a cargar
        this.sitiosDir = dir;
        this.browser = null;
        this.sitios = [];
    }
    
    async iniciar(){
        await this.cargarNavegador();
        await this.cargarSitios(this.sitiosDir);
        await this.iniciarSitios();
    }

    async cargarNavegador(){
        this.browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            headless: true,
            args: ['--no-sandbox','--in-process-gpu']
        });
    }

    async cargarPagina(url){
        try {
            const page = await this.browser.newPage();
        
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
            );
            await page.setExtraHTTPHeaders({ 'Accept-Language': 'es' });
        
            await page.goto(url, { timeout: 0 });
            return page;    
        } 
        catch(err){
            console.error(err);
        }
        
    }

    async cargarSitios(dir){
        const files = await readdir(dir);
        for(const file of files) {
            const Sitio = require(`${dir}/${file}`);
            const sitio = new Sitio(this); 
            
            if(sitio.skip) continue;
            this.sitios.push(sitio);
        }
    }

    async iniciarSitios(){
        for (const sitio of this.sitios){
            await sitio.iniciar();
        }
    }
}

module.exports = Client;