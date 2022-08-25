import './left-menu.css';
import React from 'react'

function LeftMenu() {
    return (
        <div
            className="leftPanel no-print " id="leftPanel">
            <div className="contentBackground">
                <h5>Reportes Disponibles</h5>
                <div className="listaReportes" id="listaReportesDIV">
                    <div className="item-report "
                         // onClick="onCLickItemReporteListenerListener('1','REPORTE DE INGRESOS',this)"
                    >
                        <p>REPORTE DE INGRESOS </p>
                    </div>
                    <div className="item-report item2"
                         // onClick="onCLickItemReporteListenerListener('2','REPORTE PROGRAMADOS',this)"
                    >
                        <p>REPORTE PROGRAMADOS</p>
                    </div>
                    <div className="item-report item3"
                         // onClick="onCLickItemReporteListenerListener('3','REPORTE ESCRITOS',this)"
                    >
                        <p>REPORTE ESCRITOS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftMenu;
