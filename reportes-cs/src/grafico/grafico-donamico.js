import './grafico-dinamico.css';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useEffect, useState} from "react";
import React from 'react'
import config from "../config";

ChartJS.register(CategoryScale, LinearScale, RadialLinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


function GraficoDinamico({option}) {
    const options = {
        // indexAxis: 'y',
        plugins: {
            datalabels: {
                color: 'white', display: function (context) {
                    return context.dataset.data[context.dataIndex] > 100;
                }, font: {
                    weight: 'bold'
                }, formatter: Math.round
            }, legend: {
                position: 'right',
            },
        }, //Core options
        aspectRatio: 5 / 3, layout: {
            padding: {
                top: 24, right: 16, bottom: 0, left: 8
            }
        }, elements: {
            line: {
                fill: true
            }, point: {
                hoverRadius: 7, radius: 5
            }, bar: {
                borderColor: "#6c0000", borderWidth: 2,
            }
        }, scales: {
            x: {
                stacked: false
            }, y: {
                stacked: false
            }
        }


    };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    // let data = {}


    const [dataGraficoView, setDataGraficoView] = useState({labels: [], datasets: []})
    // const [labelsTop, setLabelsTopView] = useState([])



    // console.log(env("TOKEN"))

    const fetchData = () => {
        fetch(`${process.env.URL_BASE}getListadoExpIngresos/2021-08-01/2022-12-01`, {
            method: 'get', headers: new Headers({
                'authorization': process.env.TOKEN, 'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then((data) => {
                if (data.length > 0) {
                    let DataGrafico = {}
                    let tempListRow = []
                    let templabelsTop = []
                    let labelsTop = []
                    let rowData = []

                    let colors = [{solid: 'rgb(255,103,103,1)'}, {solid: 'rgb(22,130,255)'},]
                    data.forEach((itemRep, index) => {
                        if (index === 0) {
                            templabelsTop = Object.keys(itemRep);
                            templabelsTop.splice(0, 1)
                            templabelsTop.sort((a, b) => {
                                return a.localeCompare(b)
                            })

                            templabelsTop.forEach(item => {
                                labelsTop.push(item.split("_")[1])
                            })
                        }


                        rowData = Object.values(itemRep);
                        rowData.splice(0, 1)


                        let item = {
                            label: itemRep["00_anno"] !== undefined ? itemRep["00_anno"] : "row" + index + 1,
                            data: rowData,
                            backgroundColor: colors[index].solid,
                            datalabels: {
                                align: 'start', anchor: 'end'
                            }
                        }
                        tempListRow.push(item)

                    })

                    DataGrafico = {
                        labels: labelsTop, datasets: tempListRow
                    }
                    setDataGraficoView(DataGrafico)
                    console.log(DataGrafico)

                }
            }, onerror => {
                // console.log(onerror)
            })
    }


    useEffect(() => {


        console.log(config.url)
        console.log(config.token)

        fetchData()
    }, [])

    return (

        <div style={{paddingLeft: '20%'}}>
            <div id="content01" className="col-11">
                <figure>

                    <div className="container-title">
                        <h3 id="tituloReporte1">Titulo demo</h3>
                    </div>
                    {/*<div itemID="Contentchart7">*/}
                    {/*    /!*<Bubble options={optionsBuble} data={data}/>*!/*/}
                    {/*</div>*/}
                    <div itemID="Contentchart72">
                        <Bar options={options} data={dataGraficoView}/>
                    </div>


                </figure>
            </div>
        </div>);
}

export default GraficoDinamico;
