var spinnerGrafico;
var optionColumns = 1;


initVariables()


function initVariables() {

}


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

var isNoVisibleAllAniosSelected = false;

function getInfoTabla(positionParentReport, idChartjs, nroTable, nameWS) {
    var spinner = document.getElementById("spinner" + nroTable)
    var txtResultado = document.getElementById("txtResultado" + nroTable)
    txtResultado.style.display = "none"
    var txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    var btnExcel = document.getElementById("btnExcel" + nroTable)

    // console.log(spinner)
    spinner.style = "display : block !important";
    var tabla = document.getElementById("table" + nroTable)
    var select = document.getElementById("selectable" + nroTable)
    tabla.style.display = "none"
    select.style.display = "none"

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
                select.style.display = 'block'
            } else {
                //alert("No se encontraron Resultados")
                showErrorAlerMessaje("No se encontraron Resultados", "", "")


                select.style.display = 'none'
                btnExcel.style.display = 'none'
                spinner.style.display = 'none'
                txtInformacionFiltro.style.display = 'none'
                txtResultado.style.display = 'block'

            }
        }, onerror => {
            spinner.style.display = 'none'
            showErrorAlerMessaje("Servicio no disponible", "", "")
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
    var txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    select_Filtro.innerHTML = ""
    // headerTable01.innerHTML = ''
    // bodyTable01.innerHTML = ''
    let htmlHeader = ''
    if (data.length == 0) {
        txtResultado.style.display = "block"
        return;
    }
    var tabla = document.getElementById("table" + nroTable)
    tabla.style.display = "block"
    // bodyTable01.style.display = "block"
    txtResultado.style.display = "none"
    let headerListTable = []

    headerListTable = Object.keys(data[0]).sort((a, b) => {
        return a.localeCompare(b)
    })
    //bind HEAder

    var label = document.getElementById("label_selectable" + nroTable)


    let NombreFiltroTabla = ""

    headerListTable.forEach((key, index) => {
        // console.log(key)
        if (key == "03_anno") return
        let keySubstring = key
        if (index == 0) {
            keySubstring = key.substring(3, key.length)
            NombreFiltroTabla = keySubstring
        }
        if (index > 0) if (true) keySubstring = key.substring(3, 6) + "."
        htmlHeader += "<th >" + keySubstring + "</th>"
    })
    htmlHeader += "<th style='background-color: #fcf5c6!important; color: black ;text-align: right!important;' >Total</th>"
    headerTable01.innerHTML = htmlHeader;


    // if (!isNoVisibleAllAniosSelected) {
    //     txtInformacionFiltro.innerHTML = "*REPORTE*<br> Desde rango Seleccionado "
    //
    // } else {


    if (data.length > 0) txtInformacionFiltro.innerHTML = "REPORTE <br> De " + formatDate(txtdate1Param) + " hasta " + formatDate(txtdate2Param);

    // }

    function formatDate(date) {
        return date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0]
    }


    label.innerText = NombreFiltroTabla;


    //FIN
    bindTableBody(data, headerListTable, select_Filtro, bodyTable01, false, NombreFiltroTabla)


    function bindTableBody(data, headerListTable, selectFiltro, bodyTable01, optionSelect, NombreFiltroTabla) {
        var html = '';
        let arrayTotalesHorizontal = []
        let htmlCombo = ''
        let listComboFiltro = []
        let valuesGraficoTablaAllRows = []
        let leftHeaderGrafico = []

        selectFiltro.innerHTML = "";
        htmlCombo += "<option  value='-1'> -- Todos -- </option>"
        data.forEach(dbItem => {
            html += "<tr>"
            let valuesGraficoTabla = []
            let AculumladoHorizontal = 0;
            let NameHeaderItem = ""
            headerListTable.forEach((keyName, posHeaderOrdered) => {
                if (keyName == "03_anno") {
                    return
                }
                Object.values(dbItem).forEach((value, posValue) => {
                    if (!optionSelect && posHeaderOrdered == 0 && keyName == Object.keys(dbItem)[posValue]) {
                        listComboFiltro[value + "&" + keyName] = (listComboFiltro[value + "&" + keyName] || 0) + 1;
                    }

                    if (posHeaderOrdered > 0 && keyName == Object.keys(dbItem)[posValue]) {
                        if (parseInt(value) >= 0) {
                            arrayTotalesHorizontal[keyName] = (arrayTotalesHorizontal[keyName] || 0) + value

                        } else {
                            arrayTotalesHorizontal[keyName] = ""
                        }
                    }

                    if (keyName == Object.keys(dbItem)[posValue]) {


                        if (posHeaderOrdered > 0 && !isNaN(value)) {
                            valuesGraficoTabla.push(value)
                            AculumladoHorizontal = AculumladoHorizontal + value
                        }

                        if (isNaN(value)) {
                            // if (isNaN(value)) {
                            // console.log(value)
                            NameHeaderItem += value + "-"
                            // }
                        }


                        // let ValueSpanish = value.toString().split(" ")
                        // // console.log(ValueSpanish)
                        // if (ValueSpanish.length > 0) {
                        //     ValueSpanish.forEach((it, pos) => {
                        //         if (it.toString().length > 3)
                        //             console.log(ValueSpanish)
                        //             // if (pos > 0)
                        //                 value = ValueSpanish[pos]
                        //     })
                        //
                        //
                        // }

                        html += "<td>" + value + "</td>"

                    }


                })


            })

            leftHeaderGrafico.push(NameHeaderItem)
            valuesGraficoTablaAllRows.push(valuesGraficoTabla)
            html += "<td style='background-color: #fcf5c6!important; color: black!important;'>" + AculumladoHorizontal + "</td>"
            html += "</tr>"
        })

        Object.keys(listComboFiltro).forEach(it => {
            let key = it.split("&")[1]
            let valueS = it.split("&")[0]
            htmlCombo += "<option value='" + it + "'>" + valueS + " </option>"
        })
        if (!optionSelect) {

            if (data.length == 0) {
                htmlCombo = "";
            }

            selectFiltro.innerHTML = htmlCombo;
        } else {
            selectFiltro.innerHTML = "";
        }
        html += "<tr class='tableTotales' >"
        html += "<td>Totales</td>"

        let totalValue = 0;

        Object.values(arrayTotalesHorizontal).forEach(item => {
            html += "<td>" + item + "</td>"
            totalValue += item;
        })
        html += "</tr>"
        bodyTable01.innerHTML = html
        var mainPanelDiv = document.getElementById("mainPanelDiv")
        var leftPanel = document.getElementById("leftPanel")
        setTimeout(() => {
            leftPanel.style.height = mainPanelDiv.clientHeight + "px"
            // alert("Cambiando height")
        }, 1000)


        // if (nroTable == "02") return

        var totalEL = document.getElementById(`total${nroTable}`)
        totalEL.innerText = totalValue;
        var DIV_GRAFICO_CHILD = document.getElementById(`ContentDIV_Child_table${nroTable}`)
        var LabelTitleGrafico = document.getElementById(`tituloReporteChild_table${nroTable}`)
        DIV_GRAFICO_CHILD.style.display = "none"

        LabelTitleGrafico.innerText = "Gráfico por " + NombreFiltroTabla;
        let TempHeaderGrgafico = [...headerListTable]
        let topHeaderGrgafico = []
        TempHeaderGrgafico.splice(0, 1)
        TempHeaderGrgafico.forEach((label, index) => {
            if (!(label == "03_anno" || label == "01_mes")) {
                if (label.toString().split("_").length > 0) {
                    topHeaderGrgafico.push(label.toString().split("_")[1])/*.substring(3, label.length);*/
                }
            }
        })


        leftHeaderGrafico.forEach((label, index) => {
            // label = label.split("_")[1]
            // console.log("table" + nroTable + ":" + label)
        })

        // DIV_GRAFICO_CHILD.style.display = "block"
        // DIV_GRAFICO_CHILD.style.width = "100vw"
        var canvas = document.getElementById(`chartChild_table${nroTable}`)
        canvas.remove()

        let datasetsGrafico = []


        let tipoGrafico = 'line'

        if (nroTable == "02") {
            tipoGrafico = 'bar'
        }
        // if (topHeaderGrgafico.length > 12) {
        //     tipoGrafico = 'line'
        // }

        valuesGraficoTablaAllRows.forEach((dataRow, index) => {
            let TextoFinalTitulo = ""
            // if (leftHeaderGrafico[index] != null) {
            let ValueTitle = leftHeaderGrafico[index].split("_")[0]
            let ValuesTitleSplites = ValueTitle.split(" ")
            ValuesTitleSplites.forEach((fhrase, index) => {
                if (index > 0) TextoFinalTitulo += fhrase + " "
            })
            if (ValuesTitleSplites.length == 1) {
                TextoFinalTitulo = ValuesTitleSplites[0]
            }
            // }
            // console.log(dataRow)

            let item = {
                label: TextoFinalTitulo,
                data: dataRow,
                fill: false,
                borderColor: styles.color.solids[index],
                backgroundColor: styles.color.alphas[index]
            };

            datasetsGrafico.push(item)
        })


        const dataGraficoChartJS = {
            labels: topHeaderGrgafico, datasets: datasetsGrafico,
        };
        // console.log(JSON.stringify(dataGraficoChartJS))


        var Contentchart7 = document.getElementById(`Content_chartChild_table${nroTable}`)
        Contentchart7.innerHTML = ` <canvas id="chartChild_table${nroTable}"></canvas>`
        var btnExcel = document.getElementById("btnExcel" + nroTable)

        let chart = new Chart("chartChild_table" + nroTable, {
            type: tipoGrafico, data: dataGraficoChartJS, currentOptionsGrafico
        })

        let total01 = document.getElementById('total-text' + nroTable)

        total01.style.display = 'block'
        btnExcel.style.display = 'block'


    }

    spinner.style.display = "none"


    select_Filtro.addEventListener('change', function (e) {
        // console.log(this.value)
        let key = this.value.split("&")[1]
        let valueS = this.value.split("&")[0]
        var listFilter = data.filter(item => {
            return item[key] == valueS;
        })
        var btn = document.getElementById(`btnGraficar${nroTable}`)


        if (this.value == -1) {
            btn.style.display = "none"
            bindTableBody(data, headerListTable, select_Filtro, bodyTable01, true, valueS)
            spinner.style.display = 'none !important'; //ocultaSpiner


        } else {


            bindTableBody(listFilter, headerListTable, select_Filtro, bodyTable01, true, valueS)
            spinner.style.display = 'none !important'; //ocultaSpiner

            let ContentDIV_Child_table01 = document.getElementById('ContentDIV_Child_table' + nroTable)
            // let isHide = ContentDIV_Child_table01.style.display;
            ContentDIV_Child_table01.style.display = 'block'
            // if (isHide == 'block') ContentDIV_Child_table01.style.display = 'none'

            let total01 = document.getElementsByClassName('total-text')
            for (const total01Element of total01) {
                total01Element.style.display = 'block'
            }
            btn.style.display = "block"
        }
    });


}

var positionParentReport = 0
var idGraficoCurrent = ""
var currentDataGrafico = []
var currentLabelsLeyendaGrafico = []
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

    htmlComboAnio += `<option  value='-1'>--TODOS--</option>`
    Object.keys(TempComboAniosList).forEach(it => {
        // console.log(it)
        htmlComboAnio += `<option  value='${it}'>${it} </option>`
        aniooSeleccionado = "-1"
    })
    SELECT_ANIO.innerHTML = htmlComboAnio
    SELECT_ANIO.value = aniooSeleccionado
    SELECT_ANIO.addEventListener('change', function (e) {
        aniooSeleccionado = this.value
        if (aniooSeleccionado != "-1") {
            txtdate2Param = txtInputdate2Param.value
            if (aniooSeleccionado > txtInputdate1Param.value.split("-")[0]) {
                txtdate1Param = aniooSeleccionado + "-" + "01-01"
            } else {
                txtdate1Param = txtInputdate1Param.value
                txtdate2Param = aniooSeleccionado + "-" + "12-31"
            }
        }
        if (aniooSeleccionado == "-1") {
            txtdate1Param = txtInputdate1Param.value
            isNoVisibleAllAniosSelected = false;
        }
        lisarTablas(cInsatnciaSelected, nombreSalaSeleccionada)
        isNoVisibleAllAniosSelected = true;
    });

    populateComboSalas(listComboSala, dataDB)

    function populateComboSalas(listaCombo, dataDB) {
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
                position: "right", fontColor: '#000000',
            }
        }, title: {
            display: false, text: 'COMPARACION SALAS POR AÑO', fontColor: '#000000',
        }, scales: {
            yAxes: [{
                gridLines: {
                    display: true
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
    currentLabelsLeyendaGrafico = labelsGrafico;
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
    let ContentDIV_Child_table01 = document.getElementById('ContentDIV_Child_table01')
    let ContentDIV_Child_table02 = document.getElementById('ContentDIV_Child_table02')
    let total01 = document.getElementsByClassName('total-text')
    for (const total01Element of total01) {
        total01Element.style.display = 'none'
    }

    ContentDIV_Child_table01.style.display = 'none'
    ContentDIV_Child_table02.style.display = 'none'
    table01.style.display = 'none'
    table02.style.display = 'none'
    if (positionParentReport == 1) {
        setInformacionTablas("getListadoIngresoMensualxTipRecurso", "getListadoIngresoMensualxCorteProced", false);
    }
    if (positionParentReport == 2) {
        setInformacionTablas("getListadoProgramacionesPonente", "getListadoProgramacionesFirmadoPonente", false);
    }
    if (positionParentReport == 3) {
        setInformacionTablas("getListaTipoEscritos", "getListadoEscritosPendienteAtendido", false);
    }
}

var nombreSalaSeleccionada = ""
var cInsatnciaSelected = ""
var aniooSeleccionado = ""

