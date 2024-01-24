const fs = require('fs')

const configuraciones = require('./configuraciones/dobladoras.json')
const { calcularMedidasVentana } = require('./componentes/ventana');
const { exit } = require('process');

const maximaLongitud = 244;
function partirPartesMaximaongitud(parte) {

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
            nombre: "v3",
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
}

const dobladora = 'jhul';
const dir_salida = "salida";
const productosCalculados = []

listaProductos.forEach((data, index) => {
    const componenteCalculo = funcionesCalculoMedidas[data.tipo]
    let resultado = componenteCalculo(data.medidas, configuraciones[dobladora])
    let itemsCalculo = resultado['items']
    productosCalculados.push({
        ...data,
        "calculo": itemsCalculo
    })
});

//console.log(JSON.stringify(productosCalculados))

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

        let items = data['calculo']
        for (var attributename in items) {
            let registro = items[attributename]
            texto += (index + 1) + "_" + registro['nombre'] + ","
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

        let items = data['calculo']
        for (var attributename in items) {
            let registro = items[attributename]
            texto += registro['largo'] + ","
            texto += registro['ancho'] + ","
            texto += registro['cantidad'] + ","
            texto += (index + 1) + "_" + registro['nombre'] + ","
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

        let items = data['calculo']
        console.log(JSON.stringify(items))
        for (var attributename in items) {
            contador++;
            let registro = items[attributename]
            texto += contador + "\n"
            texto += (index + 1) + "_" + registro['nombre'] + "\n"
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
