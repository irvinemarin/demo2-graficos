function obtenerDatosTablaWS(ws) {
    return fetch(gethostApi() + ws, {
        method: 'get', headers: new Headers({
            'authorization': 'eyJhbGciOiJIUzI1NiJ9.c3VwcmVtYQ.cpUyTYcgm8ixIVDTLe-Fua0RLkyUKg8yy2IkAOfKi2I',
            'Content-Type': 'application/json'
        })
    })
}
