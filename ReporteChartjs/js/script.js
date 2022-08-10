// Defaults
Chart.defaults.global.defaultFontColor = '#fff'
Chart.defaults.global.elements.line.borderWidth = 1
Chart.defaults.global.elements.rectangle.borderWidth = 1
Chart.defaults.scale.gridLines.color = '#444'
Chart.defaults.scale.ticks.display = false


var optionColumns = 1;

loadGraficoDetalle("00");


function loadGraficoDetalle(option) {


    if (option == "00") {
        fetch('http://localhost:4000/api/getListadoExpIngresos', {
            method: 'get', headers: new Headers({
                'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(data => printCharts(data, option))


    }


    if (option == "01") grupobar(data001, 'chart7_2', option, "00_Recurso")//grafico principal
    if (option == "02") grupobar(data002, 'chart7_2', option, "00_CorteProcedencia")//grafico principal

}

var data001 = []
var data002 = []

function printCharts(coasters, option) {
    document.body.classList.add('running')
    grupobar(coasters, 'chart7', option, "anno")//grafico principal


}

function getInfoTabla1(nroTable, nameWS) {
    // http://localhost:4000/api/getIngresosMensualTipoRecurso'
    fetch('http://localhost:4000/api/' + nameWS, {
        method: 'get', headers: new Headers({
            'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then(data => bindtabla(data, nroTable))
}

function bindtabla(data, nroTable) {
    if (nroTable == "01") data001 = data
    if (nroTable == "02") data002 = data
    var headerTable01 = document.getElementById("headerTable" + nroTable)
    var bodyTable01 = document.getElementById("bodyTable" + nroTable)
    var select_Filtro = document.getElementById("selectable" + nroTable)

    headerTable01.innerHTML = ''
    bodyTable01.innerHTML = ''
    let htmlHeader = ''

    if (data.length == 0) return

    let templistHeader = []

    templistHeader = Object.keys(data[0]).sort((a, b) => {
        return a.localeCompare(b)
    })
//bind HEAder
    templistHeader.forEach(key => {
        htmlHeader += "<th>" + key.substring(3, key.length) + "</th>"
    })
    headerTable01.innerHTML = htmlHeader;

//FIN
    bindTableBody(data, templistHeader, select_Filtro, bodyTable01, false)


    function bindTableBody(data, templistHeader, selectable, bodyTable01, optionSelect) {
        var html = '';

        let arrayTotales = []
        let htmlCombo = ''
        htmlCombo += "<option  value='-1'> -- Todos -- </option>"
        data.forEach(dbItem => {
            html += "<tr>"
            templistHeader.forEach((keyName, posHeaderOrdered) => {
                Object.values(dbItem).forEach((value, posValue) => {
                    if (!optionSelect) {
                        if (posHeaderOrdered == 0 && keyName == Object.keys(dbItem)[posValue]) {
                            htmlCombo += "<option value='" + value + "&" + keyName + "'>" + value + " </option>"
                        }
                    }
                    if (keyName == Object.keys(dbItem)[posValue]) {

                        html += "<td>" + value + "</td>"
                    }

                    if (posHeaderOrdered > 0 && keyName == Object.keys(dbItem)[posValue]) {
                        arrayTotales[keyName] = (arrayTotales[keyName] || 0) + value
                    }
                })
            })
            html += "</tr>"
        })
        if (!optionSelect) {
            selectable.innerHTML = htmlCombo;
        }

        // console.table(arrayTotales)
        html += "<tr class='tableTotales' >"
        html += "<td>Totales</td>"
        Object.values(arrayTotales).forEach(item => {
            html += "<td>" + item + "</td>"
        })
        html += "</tr>"

        bodyTable01.innerHTML = html
    }


    select_Filtro.addEventListener('change', function (e) {
        // console.log(this.value)
        let key = this.value.split("&")[1]
        let valueS = this.value.split("&")[0]
        var listFilter = data.filter(item => {
            return item[key] == valueS;
        })

        if (this.value == -1) {
            bindTableBody(data, templistHeader, select_Filtro, bodyTable01, true)
        } else {
            bindTableBody(listFilter, templistHeader, select_Filtro, bodyTable01, true)
        }
    });

}


function grupobar(dataDB, id, option, nombreFiltro) {

    let dataCount = []
    let datasetsDynamic = []
    let labelsDynamic = []
    let labelsCombo = []
    let item;
    var SELECT_ANIO = document.getElementById("selectableAnio")
    let htmlCombo = ''
    if (true) {
        // listaHorizontal

        dataDB.forEach((element, index) => {
            let DataTemp = []
            Object.keys(dataDB[index]).forEach((key, pos) => {
                let value = Object.values(dataDB[index])[pos]
                if (key !== nombreFiltro) {

                    DataTemp.push(value)
                    if (index == 0) {
                        labelsDynamic.push(key.substring(4, key.length))
                        labelsCombo.push(key)
                    }
                }
                if (nombreFiltro == key) {
                    htmlCombo += `<option value='${element[nombreFiltro]}'>${element[nombreFiltro]} </option>`
                    aniooSeleccionado = element[nombreFiltro]

                }
            });

            let AliasText = ''
            if (nombreFiltro == "anno") {
                AliasText = "AÑO"
            } else {
                AliasText = nombreFiltro
            }

            item = {
                label: AliasText + " " + element[nombreFiltro],
                data: DataTemp,
                borderColor: "#fff",
                backgroundColor: styles.color.alphas[index]
            };
            datasetsDynamic.push(item)
        });
        optionColumns = 2
    }


    populateComboSalas(labelsCombo)

    SELECT_ANIO.innerHTML = htmlCombo
    SELECT_ANIO.addEventListener('change', function (e) {
        aniooSeleccionado = this.value
        lisarTablas(cInsatnciaSelected, nombreSalaSeleccionada)
    });

    function populateComboSalas(listaCombo) {
        var selectFiltroSalas = document.getElementById("selectable03")
        let htmlCombo = ''
        // htmlCombo += "<option  value='-1'> -- Todos -- </option>"
        listaCombo.forEach(value => {
            let valueSplited = value.split("_")[1]
            let c_instancia = value.split("_")[0]
            htmlCombo += "<option value='" + c_instancia + "'>" + valueSplited + " </option>"
        })
        selectFiltroSalas.innerHTML = htmlCombo;

        selectFiltroSalas.addEventListener('change', function (e) {
            // console.log(this.value, this.text)
            lisarTablas(this.value, this.options[this.selectedIndex].text)
        });
        lisarTablas(listaCombo[0].split("_")[0], listaCombo[0].split("_")[1])
    }

    function lisarTablas(c_instacia, nombreSala) {
        nombreSalaSeleccionada = nombreSala
        cInsatnciaSelected = c_instacia
        var h3_titulos = document.getElementById("tituloSalaFiltro")
        h3_titulos.innerText = "Sala Seleccionada : " + nombreSalaSeleccionada
        getInfoTabla1("01", `getListadoIngresoMensualxTipRecurso/${cInsatnciaSelected}/${aniooSeleccionado}`);
        getInfoTabla1("02", `getListadoIngresoMensualxCorteProced/${cInsatnciaSelected}/${aniooSeleccionado}`);
    }


    // if (option == 2) {
    //     // listaVertical
    //     //recorre header Primera fila
    //     Object.keys(dataDB[0]).forEach((key, pos) => {
    //         let DataTemp = []
    //         //recore filas BD
    //         dataDB.forEach((element, inDB) => {
    //             let value = Object.values(element)[pos]
    //             if (key != nombreFiltro) {
    //                 DataTemp.push(value)
    //             }
    //             if (key == nombreFiltro) {
    //                 // console.log(value)
    //                 labelsDynamic.push(value)
    //             }
    //
    //         })
    //         item = {
    //             label: key,
    //             data: DataTemp,
    //             borderColor: styles.color.solids[pos],
    //             backgroundColor: styles.color.alphas[pos]
    //         };
    //         if (key != nombreFiltro) {
    //             datasetsDynamic.push(item)
    //         }
    //
    //
    //     });
    //     optionColumns = 1
    // }


    const data = {
        labels: labelsDynamic, datasets: datasetsDynamic
    }


    const options = {
        legend: {
            display: true
        }, title: {
            display: true, text: 'Comparacion Salas por anio'
        }, scales: {
            yAxes: [{
                gridLines: {
                    display: true
                }, ticks: {
                    display: true
                }
            }]
        }
    }

    new Chart(id, {type: 'bar', data, options})
}

var nombreSalaSeleccionada = ""
var cInsatnciaSelected = ""
var aniooSeleccionado = ""

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
