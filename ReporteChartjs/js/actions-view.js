var txtInputdate1Param = document.getElementById("fInicio");
var txtInputdate2Param = document.getElementById("fFin")
var txtdate1Param;
var txtdate2Param;
var comboGrafico = document.getElementById("comboGrafico");

var SELECT_ANIO = document.getElementById("selectableFiltroSala")
var DIV_GRAFICO_CHILD = document.getElementById("ContentDIV_Child_7")
var Contentchart7 = document.getElementById("Content_chartChild_7")
var canvasChild = document.getElementById("chartChild_7")

var datosItemReporte = {
    position: 0, titulo: "", htmlItem: "",
}


setInitRangeDate()

function openPrintTable(nrotable) {
    var newURL = window.location.protocol + "//" + window.location.host;
    console.log(newURL)
    let w = 900;
    let h = window.innerHeight;


    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);


    var selectFiltroSalas = document.getElementById("selectableFiltroSala")
    // console.log(selectFiltroSalas)
    let nombreSala = selectFiltroSalas.options[selectFiltroSalas.selectedIndex].text
    window.open(`${newURL}/print-table.html?inst=${selectFiltroSalas.value}&sala=${nombreSala}&posParent=${positionParentReport}&d1=${txtdate1Param}&d2=${txtdate2Param}&nroservice=${nrotable}`, "printing", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

}


function exportReportToExcel(NroTable) {
    // var tabla = document.getElementById("table" + NroTable);


    var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange;
    var j = 0;
    tab = document.getElementById('table' + NroTable); // id of table

    for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "Reporte Tabla" + NroTable + " .xls");
    } else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);


}


function onClickGraficarSala(nroTabla) {
    let PositionLabel = 0;
    currentLabelsLeyendaGrafico.forEach((labelName, pos) => {
        if (labelName == SELECT_ANIO.options[SELECT_ANIO.selectedIndex].text) {
            PositionLabel = pos;
        }
    })
    let tempDataPorSala = [...currentDataGrafico];
    for (var i = 0; i < tempDataPorSala.length; i++) {
        console.log(tempDataPorSala[i])
        let Item = tempDataPorSala[i]
        let DataSetsSala = []
        for (var j = 0; j < tempDataPorSala[i].data.length; j++) {
            let value = tempDataPorSala[i].data[j];

            if (j == PositionLabel) {
                DataSetsSala.push(value)
            }
        }
        Item["data"] = DataSetsSala;
        Item["testProperty"] = 'sometext'
    }
    DIV_GRAFICO_CHILD.style.display = "block"
    DIV_GRAFICO_CHILD.style.width = "block"
    canvasChild.remove()
    const dataGraficoChartJS = {
        labels: [SELECT_ANIO.options[SELECT_ANIO.selectedIndex].text], datasets: currentDataGrafico,
    };
    Contentchart7.innerHTML = ' <canvas id="chartChild_7"></canvas>'
    let chart = new Chart("chartChild_7", {type: "bar", data: dataGraficoChartJS, currentOptionsGrafico})

}


function showSuccessAlerMessaje(titulo, mensaje, action) {
    Swal.fire({
        icon: 'Información', title: titulo, text: mensaje, footer: ''
    })
}

function showErrorAlerMessaje(titulo, mensaje, action) {
    Swal.fire({
        icon: 'error', title: titulo, text: mensaje, footer: ''
    })
}


comboGrafico.addEventListener('change', function (e) {
    var canvas = document.getElementById(idGraficoCurrent)
    canvas.remove()
    const data = {
        labels: currentLabelsLeyendaGrafico, datasets: currentDataGrafico
    };
    var Contentchart7 = document.getElementById("Content" + idGraficoCurrent)
    Contentchart7.innerHTML = ' <canvas id="' + idGraficoCurrent + '"></canvas>'
    if (this.value != "pie") {
        currentDataGrafico.forEach((it, index) => {
            it.backgroundColor = [styles.color.alphas[index]];
            it.borderColor = [styles.color.solids[index],]
            it.borderWidth = 1;
        })
    }
    new Chart(idGraficoCurrent, {type: this.value, data, currentOptionsGrafico})
});


txtInputdate1Param.addEventListener("change", function () {
    txtdate1Param = txtInputdate1Param.value;
})
txtInputdate2Param.addEventListener("change", function () {
    txtdate2Param = txtInputdate2Param.value;
})


function setInitRangeDate(positionMenuList) {
    let hoy = new Date()
    let mounth = (hoy.getMonth() + 1) < 10 ? "0" + (hoy.getMonth() + 1) : hoy.getMonth() + 1
    let day = (hoy.getDate()) < 10 ? "0" + (hoy.getDate()) : hoy.getDate()
    let ToDate = hoy.getFullYear() + "-" + mounth + "-" + day
    let anioInicio = ''
    if (positionMenuList == "1") {
        anioInicio = hoy.getFullYear() - 3;
    } else {
        anioInicio = hoy.getFullYear() - 2;
    }
    let ToDate12Ago = anioInicio + "-" + mounth + "-" + day
    txtInputdate2Param.value = ToDate
    txtInputdate1Param.value = ToDate12Ago
    txtdate1Param = txtInputdate1Param.value;
    txtdate2Param = txtInputdate2Param.value
}

function setActiveSeleccionMenu(htmlReferenceMenuItem) {
    var listaItems = document.getElementsByClassName("item-report")
    for (var i = 0; i < listaItems.length; i++) {
        listaItems[i].classList.remove("activate");
    }
    htmlReferenceMenuItem.classList.add("activate");
}


function setTitulosGraficos(titulo) {
    let ittulo = document.getElementById("tituloReporte1")
    let ittulo2 = document.getElementById("tituloReporte2")
    let ittulo3 = document.getElementById("tituloReporte3")
    ittulo.innerText = titulo;
    ittulo2.innerText = titulo;
    ittulo3.innerText = titulo;
}

function getWSNameParentByPosition(position) {
    let nommbreServicio = "";
    // figure.style.display = "none"
    if (position == 1) {
        nommbreServicio = "getListadoExpIngresos/";
    }
    if (position == 2) {
        nommbreServicio = "getListadoProgramaciones/";
    }
    if (position == 3) {
        nommbreServicio = "getListadoEscritosAnual/";
    }
    return nommbreServicio;
}


function onCLickItemReporteListenerListener(position, titulo, htmlReferenceMenuItem, isClickedMenuList) {
    if (isClickedMenuList) {
        setInitRangeDate(position)
    }
    spinnerGrafico = document.getElementById("spinnerGrafico");
    mainPanelDiv = document.getElementById("mainPanelDiv");
    //getDatosItemReporte
    datosItemReporte.position = position
    datosItemReporte.titulo = titulo
    datosItemReporte.htmlItem = htmlReferenceMenuItem
    //FIN getDatosItemReporte
    spinnerGrafico.style.display = "block"
    mainPanelDiv.style.display = "none"
    setTitulosGraficos(titulo)
    setActiveSeleccionMenu(htmlReferenceMenuItem)
    setFetchInicial(position, titulo);
}

function setFetchInicial(position, titulo) {
    fetch(gethostApi() + getWSNameParentByPosition(position) + txtdate1Param + "/" + txtdate2Param, {
        method: 'get', headers: new Headers({
            'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then((data) => {
            // DatosGrafico = data
            if (data.length > 0) {
                printCharts(data, position, titulo)
                mainPanelDiv.style.display = "block"
            } else {
                setInitRangeDate()
                mainPanelDiv.style.display = "block"
                spinnerGrafico.style.display = "none"
                showErrorAlerMessaje("No se encontraron Resultados", "", "")
            }
        }, onerror => {
            setInitRangeDate()
            mainPanelDiv.style.display = "block"
            spinnerGrafico.style.display = "none"
            mainPanelDiv.style.display = "none"
            showErrorAlerMessaje("Servicio no Disponible", "", "")
        })
}

function onClickBuscarListener() {
    var diference = getMonthDifference(new Date(txtdate1Param), new Date(txtdate2Param));

    // switch (datosItemReporte.position) {
    //
    // }

    // console.log(datosItemReporte.position)

    let diferenciaMeses = 24;

    if (datosItemReporte.position != 1 && diference <= diferenciaMeses) {
        onCLickItemReporteListenerListener(datosItemReporte.position, datosItemReporte.titulo, datosItemReporte.htmlItem, false)
    } else if (datosItemReporte.position == 1) {//cuando item reporte sea ingresos
        onCLickItemReporteListenerListener(datosItemReporte.position, datosItemReporte.titulo, datosItemReporte.htmlItem, false)
    } else if (diference > diferenciaMeses) showErrorAlerMessaje(diference + " meses de diferencia", "Rango de Fechas  no validas , debe ingresar un rango menor a " + diferenciaMeses + " meses ", "")

}

function getMonthDifference(startDate, endDate) {
    return (endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()));
}

