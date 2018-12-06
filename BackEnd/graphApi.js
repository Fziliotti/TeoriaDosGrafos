const Graph = require('./Graph')
const fs = require('fs')


// UMA PROMISE NUNCA DISPARA THROWS, PARA ISSO EXISTE O REJECT
function parseFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (error, data) => {
            if (error) return reject(new Error("Caminho inválido"))

            let array = data.split("\n")
                .map(l => l.replace("\r", "").split("\t").map(Number))
            resolve(array)
        })
    })
}

function arrayInfo(data) {
    let vertexes = new Set()
    data.map(edge => {
        vertexes.add(edge[0])
        vertexes.add(edge[1])
    })
    return {
        vertexes: Array.from(vertexes),
        // biggest: Array.from(vertexes).reduce((a, b) => Math.max(a, b)),
        // lowest: Array.from(vertexes).reduce((a, b) => Math.min(a, b))
    }
}

// para nao ter que reemitir o erro, foi colocado a sintaxe async e await
async function parseGraph(path) {
    let data = await parseFile(path)
    let graph = new Graph(arrayInfo(data).vertexes)
    data.map(edge => graph.insertEdge(edge[0], edge[1]))
    return graph
}

function compareFileGraph(path, graph) {
    return new Promise(resolve => {
        parseFile(path).then(array => {
            let validation = true
            array.map(edge => validation *= graph.existEdge(edge[0], edge[1]))
            resolve(new Boolean(validation).valueOf())
        })
    })
}


module.exports = {
    parseFile,
    parseGraph,
    compareFileGraph
}