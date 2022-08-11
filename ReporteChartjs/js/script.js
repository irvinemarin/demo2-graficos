// Defaults
// Chart.defaults.global.defaultFontColor = '#ffffff'
// Chart.defaults.global.elements.line.borderWidth = 1
// Chart.defaults.global.elements.rectangle.borderWidth = 1
// Chart.defaults.scale.gridLines.color = '#444444'
// Chart.defaults.scale.ticks.display = false


var optionColumns = 1;

loadGraficoDetalle("00");

var spinnerGrafico;

function loadGraficoDetalle(option) {


    if (option == "00") {
        var ittulo = document.getElementById("tituloReporte1")
        ittulo.innerText = "REPORTE DE INGRESOS";

        fetch(gethostApi() + 'getListadoExpIngresos', {
            method: 'get',
            headers: new Headers({
                'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(data => printCharts(data, 1))

    }
    // if (option == "01") grupobar(data001, 'chart7_2', option, "00_Recurso", true)//grafico principal
    // if (option == "02") grupobar(data002, 'chart7_2', option, "00_CorteProcedencia", true)//grafico principal

}

var data001 = []
var data002 = []

var dataReport1 = []
var dataReport2 = []

function printCharts(dataDB, positionParentReportHTML) {
    spinnerGrafico = document.getElementById("spinnerGrafico");

    spinnerGrafico.style.display = 'block'
    positionParentReport = positionParentReportHTML
    // console.table(coasters)
    document.body.classList.add('running')
    var chart7 = document.getElementById("content01")
    var chart72 = document.getElementById("content02")
    var chart73 = document.getElementById("content03")
    if (positionParentReportHTML == 1) {
        chart7.style.display = 'block'
        chart73.style.display = 'none'
        chart72.style.display = 'none'
        grupobar(dataDB, 'chart7', positionParentReportHTML, "00_anno") //grafico principal
    }
    if (positionParentReportHTML == 2) {
        chart7.style.display = 'none'
        chart73.style.display = 'none'
        chart72.style.display = 'block'
        grupobar(dataDB, 'chart72', positionParentReportHTML, "00_anno") //grafico principal

    }
    if (positionParentReportHTML == 3) {
        chart7.style.display = 'none'
        chart72.style.display = 'none'
        chart73.style.display = 'block'
        grupobar(dataDB, 'chart73', positionParentReportHTML, "00_anno") //grafico principal
    }

}

function getInfoTabla(positionParentReport, idChartjs, nroTable, nameWS) {
    var spinner = document.getElementById("spinner" + nroTable)
    var tablaContent01 = document.getElementById("tablaContent01")
    var tablaContent02 = document.getElementById("tablaContent02")
    tablaContent01.style.display = 'none'
    tablaContent02.style.display = 'none'

    // console.log(spinner)
    spinner.style = "display : block !important";

    // http://172.22.3.65:4000/api/getIngresosMensualTipoRecurso'
    fetch(gethostApi() + nameWS, {
        method: 'get',
        headers: new Headers({
            'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then(data => bindtabla(data, nroTable, idChartjs, spinner, positionParentReport))
}

function bindtabla(data, nroTable, idChartjs, spinner, positionParentReport) {
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
    templistHeader.forEach((key, index) => {
        // console.log(key)
        if (key == "03_anno") return

        let keySubstring = key
        if (true) keySubstring = key.substring(3, 6)
        htmlHeader += "<th>" + keySubstring + ".</th>"
    })
    headerTable01.innerHTML = htmlHeader;

    //FIN
    bindTableBody(data, templistHeader, select_Filtro, bodyTable01, false)


    function bindTableBody(data, templistHeader, selectFiltro, bodyTable01, optionSelect) {
        var html = '';

        let arrayTotales = []
        let htmlCombo = ''

        let listComboFiltro = []

        htmlCombo += "<option  value='-1'> -- Todos -- </option>"
        data.forEach(dbItem => {
            html += "<tr>"
            templistHeader.forEach((keyName, posHeaderOrdered) => {
                if (keyName == "03_anno") return
                Object.values(dbItem).forEach((value, posValue) => {


                    if (!optionSelect) {
                        if (posHeaderOrdered == 0 && keyName == Object.keys(dbItem)[posValue]) {
                            listComboFiltro[value + "&" + keyName] = (listComboFiltro[value + "&" + keyName] || 0) + 1;
                        }
                    }
                    if (keyName == Object.keys(dbItem)[posValue]) {
                        html += "<td>" + value + "</td>"
                    }

                    if (posHeaderOrdered > 0 && keyName == Object.keys(dbItem)[posValue]) {

                        if (parseInt(value) >= 0) {
                            arrayTotales[keyName] = (arrayTotales[keyName] || 0) + value
                        } else {
                            arrayTotales[keyName] = ""
                        }


                    }
                })
            })
            html += "</tr>"
        })

        Object.keys(listComboFiltro).forEach(it => {
            // console.log(it)

            let key = it.split("&")[1]
            let valueS = it.split("&")[0]
            htmlCombo += "<option value='" + it + "'>" + valueS + " </option>"
        })

        if (!optionSelect) {
            selectFiltro.innerHTML = htmlCombo;
        }

        // console.table(arrayTotales)
        html += "<tr class='tableTotales' >"
        html += "<td>Totales</td>"
        Object.values(arrayTotales).forEach(item => {


            html += "<td>" + item + "</td>"
        })
        html += "</tr>"

        bodyTable01.innerHTML = html


        var tablaContent01 = document.getElementById("tablaContent01")
        var tablaContent02 = document.getElementById("tablaContent02")
        tablaContent01.style.display = 'block'
        tablaContent02.style.display = 'block'
    }

    spinner.style.display = "none"
    select_Filtro.addEventListener('change', function (e) {
        // console.log(this.value)
        let key = this.value.split("&")[1]
        let valueS = this.value.split("&")[0]
        var listFilter = data.filter(item => {
            return item[key] == valueS;
        })

        if (this.value == -1) {
            bindTableBody(data, templistHeader, select_Filtro, bodyTable01, true)
            spinner.style.display = 'none !important'; //ocultaSpiner
        } else {
            bindTableBody(listFilter, templistHeader, select_Filtro, bodyTable01, true)
            spinner.style.display = 'none !important'; //ocultaSpiner
        }
    });

}

var positionParentReport = 0

function grupobar(dataDB, idChartjs, positionParentReportHTML, nombreFiltro, isChild) {


    let dataCount = []
    let datasetsDynamic = []
    let labelsDynamic = []
    let labelsComboSala = []
    let item;
    var SELECT_ANIO = document.getElementById("selectableAnio")


    let TempComboList = []

    if (true) {
        // listaHorizontal

        dataDB.forEach((element, index) => {
            let DataTemp = []
            Object.keys(dataDB[index]).forEach((key, pos) => {
                let value = Object.values(dataDB[index])[pos]
                if (key !== nombreFiltro) {

                    DataTemp.push(value)
                    if (index == 0) {

                        // if (idChartjs != "charts7_2") {

                        labelsDynamic.push(key/*.substring(4, key.length)*/)


                        // // } else {
                        //     labelsDynamic.push(key)
                        // // }


                        labelsComboSala.push(key)
                    }
                }
                if (nombreFiltro == key) {
                    TempComboList[element[nombreFiltro]] = (TempComboList[element[nombreFiltro]] || 0) + 1;


                }
            });

            let AliasText = ''
            if (nombreFiltro == "00_anno") {
                AliasText = "AÑO"
            } else {
                AliasText = nombreFiltro
            }

            item = {
                label: AliasText + " " + element[nombreFiltro],
                data: DataTemp,
                borderColor: styles.color.solids[index],
                backgroundColor: styles.color.alphas[index]
            };
            datasetsDynamic.push(item)
        });
        optionColumns = 2
    }

    if (!isChild) {

        let htmlComboAnio = ''

        console.table(TempComboList)

        Object.keys(TempComboList).forEach(it => {
            // console.log(it)
            htmlComboAnio += `<option  value='${it}'>${it} </option>`
            aniooSeleccionado = it
            // console.log("aniooSeleccionado :" + aniooSeleccionado)
        })
        SELECT_ANIO.innerHTML = htmlComboAnio
        SELECT_ANIO.value = aniooSeleccionado

        SELECT_ANIO.addEventListener('change', function (e) {
            aniooSeleccionado = this.value
            lisarTablas(cInsatnciaSelected, nombreSalaSeleccionada)
        });
        populateComboSalas(labelsComboSala)

        function populateComboSalas(listaCombo) {
            var selectFiltroSalas = document.getElementById("selectableFiltroSala")
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

            if (positionParentReport == 1) {
                getInfoTabla(positionParentReport, idChartjs, "01", `getListadoIngresoMensualxTipRecurso/${cInsatnciaSelected}/${aniooSeleccionado}`);
                getInfoTabla(positionParentReport, idChartjs, "02", `getListadoIngresoMensualxCorteProced/${cInsatnciaSelected}/${aniooSeleccionado}`);
            }
            if (positionParentReport == 2) {
                getInfoTabla(positionParentReport, idChartjs, "01", `getListadoProgramacionesPonente/${cInsatnciaSelected}/${aniooSeleccionado}`);
                getInfoTabla(positionParentReport, idChartjs, "02", `getListadoProgramacionesFirmadoPonente/${cInsatnciaSelected}/${aniooSeleccionado}`);

                // getInfoTabla(idChartjs, "03", `getListadoIngresoPonentes/${cInsatnciaSelected}/${aniooSeleccionado}`);

            }
            if (positionParentReport == 3) {
                getInfoTabla(positionParentReport, idChartjs, "01", `getListaTipoEscritos/${cInsatnciaSelected}/${aniooSeleccionado}`);
                getInfoTabla(positionParentReport, idChartjs, "02", `getListadoEscritosPendienteAtendido/${aniooSeleccionado}`);

                // getInfoTabla(idChartjs, "03", `getListadoIngresoPonentes/${cInsatnciaSelected}/${aniooSeleccionado}`);

            }

        }
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


    labelsDynamic.sort((a, b) => {
        return a.localeCompare(b)
    })

    let arraySubtring = []

    labelsDynamic.forEach((a, pos) => {
        arraySubtring[pos] = a.substring(4, a.length)
    })

    const data = {
        labels: arraySubtring,
        datasets: datasetsDynamic
    }


    const options = {
        legend: {
            labels: {
                fontColor: '#000000',
            }
        },
        title: {
            display: true,
            text: 'COMPARACION SALAS POR AÑO',
            fontColor: '#000000',
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    fontColor: '#000000',
                    display: true
                }
            }],
            xAxes: [{
                gridLines: {
                    display: true
                },
                ticks: {
                    fontColor: '#000000',
                    display: true
                }
            }]
        }
    }
    var canvas = document.getElementById(idChartjs)
    canvas.remove()
    var Contentchart7 = document.getElementById("Contentchart7")
    var Contentchart72 = document.getElementById("Contentchart72")
    var Contentchart73 = document.getElementById("Contentchart73")
    Contentchart7.innerHTML = ' <canvas id="chart7"></canvas>'
    Contentchart72.innerHTML = ' <canvas id="chart72"></canvas>'
    Contentchart73.innerHTML = ' <canvas id="chart73"></canvas>'
    new Chart(idChartjs, {type: 'bar', data, options})
    spinnerGrafico.style.display = 'none'
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
            "nombre": arrayNombres[i],
            "apellido": arrayApellido[i],
            "ciudad": arrayCiudad[i]
        });
    }
    ;

    json = JSON.stringify(list); // aqui tienes la lista de objetos en Json
    var obj = JSON.parse(json);


}
