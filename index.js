const fs = require('fs')

const configuraciones = require('./configuraciones/dobladoras.json')
const { calcularMedidasVentana } = require('./componentes/ventana');
const { calcularMedidasVentanaLuceta } = require('./componentes/ventana_luceta');
const { exit } = require('process');

const maximaLongitudDim = 244;
function dividirMaximaLongitudDim(lista_parte) {

    for ( let indice_parte in lista_parte) {
        let parte = lista_parte[indice_parte]
        let dimensiones = ['alto','ancho']
        dimensiones.forEach(dimension => {
            let dim = parte[dimension] / maximaLongitudDim
            if(dim > 1) {
                let nuevaParte = {
                    ...parte
                }
                nuevaParte[dimension] = parte[dimension] - maximaLongitudDim
                nuevaParte["nombre"] = parte["nombre"] + " " + parseInt(dim+1)
                parte[dimension] = maximaLongitudDim
                lista_parte[indice_parte + "_" + parseInt(dim)] = nuevaParte
            }
        })
    }
    return lista_parte
}

var listaProductos = [
    {
        nombre: "v1",
        tipo: "ventana",
        medidas: {
            alto: 152,
            ancho: 78,
            cantidadhuecos: 1
        }
    }, {
        nombre: "v2",
        tipo: "ventana",
        medidas: {
            alto: 152,
            ancho: 24,
            cantidadhuecos: 1
        }
    }, {
        nombre: "v3",
        tipo: "ventana",
        medidas: {
            alto: 152,
            ancho: 283,
            cantidadhuecos: 4
        }
    }, {
        nombre: "v4",
        tipo: "ventana",
        medidas: {
            alto: 152,
            ancho: 80,
            cantidadhuecos: 2
        }
    }, {
        nombre: "L2",
        tipo: "ventana_luceta",
        medidas: {
            alto: 39,
            ancho: 283,
            cantidadhuecos: 4
        }
    }, {
        nombre: "L4",
        tipo: "ventana_luceta",
        medidas: {
            alto: 38,
            ancho: 283,
            cantidadhuecos: 4
        }
    }, {
        nombre: "L1",
        tipo: "ventana_luceta",
        medidas: {
            izquierdo: 34,
            derecho: 30,
            ancho: 78,
            cantidadhuecos: 1
        }
    }, {
        nombre: "L3",
        tipo: "ventana_luceta",
        medidas: {
            izquierdo: 33,
            derecho: 29,
            ancho: 80,
            cantidadhuecos: 1
        }
    }, {
        nombre: "T1",
        tipo: "crudo",
        partes: {
            "tubo1":{
                "largo":152,
                "ancho":24,
                "cantidad":2,
                "nombre":"Tubo t1"
            },
        }
    }, {
        nombre: "T2",
        tipo: "crudo",
        partes: {
            "tubo2":{
                "largo":152,
                "ancho":26,
                "cantidad":2,
                "nombre":"Tubo t2"
            },
        }
    }, {
        nombre: "T3",
        tipo: "crudo",
        partes: {
            "tubo3":{
                "largo":152,
                "ancho":35.5,
                "cantidad":1,
                "nombre":"Tubo t3"
            },
        }
    }
]

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

const funcionesCalculoMedidas = {
    ventana: calcularMedidasVentana,
    ventana_luceta: calcularMedidasVentanaLuceta,
    crudo: function(data, config) {
        return data
    }
}

const dobladora = 'jhul';
const dir_salida = "salida";
const productosCalculados = []

listaProductos.forEach((data, index) => {
    const componenteCalculo = funcionesCalculoMedidas[data.tipo]
    let resultado = componenteCalculo(data, configuraciones[dobladora])
    let calculoPartes = resultado['partes']

    calculoPartes = dividirMaximaLongitudDim(calculoPartes)

    productosCalculados.push({
        ...data,
        "partes": calculoPartes
    })
});


function guardarEnArchivo(filename, cadenatexto) {
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
                console.log("File written successfully:", filename);
                fs.readFileSync(filename, "utf8");
            }
        });
}

function cutterFormat(productosCalculados, config) {
    let texto = "name,quantity,width,height,canRotate\n"
    productosCalculados.forEach((data, index) => {

        let partes = data['partes']
        for (var attributename in partes) {
            let registro = partes[attributename]
            texto += data['nombre'] + "_" + registro['nombre'] + ","
            texto += registro['cantidad'] + ","
            texto += registro['largo'] + ","
            texto += registro['ancho'] + ","
            texto += "true"
            texto += "\n"
        }


    });
    return texto;
}

function cutlistoptimizerFormat(productosCalculados, config) {
    let texto = "Length,Width,Qty,Label,Enabled\n"
    productosCalculados.forEach((data, index) => {

        let partes = data['partes']
        for (var attributename in partes) {
            let registro = partes[attributename]
            texto += registro['largo'] + ","
            texto += registro['ancho'] + ","
            texto += registro['cantidad'] + ","
            texto += data['nombre'] + "_" + registro['nombre'] + ","
            texto += "true"
            texto += "\n"
        }
    });
    return texto;
}

function optCutFormat(productosCalculados, config) {
    let texto = "";
    let contador = 0;
    productosCalculados.forEach((data, index) => {

        let partes = data['partes']
        //console.log(JSON.stringify(partes))
        for (var attributename in partes) {
            contador++;
            let registro = partes[attributename]
            texto += contador + "\n"
            texto += data['nombre'] + "_" + registro['nombre'] + "\n"
            texto += "30 PXG\n"
            texto += registro['cantidad'] + "\n"
            texto += Math.round(registro['largo'] * 10) + "\n"
            texto += Math.round(registro['ancho'] * 10) + "\n"
            texto += "\n"
            texto += "\n"
            texto += "\n";
        }
    });
    texto = "21\n" + contador + "\n9\n\n\n0\n\n" + texto;
    return texto;
}

listFormatos.forEach((formatoFuncion) => {
    console.log(formatoFuncion)
    let result = formatoFuncion.funcion(productosCalculados, configuraciones[dobladora]);
    guardarEnArchivo(dir_salida + "/" + formatoFuncion.resultname, result);
})
