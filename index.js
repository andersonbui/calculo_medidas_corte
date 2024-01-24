const fs = require('fs')

const configuraciones = require('./configuraciones/dobladoras.json')
const { calcularMedidasVentana } = require('./componentes/ventana')

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
