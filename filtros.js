var male = true;
var female = true;
var edge = true; //15 a 29
var vibe = true; //30 a 
var one = true;
var sexos = [];
var edades = ["jovenes", "adultos", "mayores"];

//nuevas variables

var params = {
    "mayor_hombre": false,
    "mayor_mujer": false,
    "adulto_hombre": false,
    "adulto_mujer": false,
    "joven_hombre": false,
    "joven_mujer": false,
}
//fin nuevas variables



male ? sexos.push("Hombre") : "";
female ? sexos.push("Mujer") : "";

var edades = [];

edge ? edades.push('jovenes') : '';
vibe ? edades.push('adultos') : '';
one ? edades.push('mayores') : '';

var respuesta = [0];
var numero = 40;
var req = { sexos: sexos, edades: edades, respuesta: respuesta, numero: numero };

function click_filtro(command) {



    if (this.id == "todo_hombres") {


        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }

            let selected = params["mayor_hombre"] && params["adulto_hombre"] && params["joven_hombre"];

            let opacity = (!selected) ? 1: 0.7;

            params["mayor_hombre"] = !selected;
            params["adulto_hombre"] = !selected;
            params["joven_hombre"] = !selected;

            d3.select("#mayor_hombre").style("fill-opacity", opacity)
            d3.select("#adulto_hombre").style("fill-opacity", opacity)
            d3.select("#joven_hombre").style("fill-opacity", opacity)


    } else if (this.id == "todo_mujeres") {

        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }


        let selected = params["mayor_mujer"] && params["adulto_mujer"] && params["joven_mujer"]
            
        let opacity = (!selected) ? 1: 0.7;
            
        params["mayor_mujer"] = !selected,
        params["adulto_mujer"] = !selected,
        params["joven_mujer"] = !selected;

        d3.select("#mayor_mujer").style("fill-opacity", opacity)
        d3.select("#adulto_mujer").style("fill-opacity", opacity)
        d3.select("#joven_mujer").style("fill-opacity", opacity)
        
    } else if (this.id == "todo_jovenes") {
        
        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }



        let selected = params["joven_hombre"] && params["joven_mujer"]
        
        let opacity = (!selected) ? 1: 0.7;

        params["joven_hombre"] = !selected,
        params["joven_mujer"] = !selected;

        d3.select("#joven_hombre").style("fill-opacity", opacity)
        d3.select("#joven_mujer").style("fill-opacity", opacity)
        //volver para abajo
    } else if (this.id == "todo_adultos") {

        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }


        let selected = params["adulto_hombre"] && params["adulto_mujer"]
            
        let opacity = (!selected) ? 1: 0.7;

        params["adulto_hombre"] = !selected,
        params["adulto_mujer"] = !selected;

        d3.select("#adulto_hombre").style("fill-opacity", opacity)
        d3.select("#adulto_mujer").style("fill-opacity", opacity)

    } else if (this.id == "todo_mayores") {
        
        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }
        
        let selected = params["mayor_hombre"] && params["mayor_mujer"]

        let opacity = (!selected) ? 1: 0.7;

        params["mayor_hombre"] = !selected,
        params["mayor_mujer"] = !selected;

        d3.select("#mayor_hombre").style("fill-opacity", 1)
        d3.select("#mayor_mujer").style("fill-opacity", 1)

    } else if (command == "restart") {
        
        for(key in params){
            if (params[key]){
                
                params[key] = false
                d3.select("#" + key).style("fill-opacity", 0.7)

            }
        }

        d3.select("#mayor_hombre").style("fill-opacity", 0.7)
        d3.select("#mayor_mujer").style("fill-opacity", 0.7)
        d3.select("#adulto_hombre").style("fill-opacity", 0.7)
        d3.select("#adulto_mujer").style("fill-opacity", 0.7)
        d3.select("#joven_hombre").style("fill-opacity", 0.7)
        d3.select("#joven_mujer").style("fill-opacity", 0.7)
        d3.select("#todo_hombres").style("fill-opacity", 0.7)
        d3.select("#todo_mujeres").style("fill-opacity", 0.7)
        d3.select("#todo_adultos").style("fill-opacity", 0.7)
        d3.select("#todo_mayores").style("fill-opacity", 0.7)
        d3.select("#todo_jovenes").style("fill-opacity", 0.7)
    } 

    else {


        let [edad,sexo] = this.id.split("_")

        for(key in params){
            if (params[key]){
                
                let [edadInner,sexoInner] = key.split("_")

                if (edadInner != edad && sexoInner != sexo){
                    params[key] = false
                    d3.select("#" + key).style("fill-opacity", 0.7)
                }

            }
        }


        params[this.id] = !params[this.id];
        d3.select("#" + this.id).style("fill-opacity", params[this.id] ? 1 : 0.7)
    }

    //todito_hide
    document.getElementById('loading_filter').style.visibility = "visible";
    document.getElementById('todito_para_hide').style.opacity = 0.1;

    sexos = [];
    edades = [];
    if (params["adulto_hombre"] || params["joven_hombre"] || params["mayor_hombre"]) {
        sexos.push("Hombre");
    }

    if (params["joven_mujer"] || params["adulto_mujer"] || params["mayor_mujer"]) {
        sexos.push("Mujer");
    }

    if (params["joven_hombre"] || params["joven_mujer"]) {
        edades.push("jovenes");
    }

    if (params["adulto_hombre"] || params["adulto_mujer"]) {
        edades.push("adultos");
    }

    if (params["mayor_hombre"] || params["mayor_mujer"]) {
        edades.push("mayores");
    }

    if (!params["mayor_hombre"] && !params["mayor_mujer"] && !params["adulto_hombre"] && !params["adulto_mujer"] && !params["joven_hombre"] && !params["joven_mujer"]) {
        edades.push("adultos");
        edades.push("mayores");
        edades.push("jovenes");
        sexos.push("Mujer");
        sexos.push("Hombre");
    }


    let x = (arr) => arr.filter((v, i) => arr.indexOf(v) === i)
    
    
    req = { sexos: sexos, edades: edades, respuesta: respuesta, numero: numero };

    //respuesta = [0];
    numero = 40;
    corregimientos = ["Corregimientos", "4) Aranjuez", "16) Belén", "15) Guayabal", "NaN", "11) Laureles-Estadio", "12) La América", "5) Castilla", "7) Robledo", "6) Doce de Octubre", "13) San Javier", "1) Popular", "9) Buenos Aires", "3) Manrique", "2) Santa Cruz", "8) Villa Hermosa", "10) La Candelaria", "14) El Poblado", "otros"];

    var terminadas = 0;

    // postData(urlBack+'histograma_ods', req).then(data => {

    //     dibujar_burbujas(data, odss_res);
    //     terminadas ++; 
    //     if(terminadas == 3){
    //         document.getElementById('loading_filter').style.visibility = "hidden";
    //         d3.select("#todito_para_hide").style("fill-opacity", 1).style("cursor", "pointer");
    //     }
    // });
    var req_sun_inic = {... req};
    req_sun_inic.respuesta = [0];
    postData(urlBack+'sunburst', req).then(data => {
        data.name = "ODS";
        dibujar_sunburst(data);
        terminadas++;
        if (terminadas == 2) {
            document.getElementById('loading_filter').style.visibility = "hidden";
            document.getElementById('todito_para_hide').style.opacity = 1;
        }
    });
    req_mapa = { ...req };
    req_mapa.numero = 400;
    req_mapa.respuesta = [0];
    postData(urlBack+'odsComuna', req_mapa).then(data => {
        dibujar_mapita(data);
        
        cambiar_de_comuna(comuna_act);
        terminadas++;
        if (terminadas == 2) {
            document.getElementById('loading_filter').style.visibility = "hidden";
            document.getElementById('todito_para_hide').style.opacity = 1;
        }
    });
    var req_donout = { ...req };
    req_donout.respuesta = [0];
    postData(urlBack+'openQuestions', req_donout)
	.then(function (data) {
        donoutsData = data;
		action(data[index]);
	})

}





d3.select("#mayor_hombre").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#mayor_mujer").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#adulto_hombre").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#adulto_mujer").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#joven_hombre").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#joven_mujer").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#todo_hombres").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#todo_mujeres").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#todo_adultos").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#todo_mayores").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)
d3.select("#todo_jovenes").on("click", click_filtro).style("cursor", "pointer").style("fill-opacity", 0.7)


function postData(url = '', data) {
    // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => response.json()
        );

}

d3.select("#resetFil").on('click', d => click_filtro("restart"))

