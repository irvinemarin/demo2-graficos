var spinnerGrafico;
var optionColumns = 1;
var isNoVisibleAllAniosSelected = false;


function getInfoTabla(positionParentReport, idChartjs, nroTable, nameWS) {
    let spinner = document.getElementById("spinner" + nroTable)
    let txtResultado = document.getElementById("txtResultado" + nroTable)
    let txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    let btnExcel = document.getElementById("btnExcel" + nroTable)
    let tabla = document.getElementById("table" + nroTable)
    txtResultado.style.display = "none"
    // tabla.style.display = "none"

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
                let total01 = document.getElementsByClassName('total-text')
                for (const total01Element of total01) {
                    total01Element.style.display = 'block'
                }
            } else {
                txtInformacionFiltro.style.display = 'none'
                txtResultado.style.display = 'block'
            }
        }, onerror => {
            spinner.style.display = 'none'
            // showErrorAlerMessaje("Servicio no disponible", "", "")
            //alert("Servicio no Disponible")
        })

}

function bindtabla(data, nroTable, idChartjs, spinner, positionParentReport) {

    var headerTable01 = document.getElementById("headerTable" + nroTable)
    var bodyTable01 = document.getElementById("bodyTable" + nroTable)
    var txtResultado = document.getElementById("txtResultado" + nroTable)
    var txtInformacionFiltro = document.getElementById("txtInformacionFiltro" + nroTable)
    // var label = document.getElementById("label_selectable" + nroTable)
    var tabla = document.getElementById("table" + nroTable)
    let htmlHeader = ''
    if (data.length == 0) {
        txtResultado.style.display = "block"
        return;
    }
    // tabla.style.display = "block"
    // txtResultado.style.display = "none"
    let headerListTable = []

    headerListTable = Object.keys(data[0]).sort((a, b) => {
        return a.localeCompare(b)
    })


    //bind HEAder
    let NombreFiltroTabla = ""
    headerListTable.forEach((key, index) => {
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
    // label.innerText = NombreFiltroTabla;
    if (data.length > 0) txtInformacionFiltro.innerHTML = "REPORTE <br> De " + formatDate(txtdate1Param) + " hasta " + formatDate(txtdate2Param);

    function formatDate(date) {
        return date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0]
    }


    //FIN
    bindTableBody(data, headerListTable, bodyTable01, false, NombreFiltroTabla, nroTable)
}


function bindTableBody(data, headerListTable, bodyTable01, optionSelect, NombreFiltroTabla, nroTable) {
    var html = '';
    let arrayTotalesHorizontal = []
    let listComboFiltro = []
    let valuesGraficoTablaAllRows = []
    let leftHeaderGrafico = []

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
                        NameHeaderItem += value + "-"
                    }
                    html += "<td>" + value + "</td>"
                }
            })
        })

        leftHeaderGrafico.push(NameHeaderItem)
        valuesGraficoTablaAllRows.push(valuesGraficoTabla)
        html += "<td style='background-color: #fcf5c6!important; color: black!important;'>" + AculumladoHorizontal + "</td>"
        html += "</tr>"
    })
    html += "<tr class='tableTotales' >"
    html += "<td>Totales</td>"

    let totalValue = 0;

    Object.values(arrayTotalesHorizontal).forEach(item => {
        html += "<td>" + item + "</td>"
        totalValue += item;
    })
    html += "</tr>"
    bodyTable01.innerHTML = html
    var totalEL = document.getElementById(`total${nroTable}`)
    totalEL.innerText = totalValue;
    totalEL.style.display = 'block'
    var LabelTitleGrafico = document.getElementById(`tituloReporteChild_table${nroTable}`)
    var canvas = document.getElementById(`chartChild_table${nroTable}`)

    // DIV_GRAFICO_CHILD.style.display = "none"

    LabelTitleGrafico.innerText = "Gráfico por " + NombreFiltroTabla;


    console.log(LabelTitleGrafico)

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

    canvas.remove()

    let datasetsGrafico = []


    let tipoGrafico = 'line'

    if (nroServiceTabla == "02") {
        tipoGrafico = 'bar'
    }


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


    const options = {
        legend: {
            labels: {
                position: "right", fontColor: '#000000',
            }
        }, title: {
            display: false, text: '', fontColor: '#000000',
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


    new Chart("chartChild_table" + nroTable, {
        type: tipoGrafico, data: dataGraficoChartJS, options
    })

    let total01 = document.getElementById('total-text' + nroTable)

    // total01.style.display = 'block'


}

var positionParentReport = 0
var idGraficoCurrent = ""
var currentDataGrafico = []
var currentLabelsLeyendaGrafico = []
var currentOptionsGrafico;


function setInformacionTablas(nombreServicioTabla01, nombreServicioTabla02, isNoInstanciaNeed) {
    let WSParam = "";
    if (nroServiceTabla == 1) {
        WSParam = `${nombreServicioTabla01}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;
    }
    if (nroServiceTabla == 2) {
        WSParam = `${nombreServicioTabla02}/${cInsatnciaSelected}` + "/" + txtdate1Param + "/" + txtdate2Param;

    }
    getInfoTabla(positionParentReport, "", "01", WSParam);


}


function lisarTablas(c_instacia, nombreSala) {

    nombreSalaSeleccionada = nombreSala
    cInsatnciaSelected = c_instacia
    var h3_titulos = document.getElementById("tituloSalaFiltro")
    let ContentDIV_Child_table01 = document.getElementById('ContentDIV_Child_table01')
    h3_titulos.innerText = "Sala : " + nombreSalaSeleccionada.toUpperCase()
    let total01 = document.getElementsByClassName('total-text')
    for (const total01Element of total01) {
        total01Element.style.display = 'none'
    }

    // ContentDIV_Child_table01.style.display = 'block'
    // table01.style.display = 'none'
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

