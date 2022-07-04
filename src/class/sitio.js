const moment = require('moment');

class Sitio {
    constructor(client, info){
        this.client = client;
        this.nombre = info.nombre;
        this.url = info.url;
        this.intervalo = info.intervalo || 5*60*1000;
        this.skip = Boolean(info.skip);        
        this.ultimosEpisodios = [];        
    }

    iniciar(){
        setInterval(this.buscarEpisodios.bind(this), this.intervalo);
        console.log(`${this.nombre} iniciado!`);
    }

    // Busca nuevas episodios en el sitio
    async buscarEpisodios(){
        console.log(`${hora()} | ${this.nombre}`);
        try {
            const anteriores = this.ultimosEpisodios;
            this.ultimosEpisodios = await this.obtenerEpisodios();
            console.log('-'.repeat('32'));
            console.log(anteriores.slice(0,5).map(x => x.serie));
            console.log(this.ultimosEpisodios.slice(0,5).map(x => x.serie));
            
            const episodios = separarUnicos(anteriores, this.ultimosEpisodios);
            if(episodios){
                episodios.reverse();
                console.log(episodios);
                for(const ep of episodios){                    
                    await this.nuevoEpisodio(ep);
                    await sleep(1000);
                }
            }
        }
        catch (err) { 
            console.error(err);
        }
    }

    // Obtiene los ultimos episodios publicados en el sitio
    obtenerEpisodios(){
        throw new Error(`${this.nombre} no tiene un metodo obtenerEpisodios`);
    }

    // Se ejecuta cuando se encuentra un nuevo episodio
    nuevoEpisodio(){
        throw new Error(`${this.nombre} no tiene un metodo nuevoEpisodio`);
    }
}

module.exports = Sitio;

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// Hora actual en Argentina
function hora() {
    return moment().utcOffset('-0300').format('HH:mm');
}

// Wea rara que devuelve los elementos que solo están presentes en el array 2
function separarUnicos(arr1, arr2){
    if(!arr1.length || arr1.length != arr2.length) return null;
    let lista;

    // Array de objetos
    if(typeof arr1[0] == 'object' && typeof arr2[0] == 'object'){
        const keys = new Set(Object.keys(arr1[0]));
        const shared_keys = Object.keys(arr2[0]).filter(x => keys.has(x));

        lista = arr2.reduce((a,b) => {
            for(const key of shared_keys){
                const values = arr1.map(arr => arr[key]);
                if (!values.includes(b[key])) {
                    a.push(b);
                    break;
                }
            }
            return a;
        }, []);
    }
    // Array comun
    else {
        lista = arr2.reduce((a,b) => {
            if (!arr1.includes(b)) a.push(b);
            return a;
        }, []);
    }
    return lista.length ? lista : null;
}