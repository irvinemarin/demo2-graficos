// Defaults
Chart.defaults.global.defaultFontColor = '#fff'
Chart.defaults.global.elements.line.borderWidth = 1
Chart.defaults.global.elements.rectangle.borderWidth = 1
Chart.defaults.scale.gridLines.color = '#444'
Chart.defaults.scale.ticks.display = false


fetch('http://localhost:4000/api/getListadoComponenteResumen', {
    method: 'get', headers: new Headers({
        'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
        'Content-Type': 'application/json'
    })
})
    .then(response => response.json())
    .then(data => printCharts(data))


function printCharts(coasters) {

    document.body.classList.add('running')

    compareRadialChart(coasters, 'chart2')
    modelDoughnutChart(coasters, 'chart4')
    heightRadarChart(coasters, 'chart3')
    GForceBarsChart(coasters, 'chart5')
    countriesRadarChart(coasters, 'chart1')
    yearsBarChart(coasters, 'chart6')
    grupobar(coasters, 'chart7')

}


function compareRadialChart(coasters, id) {
    let dataCount = []
    let datasetsDynamic = []
    let labelsDynamic = []
    coasters.forEach(element => {
        dataCount[element["recurso"]] = (dataCount[element["recurso"]] || 0) + 1;
    });
    Object.values(dataCount).forEach((value, index) => {
        datasetsDynamic.push(value)
        labelsDynamic.push(Object.keys(dataCount)[index])
    });


    const data = {
        labels: labelsDynamic, datasets: [{
            data: datasetsDynamic,
            borderWidth: 2,
            borderColor: styles.color.solids.map(eachColor => eachColor),
            backgroundColor: styles.color.alphas.map(eachColor => eachColor)
        }]
    }

    const options = {
        legend: {
            position: 'right'
        }
    }

    new Chart(id, {type: 'polarArea', data, options})
}


function modelDoughnutChart(coasters, id) {

    const data = {
        labels: ['Propulsada', 'Hiper montaña', 'Giga montaña', 'Inversión', 'Sentado'], datasets: [{
            data: [coasters.filter(eachCoaster => eachCoaster.model === 'Accelerator Coaster').length, coasters.filter(eachCoaster => eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.model === 'Giga Coaster').length, coasters.filter(eachCoaster => eachCoaster.model === 'Multi Inversion Coaster').length, coasters.filter(eachCoaster => eachCoaster.model === 'Sitting Coaster').length],
            borderColor: styles.color.solids.map(eachColor => eachColor),
            backgroundColor: styles.color.alphas.map(eachColor => eachColor),
            borderWidth: 1
        }]
    }

    const options = {
        legend: {
            position: 'right'
        }
    }

    new Chart(id, {type: 'doughnut', data, options})
}


function heightRadarChart(coasters, id) {

    const selectedCoasters = coasters.filter(eachCoaster => eachCoaster.height > 80)

    const data = {
        labels: selectedCoasters.map(eachCoaster => eachCoaster.name), datasets: [{
            label: 'Altura',
            data: selectedCoasters.map(eachCoaster => eachCoaster.height),
            borderColor: styles.color.solids[0],
            borderWidth: 1
        }]
    }

    const options = {
        legend: {
            display: false
        }
    }

    new Chart(id, {type: 'radar', data, options})
}


function GForceBarsChart(coasters, id) {

    const selectedCoasters = coasters.filter(eachCoaster => eachCoaster.gForce)

    const data = {
        labels: selectedCoasters.map(eachCoaster => eachCoaster.name), datasets: [{
            data: selectedCoasters.map(eachCoaster => eachCoaster.gForce),
            backgroundColor: styles.color.alphas,
            borderColor: styles.color.solids
        }]
    }

    const options = {
        legend: {
            display: false
        }, scales: {
            yAxes: [{
                gridLines: {
                    display: false
                }, ticks: {
                    display: true
                }
            }]
        }
    }

    new Chart(id, {type: 'bar', data, options})

}


function countriesRadarChart(dataDB, id) {

    const selectedDataDB = dataDB.filter(eachCoaster => eachCoaster.ponente)

    let dataCount = []
    let datasetsDynamic = []
    let labelsDynamic = []


    dataDB.forEach(element => {
        dataCount[element["mes"]] = (dataCount[element["mes"]] || 0) + 1;
    });

    // console.table(dataCount)


    Object.values(dataCount).forEach((valueNumber, index) => {

        labelsDynamic.push(Object.keys(dataCount)[index])
        let item = {
            label: getNombreMes(Object.keys(dataCount)[index]),
            data: valueNumber,
            borderColor: styles.color.solids[index],
            backgroundColor: styles.color.alphas[index]
        }

        datasetsDynamic.push(item)
    });

    function getNombreMes(elementElement) {
        let nombreMes = ""
        switch (elementElement) {
            case "1":
                nombreMes = "Enero"
                break;
            case "2":
                nombreMes = "Febrero"
                break;
            case "3":
                nombreMes = "Marzo"
                break;
            case "4":
                nombreMes = "Abril"
                break;
            case "5":
                nombreMes = "Mayo"
                break;
            case "6":
                nombreMes = "Junio"
                break;
            case "7":
                nombreMes = "Julio"
                break;
            case "8":
                nombreMes = "Agosto"
                break;
            case "9":
                nombreMes = "Setiembre"
                break;
            case "10":
                nombreMes = "Octubre"
                break;
            case "11":
                nombreMes = "Noviembre"
                break;
            case "12":
                nombreMes = "Diciembre"
                break;
        }
        return nombreMes;
    }

    // console.table(datasetsDynamic)


    const data = {
        labels: labelsDynamic, datasets: datasetsDynamic
    }

    const options = {
        legend: {
            position: 'left'
        }
    }

    new Chart(id, {type: 'radar', data, options})
}


function yearsBarChart(coasters, id) {


    const data = {
        labels: ['1995-1997', '1998-2000', '2001-2003', '2004-2006', '2007-2009', '2013-2015', '2016-2018', '2019-2021'],
        datasets: [{
            label: 'Montañas creadas',
            borderColor: styles.color.solids[5],
            data: [coasters.filter(eachCoaster => eachCoaster.year >= 1995 && eachCoaster.year <= 1997).length, coasters.filter(eachCoaster => eachCoaster.year >= 1998 && eachCoaster.year <= 2000).length, coasters.filter(eachCoaster => eachCoaster.year >= 2001 && eachCoaster.year <= 2003).length, coasters.filter(eachCoaster => eachCoaster.year >= 2004 && eachCoaster.year <= 2006).length, coasters.filter(eachCoaster => eachCoaster.year >= 2007 && eachCoaster.year <= 2009).length, coasters.filter(eachCoaster => eachCoaster.year >= 2010 && eachCoaster.year <= 2012).length, coasters.filter(eachCoaster => eachCoaster.year >= 2013 && eachCoaster.year <= 2015).length, coasters.filter(eachCoaster => eachCoaster.year >= 2016 && eachCoaster.year <= 2018).length, coasters.filter(eachCoaster => eachCoaster.year >= 2019 && eachCoaster.year <= 2021).length]
        }, {
            type: 'bar',
            label: 'Aceleración',
            borderColor: styles.color.solids[3],
            backgroundColor: styles.color.solids[3],
            data: [coasters.filter(eachCoaster => eachCoaster.year >= 1995 && eachCoaster.year <= 1997 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 1998 && eachCoaster.year <= 2000 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2001 && eachCoaster.year <= 2003 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2004 && eachCoaster.year <= 2006 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2007 && eachCoaster.year <= 2009 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2010 && eachCoaster.year <= 2012 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2013 && eachCoaster.year <= 2015 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2016 && eachCoaster.year <= 2018 && eachCoaster.model === 'Hyper Coaster').length, coasters.filter(eachCoaster => eachCoaster.year >= 2019 && eachCoaster.year <= 2021 && eachCoaster.model === 'Hyper Coaster').length]
        }]
    }

    const options = {
        maintainAspectRatio: false, scaleFontColor: '#fff', scales: {
            yAxes: [{
                ticks: {
                    display: true
                }
            }], xAxes: [{
                barPercentage: 0.4, ticks: {
                    display: true
                }
            }]
        }
    }

    new Chart(id, {type: 'line', data, options})

}


function grupobar(coasters, id) {

    let dataCount = []
    let datasetsDynamic = []
    let labelsDynamic = []
    let item;

    coasters.forEach(element => {
        dataCount[element["anno"]] = (dataCount[element["anno"]] || 0) + 1;
    });


    Object.values(dataCount).forEach((value, index) => {
        labelsDynamic.push(Object.keys(dataCount)[index])
    });

    coasters.forEach((element, index) => {
        item = {
            label: element["x_sala_suprema"],
            data: [element["cant"]],
            borderColor: styles.color.solids[index],
            backgroundColor: styles.color.alphas[index]
        };
        datasetsDynamic.push(item)
    });


    console.table(dataCount)


    const data = {
        labels: labelsDynamic, datasets: datasetsDynamic
    }


    console.table(data)
    const options = {
        legend: {
            display: true
        }, title: {
            display: true, text: 'Comparacion'
        }, scales: {
            yAxes: [{
                gridLines: {
                    display: false
                }, ticks: {
                    display: true
                }
            }]
        }
    }

    new Chart(id, {type: 'bar', data, options})
}

function datajson() {
    var arrayNombres = new Array();
    var arrayApellido = new Array();
    var arrayCiudad = new Array();

    arrayNombres[0] = "nombre1";
    arrayNombres[1] = "nombre2";
    arrayNombres[2] = "nombre3";

    arrayApellido[0] = "ape1 ";
    arrayApellido[1] = "ape2";
    arrayApellido[2] = "ape3";

    arrayCiudad[0] = "ciudad1";
    arrayCiudad[1] = "ciudad2";
    arrayCiudad[2] = "ciudad3";

    // esta deberia ser la forma en la cual declaras tu objeto datos para que la pueda parsear a Json
    var list = {
        'datos': []
    };

    //guardas los datos
    for (var i = 0; i < arrayNombres.length; i++) {

        list.datos.push({
            "nombre": arrayNombres[i], "apellido": arrayApellido[i], "ciudad": arrayCiudad[i]
        });
    }
    ;

    json = JSON.stringify(list); // aqui tienes la lista de objetos en Json
    var obj = JSON.parse(json);

}
