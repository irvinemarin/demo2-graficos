var spinnerGrafico;
var optionColumns = 1;
var isNoVisibleAllAniosSelected = false;
var mainPanelDiv;
var chart7 = document.getElementById("content01")
var chart72 = document.getElementById("content02")
var chart73 = document.getElementById("content03")

function setDisplayGraficoContent(displayC7, displayC72, displayC73) {
    chart7.style.display = displayC7
    chart73.style.display = displayC73
    chart72.style.display = displayC72
}

function printCharts(dataDB, positionParentReportHTML) {
    spinnerGrafico.style.display = 'block'
    positionParentReport = positionParentReportHTML
    document.body.classList.add('running')
    let chartId = ""
    if (positionParentReportHTML == 1) {
        chartId = "chart7";
        setDisplayGraficoContent("block", "none", "none")
    } else if (positionParentReportHTML == 2) {
        chartId = "chart72";
        setDisplayGraficoContent("none", "block", "none")
    } else if (positionParentReportHTML == 3) {
        chartId = "chart73";
        setDisplayGraficoContent("none", "none", "block")
    }
    setGraficoBarras(dataDB, chartId, positionParentReportHTML, "00_anno") //grafico principal

}


function obtenerDatosTabla(positionParentReport, idChartjs, nroTable, nameWS) {
    let spinner = document.getElementById("spinner" + nroTable)
    let txtResultado = document.getElementById("txtResultado" + nroTable)
    let txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    let btnExcel = document.getElementById("btnExcel" + nroTable)
    let tabla = document.getElementById("table" + nroTable)
    let select = document.getElementById("selectable" + nroTable)
    spinner.style = "display : block !important";
    txtResultado.style.display = "none"
    tabla.style.display = "none"
    select.style.display = "none"


    obtenerDatosWS(nameWS).then(response => response.json())
        .then((data) => {
            if (data.length > 0) setDataFound(data); else setNoDataFound()
        }, onerror => {
            spinner.style.display = 'none'
            showErrorAlerMessaje("Servicio no disponible", "", "")
        })


    function setDataFound(data) {
        setTabla(data, nroTable, idChartjs, spinner, positionParentReport)
        let btnPrint01 = document.getElementById('btnPrint01')
        let btnPrint02 = document.getElementById('btnPrint02')
        btnPrint01.style.display = "block"
        btnPrint02.style.display = "block"
        select.style.display = 'block'
        if (nroTable == "03") {
            select.style.display = 'none'
            let ContentReporte03 = document.getElementById('ContentReporte03')
            ContentReporte03.style.display = "block"

        }
    }

    function setNoDataFound() {
        select.style.display = 'none'
        btnExcel.style.display = 'none'
        spinner.style.display = 'none'
        txtInformacionFiltro.style.display = 'none'
        txtResultado.style.display = 'block'
    }

}

function obtenerDatosFiltrado(data, headerListTable, __SELECT_TABLE, bodyTable01, b, valueS2, nroTable, listFilter2, spinner) {

    let key = __SELECT_TABLE.value.split("&")[1]
    let valueS = __SELECT_TABLE.value.split("&")[0]
    var listFilter = data.filter(item => {
        return item[key] == valueS;
    })

    if (__SELECT_TABLE.value == -1) {
        setTableBodyData(data, headerListTable, __SELECT_TABLE, bodyTable01, true, valueS, nroTable, spinner)
        spinner.style.display = 'none !important'; //ocultaSpiner
    } else {
        setTableBodyData(listFilter, headerListTable, __SELECT_TABLE, bodyTable01, true, valueS, nroTable, spinner)
        spinner.style.display = 'none !important'; //ocultaSpiner
        setVisibleGraficoTabla("block", nroTable)

    }
}

function setVisibleGraficoTabla(displayValue, nroTable) {
    if (nroTable == "03") return;
    let ContentDIV_Child_table01 = document.getElementById('ContentDIV_Child_table' + nroTable)
    ContentDIV_Child_table01.style.display = displayValue
    let total01 = document.getElementsByClassName('total-text')
    for (const total01Element of total01) {
        total01Element.style.display = displayValue
    }
}

function setTabla(data, nroTable, idChartjs, spinner, positionParentReport) {
    var headerTable01 = document.getElementById("headerTable" + nroTable)
    var bodyTable01 = document.getElementById("bodyTable" + nroTable)
    var __SELECT_TABLE = document.getElementById("selectable" + nroTable)
    var txtResultado = document.getElementById("txtResultado" + nroTable)
    var txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    var label = document.getElementById("label_selectable" + nroTable)
    var tabla = document.getElementById("table" + nroTable)
    __SELECT_TABLE.innerHTML = ""
    if (data.length == 0) {
        txtResultado.style.display = "block"
        return;
    }
    tabla.style.display = "block"
    txtResultado.style.display = "none"
    let headerListTable = []

    headerListTable = Object.keys(data[0]).sort((a, b) => {
        return a.localeCompare(b)
    })


    //bind HEAder
    let NombreFiltroTabla = ""
    let htmlHeader = ''
    htmlHeader += "<th >#</th>"

    function setSubstringHeaderTable(keySubstring, key, lenght, ext) {
        keySubstring = key.substring(3, lenght) + ext
        return keySubstring;
    }

    headerListTable.forEach((key, index) => {
        if (key == "03_anno") return;
        let keySubstring = key
        if (index == 0) {
            keySubstring = key.substring(3, key.length)
            NombreFiltroTabla = keySubstring
        }
        if (index > 0) {
            keySubstring = setSubstringHeaderTable(keySubstring, key, 6, ".")
        }
        if (nroTable == "03") {
            keySubstring = setSubstringHeaderTable(keySubstring, key, key.length, "")
        }


        if (nroTable == "03") {
            if (index == 11) htmlHeader += "<th style='min-width: 150px !important'>" + keySubstring + "</th>"; else if (index == 3) htmlHeader += "<th style='min-width: 150px !important'>" + keySubstring + "</th>"; else {
                htmlHeader += "<th>" + keySubstring + "</th>"
            }
        } else {
            htmlHeader += "<th >" + keySubstring + "</th>"

        }
    })
    if (nroTable != "03") {
        htmlHeader += "<th style='background-color: #fcf5c6!important; color: black ;text-align: right!important;' >Total</th>"
    }

    headerTable01.innerHTML = htmlHeader;
    label.innerText = NombreFiltroTabla;


    if (data.length > 0) {
        let nombreReporte = ""
        if (positionParentReport == 1) {
            if (nroTable == "01") {
                nombreReporte = "DE INGRESO POR RECURSO"
            }
            if (nroTable == "02") {
                nombreReporte = "DE INGRESO POR CORTE DE PROCEDENCIA"
            }
        }
        if (positionParentReport == 3) {
            if (nroTable == "01") {
                nombreReporte = "DE ESCRITOS POR TIPO DOCUMENTO"
            }
            if (nroTable == "02") {
                nombreReporte = "DE ESCRITOS POR SITUACION"
            }
        }


        if (positionParentReport == 2) {
            if (nroTable == "01") {
                nombreReporte = "DE PROGRAMACION POR PONENTE"
            }
            if (nroTable == "02") {
                nombreReporte = "PROGRAMADOS PENDIENTE DE ATENCION"
            }
            if (nroTable == "03") {
                nombreReporte = "DETALLADO DE PENDIENTE DE ATENCION"
            }
        }
        txtInformacionFiltro.innerHTML = "REPORTE " + nombreReporte + " <br> De " + formatDate(txtdate1Param) + " hasta " + formatDate(txtdate2Param);
    }

    function formatDate(date) {
        return date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0]
    }

    let htmlCombo = ''
    let listComboFiltro = []
    data.forEach(dbItem => {
        headerListTable.forEach((keyName, posHeaderOrdered) => {
            if (keyName == "03_anno") {
                return
            }
            Object.values(dbItem).forEach((value, posValue) => {
                if (posHeaderOrdered == 0 && keyName == Object.keys(dbItem)[posValue]) {
                    listComboFiltro[value + "&" + keyName] = (listComboFiltro[value + "&" + keyName] || 0) + 1;
                }
            })
        })
    })

    let firstOptionSelect = ""

    // if (nroTable != "03") {
    firstOptionSelect = "<option  value='-1'> -- Todos -- </option>";

    htmlCombo += firstOptionSelect

    Object.keys(listComboFiltro).forEach(it => {
        let key = it.split("&")[1]
        let valueS = it.split("&")[0]
        htmlCombo += "<option value='" + it + "'>" + valueS + " </option>"
    })

    __SELECT_TABLE.innerHTML = htmlCombo;
    let ContentReporte03 = document.getElementById('ContentReporte03')
    let __SELECT_TABLE_PONENTE = document.getElementById('selectablePonente03')
    var labelst03 = document.getElementById("label_selectablePonente03")
    var btnExcel03 = document.getElementById("btnExcel03")

    if (positionParentReport != 2) {
        __SELECT_TABLE_PONENTE.style.display = 'none'
        ContentReporte03.style.display = "none"
        labelst03.style.display = 'none'
    }

    if (nroTable == "02" && positionParentReport == 2) {
        labelst03.innerText = "Selecione un Ponente para ver su detalle "
        __SELECT_TABLE_PONENTE.innerHTML = ""
        __SELECT_TABLE_PONENTE.innerHTML = htmlCombo
        __SELECT_TABLE_PONENTE.options[0].text = "-- Seleccione --"
        labelst03.style.display = "block"
        __SELECT_TABLE_PONENTE.style.display = "block"
    }

    // if (nroTable == "03") {
    __SELECT_TABLE_PONENTE.addEventListener('change', function (e) {
        if (__SELECT_TABLE_PONENTE.value == -1) {
            ContentReporte03.style.display = "none"
            btnExcel03.style.display = "none"
        } else {

            setVisibleGraficoTabla("none", "03")
            btnExcel03.style.display = "block"
            obtenerServicio03("getListadoProgramacionesPonenteRecurso");
        }
    });
    // }


    __SELECT_TABLE.addEventListener('change', function (e) {
        var btnGraficar = document.getElementById(`btnGraficar${nroTable}`)
        btnGraficar.style.display = "none"
        obtenerDatosFiltrado(data, headerListTable, __SELECT_TABLE, bodyTable01, true, "--", nroTable, [], spinner)
    });


    if (nroTable == "03") {
        // console.log("fintrado inicial tabla03")
        obtenerDatosFiltrado(data, headerListTable, __SELECT_TABLE, bodyTable01, true, "--", nroTable, [], spinner)

    } else {
        setTableBodyData(data, headerListTable, __SELECT_TABLE, bodyTable01, false, NombreFiltroTabla, nroTable)
    }
    spinner.style.display = "none"


}


function setTableBodyData(data, headerListTable, _selectFiltro, bodyTable01, optionSelect, NombreFiltroTabla, nroTable, spinner) {
    var htmltabla = '';
    let valuesGraficoTablaAllRows = []
    let arrayTotalesHorizontal = []
    let leftHeaderGrafico = []


    data.forEach((dbItem, posDB) => {
        htmltabla += "<tr>"
        htmltabla += "<td>" + (posDB + 1) + "</td>"
        let valuesGraficoTabla = []
        let AculumladoHorizontal = 0;
        let NameHeaderItem = ""
        headerListTable.forEach((keyName, posHeaderOrdered) => {
            if (keyName == "03_anno") {
                return
            }
            Object.values(dbItem).forEach((value, posValue) => {
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

                        AculumladoHorizontal = (AculumladoHorizontal + value)
                    }
                    if (isNaN(value)) {
                        NameHeaderItem += value + "-"
                    }
                    htmltabla += "<td>" + value + "</td>"
                }
            })
        })

        leftHeaderGrafico.push(NameHeaderItem)
        valuesGraficoTablaAllRows.push(valuesGraficoTabla)

        if (nroTable != "03") htmltabla += "<td style='background-color: #fcf5c6!important; color: black!important;'>" + AculumladoHorizontal + "</td>"
        htmltabla += "</tr>"
    })

    // Object.keys(listComboFiltro).forEach(it => {
    //     let key = it.split("&")[1]
    //     let valueS = it.split("&")[0]
    //     htmlCombo += "<option value='" + it + "'>" + valueS + " </option>"
    // })
    // if (!optionSelect) {
    //     selectFiltro.innerHTML = htmlCombo;
    // }

    let totalValue = 0;
    if (nroTable != "03") {
        htmltabla += "<tr class='tableTotales' >"
        htmltabla += "<td></td>"
        htmltabla += "<td>Totales</td>"
        Object.values(arrayTotalesHorizontal).forEach(item => {
            htmltabla += "<td>" + item + "</td>"
            totalValue += item;
        })
        htmltabla += "</tr>"


    }

    bodyTable01.innerHTML = htmltabla
    var mainPanelDiv = document.getElementById("mainPanelDiv")
    var leftPanel = document.getElementById("leftPanel")
    setTimeout(() => {
        leftPanel.style.height = mainPanelDiv.clientHeight + "px"
        checkWidthChange()
        // alert("Cambiando height")
    }, 1000)


    // if (nroTable == "03") {
    //
    // }

    if (nroTable != "03") {
        var totalEL = document.getElementById(`total${nroTable}`)
        totalEL.innerText = totalValue;
    }


    if (nroTable == "03") {
        var __SELECT_TABLE03 = document.getElementById("selectable03")
        var __LABEL_SELECT_TABLE03 = document.getElementById("label_selectable03")
        __SELECT_TABLE03.style.display = 'none'
        __LABEL_SELECT_TABLE03.style.display = 'none'
        // return
    }

    var DIV_GRAFICO_CHILD = document.getElementById(`ContentDIV_Child_table${nroTable}`)
    var LabelTitleGrafico = document.getElementById(`tituloReporteChild_table${nroTable}`)
    var canvas = document.getElementById(`chartChild_table${nroTable}`)
    if (canvas) canvas.remove()
    DIV_GRAFICO_CHILD.style.display = "none"

    LabelTitleGrafico.innerText = "Gr??fico por " + NombreFiltroTabla;
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
    // let total = document.getElementById('total-text' + nroTable)
    // total.style.display = 'block'

    if (nroTable != "03") {
        var Contentchart7 = document.getElementById(`Content_chartChild_table${nroTable}`)
        Contentchart7.innerHTML = ` <canvas id="chartChild_table${nroTable}"></canvas>`
        var btnExcel = document.getElementById("btnExcel" + nroTable)
        let chart = new Chart("chartChild_table" + nroTable, {
            type: tipoGrafico, data: dataGraficoChartJS, currentOptionsGrafico
        })
        btnExcel.style.display = 'block'
    }


    // if (nroTable == "03") {
    //     obtenerDataFiltro(data, headerListTable, selectFiltro, bodyTable01, true, "valueS", nroTable, "listFilter", spinner)
    // }

}

var positionParentReport = 0
var idGraficoCurrent = ""
var currentDataGrafico = []
var currentLabelsLeyendaGrafico = []
var currentOptionsGrafico;


function setGraficoBarras(dataDB, idChartjs, positionParentReportHTML, nombreFiltro, isChild) {


    idGraficoCurrent = idChartjs;


    var label_selectablePonente03 = document.getElementById("label_selectablePonente03")
    var selectable03 = document.getElementById("selectable03")
    var label_selectable03 = document.getElementById("label_selectable03")
    var btnExcel03 = document.getElementById("btnExcel03")
    if (positionParentReport != 2) {
        label_selectablePonente03.style.display = "none"
        label_selectable03.style.display = "none"
        selectable03.style.display = "none"
        btnExcel03.style.display = "none"
    }
    let datasetsGrafico = []
    let labelsDynamic = []
    let listComboSala = []
    let item;
    var SELECT_ANIO = document.getElementById("selectableAnio")
    let TempComboAniosList = []
    let labelsTemp = [];

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
        AliasText = nombreFiltro == "00_anno" ? "A??O" : nombreFiltro;
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
            txtdate1Param = txtInputdate1Param.value
            txtdate2Param = txtInputdate2Param.value
            if (aniooSeleccionado == txtInputdate1Param.value.split("-")[0]) {
                txtdate2Param = aniooSeleccionado + "-" + "12-31"
            } else if (aniooSeleccionado > txtInputdate1Param.value.split("-")[0] && aniooSeleccionado < txtInputdate2Param.value.split("-")[0]) {
                txtdate1Param = aniooSeleccionado + "-" + "01-01"
                txtdate2Param = aniooSeleccionado + "-" + "12-31"
            } else if (aniooSeleccionado == txtInputdate2Param.value.split("-")[0]) {
                txtdate1Param = aniooSeleccionado + "-" + "01-01"
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
            display: false, text: 'COMPARACION SALAS POR A??O', fontColor: '#000000',
        }, scales: {
            yAxes: [{
                scale: 1, gridLines: {
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

    setDataTableParent(data,)

}

function setDataTableParent(data) {
    var headerParent = document.getElementById("headerParent")
    var body = document.getElementById("bodyParent")
    let bodyHTML = ""
    let headerHTML = ""
    let arrayTotalesVertical = []
    headerHTML += "<th>A??o</th>"
    data.datasets.forEach((it, index) => {
        let acumuladorHorizontal = 0
        bodyHTML += "<tr>"
        bodyHTML += "<td>" + it.label.substring(4, it.length) + "</td>"
        it.data.forEach((data, position) => {
            bodyHTML += "<td>" + data + "</td>"
            acumuladorHorizontal += data;
            arrayTotalesVertical[position] = (arrayTotalesVertical[position] || 0) + data
        })
        bodyHTML += "<td class='tableTotales'>" + acumuladorHorizontal + "</td>"
        bodyHTML += "</tr>"
    })

    console.log(arrayTotalesVertical)

    bodyHTML += "<tr class='tableTotales'>"
    bodyHTML += "<td> TOTAL POR SALAS</td>"

    arrayTotalesVertical.forEach(totalIT => {
        bodyHTML += "<td>" + totalIT + " </td>"
    })

    bodyHTML += "</tr>"
    data.labels.forEach((it, index) => {
        headerHTML += "<th>" + it + "</th>"
    })
    headerHTML += "<th>TOTAL POR A??O</th>"
    bodyHTML += ""
    headerParent.innerHTML = headerHTML
    body.innerHTML = bodyHTML
}


function setInformacionTablas(nombreServicioTabla01, nombreServicioTabla02, isNoInstanciaNeed, nombreServicioTabla03) {
    setTimeout(() => {
        let WSParam = `${nombreServicioTabla02}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;
        obtenerDatosTabla(positionParentReport, "", "02", WSParam);
        // if (nombreServicioTabla03 != "") {
        //     obtenerServicio03(nombreServicioTabla03);
        // }
    }, 0)
    setTimeout(() => {
        let WSParam = `${nombreServicioTabla01}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;
        obtenerDatosTabla(positionParentReport, "", "01", WSParam);
    }, 500)


}

function obtenerServicio03(nombreServicioTabla03) {
    let ContentReporte03 = document.getElementById('ContentReporte03')
    ContentReporte03.style.display = "block"
    setTimeout(() => {
        let select = document.getElementById("selectablePonente03")
        let textLabel = select.options[select.selectedIndex].text;
        let WSParam = `${nombreServicioTabla03}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param + "/" + textLabel;
        obtenerDatosTabla(positionParentReport, "", "03", WSParam);
        setVisibleGraficoTabla("none", "03")


    }, 1000)
}

function lisarTablas(c_instacia, nombreSala) {

    nombreSalaSeleccionada = nombreSala
    cInsatnciaSelected = c_instacia
    var h3_titulos = document.getElementById("tituloSalaFiltro")
    h3_titulos.innerText = "Sala Seleccionada : " + nombreSalaSeleccionada
    var table01 = document.getElementById("table01")
    var table02 = document.getElementById("table02")
    var table03 = document.getElementById("table02")
    let ContentDIV_Child_table01 = document.getElementById('ContentDIV_Child_table01')
    let ContentDIV_Child_table02 = document.getElementById('ContentDIV_Child_table02')
    let ContentDIV_Child_table03 = document.getElementById('ContentDIV_Child_table03')
    let btnPrint01 = document.getElementById('btnPrint01')
    let btnPrint02 = document.getElementById('btnPrint02')
    let label_selectable01 = document.getElementById('label_selectable01')
    let label_selectable02 = document.getElementById('label_selectable02')
    let ContentReporte03 = document.getElementById('ContentReporte03')
    let total01 = document.getElementById('total01')
    let total02 = document.getElementById('total02')
    total01.innerText = "0"
    total02.innerText = "0"

    ContentReporte03.style.display = 'none'
    label_selectable01.style.display = 'none'
    label_selectable02.style.display = 'none'
    btnPrint01.style.display = 'none'
    btnPrint02.style.display = 'none'
    ContentDIV_Child_table01.style.display = 'none'
    ContentDIV_Child_table02.style.display = 'none'
    ContentDIV_Child_table03.style.display = 'none'
    table01.style.display = 'none'
    table02.style.display = 'none'
    table03.style.display = 'none'
    if (positionParentReport == 1) {
        setInformacionTablas("getListadoIngresoMensualxTipRecurso", "getListadoIngresoMensualxCorteProced", false, "");
    }
    if (positionParentReport == 2) {
        setInformacionTablas("getListadoProgramacionesPonente", "getListadoProgramacionesFirmadoPonente", false, "getListadoProgramacionesPonenteRecurso");
    }
    if (positionParentReport == 3) {
        setInformacionTablas("getListaTipoEscritos", "getListadoEscritosPendienteAtendido", false, "");
    }
}


function getSoapTest() {
    // obtenerDatosWS("getTestSoap").then(response => response.json())
    //     .then((data) => {
    //         console.log(data)
    //     }, onerror => {
    //         showErrorAlerMessaje("Servicio no disponible", "", "")
    //     })
}

getSoapTest()

var nombreSalaSeleccionada = ""
var cInsatnciaSelected = ""
var aniooSeleccionado = ""

