let calcularMedidasVentanaLuceta = function(data, config) {
    let medidas = data['medidas']
    let respuesta = {}
    respuesta = {...respuesta, ...calcularLaterales(medidas, config)}
    respuesta = {...respuesta, ...calcularSupInf(medidas, config)}
    let cantidadhuecos = medidas['cantidadhuecos']
    if(!cantidadhuecos) {
        cantidadhuecos = calcularNumeroHuecos(medidas, config)
    }
    medidas['cantidadhuecos'] = cantidadhuecos
    respuesta = {...respuesta, ...tubos(medidas, config)}

    respuesta = {"cantidadhuecos": cantidadhuecos, "partes": respuesta}

    return respuesta
}

let tubos = function(medidas, config) {
    let t_hembra = config['t_hembra']
    let t_ancha_macho = config['t_ancha']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    let largo = medidas['alto'] - 2*_doblado_superior_inferior;

    let cantidadTubos = medidas['cantidadhuecos'] - 1;
    if (cantidadTubos < 1) {
        return {}
    }
    return {
        tuboTAnchoMacho:{
            largo: largo,
            ancho: t_ancha_macho,
            cantidad: cantidadTubos,
            nombre: "Tubo Ancho Macho"
        },
        tuboTHembra:{
            largo: largo,
            ancho: t_hembra,
            cantidad: cantidadTubos,
            nombre: "Tubo Hembra"
        }
    }
}

let calcularLaterales = function(medidas, config) {

    let _laterales = config['_laterales']
    let izquierdo = medidas['alto'] || medidas['izquierdo']
    let derecho = medidas['alto'] || medidas['derecho']
    let _doblado_superior_inferior = config['_doblado_superior_inferior'];
    izquierdo = izquierdo - 2*_doblado_superior_inferior;
    derecho = derecho - 2*_doblado_superior_inferior;
    if(izquierdo == derecho ) {
        return {
            laterales: {
                largo: izquierdo,
                ancho: _laterales,
                cantidad: 2,
                nombre: "Laterales"
            }
        }
    }
    return {
        izquierdo:{
            largo: izquierdo,
            ancho: _laterales,
            cantidad: 1,
            nombre: "izquierdo"
        },
        derecho:{
            largo: derecho,
            ancho: _laterales,
            cantidad: 1,
            nombre: "derecho"
        }
    }
}

let calcularSupInf = function(medidas, config) {
    let superior = medidas['ancho'] || medidas['superior']
    let inferior = medidas['ancho'] || medidas['inferior']
    
    let long_sup_inf = config['_laterales']
    if(superior == inferior ) {
        return {
            superior_inferior: {
                largo: long_sup_inf,
                ancho: superior,
                cantidad: 2,
                nombre: "SuperiorInferior"
            }
        }
    }
    return {
        rielSuperior: {
            largo: long_sup_inf,
            ancho: superior,
            cantidad: 1,
            nombre: "Riel Superior"
        },
        rielInferior: {
            largo: long_sup_inf,
            ancho: inferior,
            cantidad: 1,
            nombre: "Riel Inferior"
        },
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
    calcularMedidasVentanaLuceta
}