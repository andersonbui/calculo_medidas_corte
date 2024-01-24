const fs = require('fs')
const { listenerCount } = require('process')

var configuraciones = {
    andres : {
        t_macho : 10.7,
        t_hembra : 13.4,
        t_ancha : 16,
        perfil : 16.6,
        _laterales : 15.2,
        _nave_corredera : 15.2,
        _inf_nave_macho : 9,
        _inf_nave_hembra : 7.1,
        riel_superior : 20.7,
        riel_inferior_macho : 6.4,
        riel_inferior_hembra : 12,
        _doblado_superior_inferior : 3,
        _doblado_ancho_tubo : 3
    },
    tino : {
        perfil : 16.6,
        _laterales : 15.2,
        t_macho : 10.7,
        t_hembra : 13.4,
        t_ancha : 16,
        _nave_corredera : 15.2,
        _inf_nave_macho : 9,
        _inf_nave_hembra : 7.1,
        riel_superior : 20.7,
        riel_inferior_macho : 6.4,
        riel_inferior_hembra : 12,
        _doblado_superior_inferior : 3,
        _doblado_ancho_tubo : 3
    },
    jhul : {
        perfil : 16.6,
        _laterales : 17.8,
        t_macho : 10.7,
        t_hembra : 15,
        t_ancha : 16.7,
        _nave_corredera : 14.6,
        _inf_nave_macho : 9,
        _inf_nave_hembra : 6.9,
        riel_superior : 21.1,
        riel_inferior_macho : 8.3,
        riel_inferior_hembra : 10,
        _doblado_superior_inferior : 3,
        _doblado_ancho_tubo : 3
    }
}


var calcularMedidasVentana = function(data, config) {
    let respuesta = {}
    respuesta = Object.assign({},respuesta,calcularRielSuperior(data, config))
    respuesta = Object.assign({},respuesta,calcularRielInferior(data, config))
    respuesta = Object.assign({},respuesta,calcularLaterales(data, config))
    cantidadhuecos = data['cantidadhuecos']
    if(!cantidadhuecos) {
        cantidadhuecos = calcularNumeroHuecos(data, config)
    }
    data['cantidadhuecos'] = cantidadhuecos
    
    respuesta = Object.assign({},respuesta,horizontalesNave(data, config))
    respuesta = Object.assign({},respuesta,verticalesNave(data, config))
    respuesta = Object.assign({},respuesta,tubos(data, config))

    respuesta = {"cantidadhuecos": cantidadhuecos, "items": respuesta}

    return respuesta
}

let tubos = function(data, config) {
    let t_hembra = config['t_hembra']
    let t_macho = config['t_macho']
    let t_ancha_macho = config['t_ancha']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    let largo = data['alto'] - 2*_doblado_superior_inferior;

    let cantidadTubos = data['cantidadhuecos'] - 1
    // calculo numero tubos anchos
    let numTubosAnchos = parseInt((data['cantidadhuecos'] - 1) / 2)
    let numTubosAngosto =  cantidadTubos - numTubosAnchos
    return {
        tuboTAnchoMacho:{
            largo: largo,
            ancho: t_ancha_macho,
            cantidad: numTubosAnchos,
            nombre: "Tubo Ancho Macho"
        },
        tuboTHembra:{
            largo: largo,
            ancho: t_hembra,
            cantidad: cantidadTubos,
            nombre: "Tubo Hembra"
        },
        tuboTAngostoMacho:{
            largo: largo,
            ancho: t_macho,
            cantidad: numTubosAngosto,
            nombre: "Tubo Angosto Macho"
        }
    }
}

let calcularLaterales = function(data, config) {
    let _laterales = config['_laterales']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    let largo = data['alto'] - 2*_doblado_superior_inferior;

    return {
        laterales:{
            largo: largo,
            ancho: _laterales,
            cantidad: 2,
            nombre: "Laterales"
        }
    }
}

let horizontalesNave = function(data, config) {
    ancho = data['ancho']
    alto = data['alto']
    id = data['id']
    let anchoNave = calcularAnchoNave(data, config)
    let _nave_corredera = config['_nave_corredera']
    let _inf_nave_macho = config['_inf_nave_macho']
    let _inf_nave_hembra = config['_inf_nave_hembra']
    return {
        "naveInferiorHembra": {
            largo: _inf_nave_hembra,
            ancho: anchoNave,
            cantidad: 1,
            nombre: "Nave Inferior Hembra"
        },
        "naveInferiorMacho": {
            largo: _inf_nave_macho,
            ancho: anchoNave,
            cantidad: 1,
            nombre: "Nave Inferior Macho"
        },
        "naveSuperior": {
            largo: _nave_corredera,
            ancho: anchoNave,
            cantidad: 1,
            nombre: "Nave Superior"
        }
    }
}

let calcularAnchoNave = function(data, config){
    ancho = data['ancho']
    cantidadhuecos = data['cantidadhuecos']
    let _doblado_ancho_tubo = config['_doblado_ancho_tubo']
    let anchoNave = ((ancho - _doblado_ancho_tubo) / cantidadhuecos) ;
    return anchoNave
}

let verticalesNave = function(data, config) {
    ancho = data['ancho']
    alto = data['alto']
    let _doblado_superior_inferior = config['_doblado_superior_inferior']
    let _laterales = config['_laterales']
    let altoNave = alto - 1 - 2*_doblado_superior_inferior;
    let cantidadLaterales = 2
    return {
        naveLaterales: {
            largo: altoNave,
            ancho: _laterales,
            cantidad: cantidadLaterales,
            nombre: "Nave Verticales"
        }
    }
}

let calcularRielSuperior = function(data, config) {
    let riel_superior = config['riel_superior']
    alto = riel_superior
    ancho = data['ancho']
    return {
        rielSuperior: {
            largo: alto,
            ancho: ancho,
            cantidad: 1,
            nombre: "Riel Superior"
        }
    }
}

let calcularRielInferior = function(data, config) {
    ancho = data['ancho']
    let riel_inferior_macho = config['riel_inferior_macho']
    let riel_inferior_hembra = config['riel_inferior_hembra']
    return {
        rielInferiorHembra: {
            largo: riel_inferior_hembra,
            ancho: ancho,
            cantidad: 1,
            nombre: "Riel Inferior Hembra"
        },
        rielInferiorMacho: {
            largo: riel_inferior_macho,
            ancho: ancho,
            cantidad: 1,
            nombre: "Riel Inferior Macho"
        }
    }
}

let calcularNumeroHuecos = function(data) {
    let ancho = data['ancho']
    let alto = data['alto']
    let cantidad = 2;
    let anchoNave = ancho / cantidad;
    while( anchoNave > alto / 2 ) {
        cantidad++;
        anchoNave = ancho / cantidad;
    } 

    return cantidad
}

listadata = [{
    alto: 152,
    ancho: 78,
    cantidadhuecos: 1
},{
    alto: 152,
    ancho: 24,
    cantidadhuecos: 1
},{
    alto: 152,
    ancho: 283,
    cantidadhuecos: 4
},{
    alto: 152,
    ancho: 80,
    cantidadhuecos: 2
}]

function guardarEnArchivo(filename, cadenatexto){
    fs.writeFile(filename, cadenatexto,
    {
        encoding: "utf8",
        flag: "w",
        mode: 0o666
    },
    (err) => {
        if (err)
        console.log(err);
        else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync(filename, "utf8"));
        }
    });
}

function cutterFormat(listadata, config) {
    let texto = "name,quantity,width,height,canRotate\n"
    listadata.forEach((data, index) => {
  
        // console.log("ancho: "+JSON.stringify(calcularMedidasVentana(data, config), null,2))
        let resultado = calcularMedidasVentana(data, config)
    
        let items = resultado['items']
        for(var attributename in items) {
            let registro = items[attributename]
            texto += (index + 1)+"_"+registro['nombre']+","
            texto += registro['cantidad']+","
            texto += registro['largo']+","
            texto += registro['ancho']+","
            texto += "true"
            texto += "\n"
        }
    
    
    });
    return texto;
}

function cutlistoptimizerFormat(listadata, config) {
    let texto = "Length,Width,Qty,Label,Enabled\n"
    listadata.forEach((data, index) => {

        let resultado = calcularMedidasVentana(data, config)
    
        let items = resultado['items']
        for(var attributename in items) {
            let registro = items[attributename]
            texto += registro['largo']+","
            texto += registro['ancho']+","
            texto += registro['cantidad']+","
            texto += (index + 1)+"_"+registro['nombre']+","
            texto += "true"
            texto += "\n"
        }
    });
    return texto;
}

function optCutFormat(listadata, config) {
    let texto = "";
    let contador = 0;
    listadata.forEach((data, index) => {
  
        // console.log("ancho: "+JSON.stringify(calcularMedidasVentana(data, config), null,2))
        let resultado = calcularMedidasVentana(data, config)
    
        let items = resultado['items']
        for(var attributename in items) {
            contador++;
            let registro = items[attributename]
            texto += contador+"\n"
            texto += (index + 1)+"_"+registro['nombre']+"\n"
            texto += "30 PXG\n"
            texto += registro['cantidad']+"\n"
            texto += Math.round(registro['largo']*10)+"\n"
            texto += Math.round(registro['ancho']*10)+"\n"
            texto += "\n"
            texto += "\n"
            texto += "\n";
        }
    
    
    });
    texto = "21\n"+contador+"\n9\n\n\n0\n\n" + texto;
    return texto;
}

const listFormatos = [
    {
        funcion: optCutFormat,
        resultname: "opcut.ord"
    },
    {
        funcion: cutlistoptimizerFormat,
        resultname: "cutlistoptimizer.csv"
    },
    {
        funcion: cutterFormat,
        resultname: "items.csv"
    }
]

const dobladora = 'jhul';
const dir_salida = "salida";

listFormatos.forEach((itemFuncion)=>{
    console.log(itemFuncion)
    let result = itemFuncion.funcion(listadata, configuraciones[dobladora]);
    guardarEnArchivo(dir_salida+"/"+itemFuncion.resultname, result);
})
