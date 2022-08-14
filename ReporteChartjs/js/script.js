var spinnerGrafico;
var optionColumns = 1;


loadGraficoDetalle("-1");


function loadGraficoDetalle(option) {
    if (option == "-1") return;
    if (option == "00") {
        var ittulo = document.getElementById("tituloReporte1")
        ittulo.innerText = "REPORTE DE INGRESOS";
        fetch(`${gethostApi()}getListadoExpIngresos/${txtdate1Param}/${txtdate2Param}`, {
            method: 'get', headers: new Headers({
                'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then((data) => {
                if (data.length > 0) {
                    printCharts(data, 1)
                } else {
                    spinnerGrafico.style.display = 'none'
                }
            }, onerror => {
                spinnerGrafico.style.display = 'none'
            })
    }

}

var data001 = []
var data002 = []

var dataReport1 = []
var dataReport2 = []

var mainPanelDiv;

function printCharts(dataDB, positionParentReportHTML) {


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
        bindGraficoBarras(dataDB, 'chart7', positionParentReportHTML, "00_anno") //grafico principal
    }
    if (positionParentReportHTML == 2) {
        chart7.style.display = 'none'
        chart73.style.display = 'none'
        chart72.style.display = 'block'
        bindGraficoBarras(dataDB, 'chart72', positionParentReportHTML, "00_anno") //grafico principal

    }
    if (positionParentReportHTML == 3) {
        chart7.style.display = 'none'
        chart72.style.display = 'none'
        chart73.style.display = 'block'
        bindGraficoBarras(dataDB, 'chart73', positionParentReportHTML, "00_anno") //grafico principal
    }

}

function getInfoTabla(positionParentReport, idChartjs, nroTable, nameWS) {
    var spinner = document.getElementById("spinner" + nroTable)
    var tablaContent01 = document.getElementById("tablaContent01")
    var tablaContent02 = document.getElementById("tablaContent02")

    tablaContent01.style.display = 'none'
    tablaContent02.style.display = 'none'
    var txtResultado = document.getElementById("txtResultado" + nroTable)
    txtResultado.style.display = "none"


    // console.log(spinner)
    spinner.style = "display : block !important";
    var tabla = document.getElementById("table" + nroTable)
    tabla.style.display = "none"

    fetch(gethostApi() + nameWS, {
        method: 'get', headers: new Headers({
            'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then((data) => {
            if (data.length > 0) {
                bindtabla(data, nroTable, idChartjs, spinner, positionParentReport)
            } else {
                //alert("No se encontraron Resultados")
                spinner.style.display = 'none'
                txtResultado.style.display = 'block'

            }
        }, onerror => {
            spinner.style.display = 'none'
            //alert("Servicio no Disponible")
        })

}

function bindtabla(data, nroTable, idChartjs, spinner, positionParentReport) {
    if (nroTable == "01") data001 = data
    if (nroTable == "02") data002 = data
    var headerTable01 = document.getElementById("headerTable" + nroTable)
    var bodyTable01 = document.getElementById("bodyTable" + nroTable)
    var select_Filtro = document.getElementById("selectable" + nroTable)
    var txtResultado = document.getElementById("txtResultado" + nroTable)
    headerTable01.innerHTML = ''
    bodyTable01.innerHTML = ''
    let htmlHeader = ''
    if (data.length == 0) {
        txtResultado.style.display = "block"
        return;
    }
    var tabla = document.getElementById("table" + nroTable)
    tabla.style.display = "block"
    // bodyTable01.style.display = "block"
    txtResultado.style.display = "none"
    let templistHeader = []

    templistHeader = Object.keys(data[0]).sort((a, b) => {
        return a.localeCompare(b)
    })
    //bind HEAder

    var label = document.getElementById("label_selectable" + nroTable)


    let NombreFiltroTabla = ""

    templistHeader.forEach((key, index) => {
        // console.log(key)
        if (key == "03_anno") return
        let keySubstring = key

        if (index == 0) {
            keySubstring = key.substring(3, key.length)
            NombreFiltroTabla = keySubstring
        }
        if (index > 0) if (true) keySubstring = key.substring(3, 6) + "."
        htmlHeader += "<th>" + keySubstring + "</th>"
    })
    headerTable01.innerHTML = htmlHeader;

    label.innerText = NombreFiltroTabla;

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
        var mainPanelDiv = document.getElementById("mainPanelDiv")
        var leftPanel = document.getElementById("leftPanel")
        setTimeout(() => {
            leftPanel.style.height = mainPanelDiv.clientHeight + "px"
            // alert("Cambiando height")
        }, 0)
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
var idGraficoCurrent = ""
var currentDataGrafico = []
var currentLabelsGrafico = []
var currentOptionsGrafico;

function bindGraficoBarras(dataDB, idChartjs, positionParentReportHTML, nombreFiltro, isChild) {
    idGraficoCurrent = idChartjs;
    let datasetsGrafico = []
    let labelsDynamic = []
    let listComboSala = []
    let item;
    var SELECT_ANIO = document.getElementById("selectableAnio")
    let TempComboAniosList = []
    let labelsTemp = [];

    if (true) {
        // listaHorizontal
        Object.keys(dataDB[0]).forEach((keyDB, pos) => {
            if (keyDB !== nombreFiltro) {
                labelsTemp.push(keyDB)
                listComboSala.push(keyDB)
            }
        })
        listComboSala.sort((a, b) => {
            return a.localeCompare(b)
        })
        labelsDynamic = labelsTemp.sort((a, b) => {
            return a.localeCompare(b)
        })
        dataDB.forEach((element, index) => {
            let DataTemp = []
            Object.keys(dataDB[index]).forEach((keyDB, pos) => {
                if (nombreFiltro == keyDB) {
                    TempComboAniosList[element[nombreFiltro]] = (TempComboAniosList[element[nombreFiltro]] || 0) + 1;
                }
            })
            labelsTemp.forEach(keyTemp => {
                Object.keys(dataDB[index]).forEach((keyDB, pos) => {
                    if (keyTemp == keyDB) {
                        let value = Object.values(dataDB[index])[pos]
                        if (keyDB !== nombreFiltro) {
                            DataTemp.push({valueTemp: value, keyTemp: keyDB})
                        }
                    }
                })
            });
            let DataOrdered = []
            DataTemp.forEach(it => {
                labelsDynamic.forEach(key => {
                    if (it.keyTemp == key) {
                        DataOrdered.push(it.valueTemp)
                    }
                })
            })
            // console.log(JSON.stringify(DataOrdered))
            let AliasText = ''
            AliasText = nombreFiltro == "00_anno" ? "AÑO" : nombreFiltro;
            item = {
                label: AliasText + " " + element[nombreFiltro],
                data: DataOrdered,
                fill: false,
                borderColor: styles.color.solids[index],
                backgroundColor: styles.color.alphas[index]
            };
            // console.log(JSON.stringify(item))
            datasetsGrafico.push(item)
        });
        optionColumns = 2
    }
    let htmlComboAnio = ''
    Object.keys(TempComboAniosList).forEach(it => {
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
    populateComboSalas(listComboSala)

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

    let labelsGrafico = []
    labelsDynamic.forEach((a, pos) => {
        labelsGrafico[pos] = a.substring(4, a.length)
    })
    const data = {
        labels: labelsGrafico, datasets: datasetsGrafico
    }
    const options = {
        legend: {
            labels: {
                position: "right",
                fontColor: '#000000',
            }
        }, title: {
            display: false, text: 'COMPARACION SALAS POR AÑO', fontColor: '#000000',
        }, scales: {
            yAxes: [{
                gridLines: {
                    display: false
                }, ticks: {
                    fontColor: '#000000', display: true
                }
            }], xAxes: [{
                gridLines: {
                    display: true
                }, ticks: {
                    fontColor: '#000000', display: true
                }
            }]
        }
    }
    currentDataGrafico = datasetsGrafico;
    currentLabelsGrafico = labelsGrafico;
    currentOptionsGrafico = options;

    var canvas = document.getElementById(idGraficoCurrent)
    canvas.remove()
    var Contentchart7 = document.getElementById("Content" + idGraficoCurrent)
    Contentchart7.innerHTML = ' <canvas id="' + idGraficoCurrent + '"></canvas>'
    new Chart(idGraficoCurrent, {type: 'bar', data, options})
    spinnerGrafico.style.display = 'none'
}


function setInformacionTablas(nombreServicioTabla01, nombreServicioTabla02, isNoInstanciaNeed) {
    setTimeout(() => {
        let WSParam = `${nombreServicioTabla02}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;
        if (isNoInstanciaNeed) WSParam = `${nombreServicioTabla02}/` + txtdate1Param + "/" + txtdate2Param;
        getInfoTabla(positionParentReport, "", "02", WSParam);
    }, 0)
    setTimeout(() => {
        let WSParam = `${nombreServicioTabla01}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;
        getInfoTabla(positionParentReport, "", "01", WSParam);
    }, 2000)
}


function lisarTablas(c_instacia, nombreSala) {
    nombreSalaSeleccionada = nombreSala
    cInsatnciaSelected = c_instacia
    var h3_titulos = document.getElementById("tituloSalaFiltro")
    h3_titulos.innerText = "Sala Seleccionada : " + nombreSalaSeleccionada
    var table01 = document.getElementById("table01")
    var table02 = document.getElementById("table02")
    table01.style.display = 'none'
    table02.style.display = 'none'
    if (positionParentReport == 1) {
        setInformacionTablas("getListadoIngresoMensualxTipRecurso", "getListadoIngresoMensualxCorteProced", false);
    }
    if (positionParentReport == 2) {
        setInformacionTablas("getListadoProgramacionesPonente", "getListadoProgramacionesFirmadoPonente", false);
    }
    if (positionParentReport == 3) {
        setInformacionTablas("getListaTipoEscritos", "getListadoEscritosPendienteAtendido", true);
    }
}

var nombreSalaSeleccionada = ""
var cInsatnciaSelected = ""
var aniooSeleccionado = ""

