let calcularMedidasVentana = function(data, config) {
    let medidas = data['medidas']
    let respuesta = {}
    respuesta = {...respuesta, ...calcularRielSuperior(medidas, config)}
    respuesta = Object.assign({},respuesta,calcularRielInferior(medidas, config))
    respuesta = Object.assign({},respuesta,calcularLaterales(medidas, config))
    let cantidadhuecos = medidas['cantidadhuecos']
    if(!cantidadhuecos) {
        cantidadhuecos = calcularNumeroHuecos(medidas, config)
    }
    medidas['cantidadhuecos'] = cantidadhuecos
    
    respuesta = Object.assign({},respuesta,horizontalesNave(medidas, config))
    respuesta = Object.assign({},respuesta,verticalesNave(medidas, config))
    respuesta = Object.assign({},respuesta,tubos(medidas, config))

    respuesta = {"cantidadhuecos": cantidadhuecos, "partes": respuesta}

    return respuesta
}

let tubos = function(medidas, config) {
    let t_hembra = config['t_hembra']
    let t_macho = config['t_macho']
    let t_ancha_macho = config['t_ancha']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    let largo = medidas['alto'] - 2*_doblado_superior_inferior;

    let cantidadTubos = medidas['cantidadhuecos'] - 1
    // calculo numero tubos anchos
    let numTubosAnchos = parseInt((medidas['cantidadhuecos'] - 1) / 2)
    let numTubosAngosto =  cantidadTubos - numTubosAnchos
    return {
        ...(numTubosAnchos>0 && {
            tuboTAnchoMacho:{
                largo: largo,
                ancho: t_ancha_macho,
                cantidad: numTubosAnchos,
                nombre: "Tubo Ancho Macho"
            }
        }),
        ...(cantidadTubos>0 && {
                tuboTHembra: {
                    largo: largo,
                    ancho: t_hembra,
                    cantidad: cantidadTubos,
                    nombre: "Tubo Hembra"
                }
            }
        ),
        ...(numTubosAngosto>0 && {
                tuboTAngostoMacho:{
                    largo: largo,
                    ancho: t_macho,
                    cantidad: numTubosAngosto,
                    nombre: "Tubo Angosto Macho"
                }
            }
        )
    }
}

let calcularLaterales = function(medidas, config) {
    let _laterales = config['_laterales']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    let largo = medidas['alto'] - 2*_doblado_superior_inferior;

    return {
        laterales:{
            largo: largo,
            ancho: _laterales,
            cantidad: 2,
            nombre: "Laterales"
        }
    }
}

let horizontalesNave = function(medidas, config) {
    let anchoNave = calcularAnchoNave(medidas, config)
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

let calcularAnchoNave = function(medidas, config){
    let ancho = medidas['ancho']
    let cantidadhuecos = medidas['cantidadhuecos']
    let _doblado_ancho_tubo = config['_doblado_ancho_tubo']
    let anchoNave = ((ancho - _doblado_ancho_tubo) / cantidadhuecos) ;
    return anchoNave
}

let verticalesNave = function(medidas, config) {
    let alto = medidas['alto']
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

let calcularRielSuperior = function(medidas, config) {
    let riel_superior = config['riel_superior']
    let alto = riel_superior
    let ancho = medidas['ancho']
    return {
        rielSuperior: {
            largo: alto,
            ancho: ancho,
            cantidad: 1,
            nombre: "Riel Superior"
        }
    }
}

let calcularRielInferior = function(medidas, config) {
    ancho = medidas['ancho']
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

let calcularNumeroHuecos = function(medidas, config) {
    let ancho = medidas['ancho']
    let alto = medidas['alto']
    let cantidad = 2;
    let anchoNave = ancho / cantidad;
    while( anchoNave > alto / 2 ) {
        cantidad++;
        anchoNave = ancho / cantidad;
    } 

    return cantidad
}

module.exports = {
    calcularMedidasVentana,
    calcularNumeroHuecos,
    calcularRielInferior,
    calcularRielSuperior,
    calcularAnchoNave,
    horizontalesNave,
    verticalesNave,
    tubos
}