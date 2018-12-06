
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
        biggest: Array.from(vertexes).reduce((a, b) => Math.max(a, b)),
        lowest: Array.from(vertexes).reduce((a, b) => Math.min(a, b))
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

function bfs(graph, rootVertex, visitedVertexes){
    let queue = []
    let visited = []
    visited.push(rootVertex) //marque a raiz
    visitedVertexes.push(rootVertex)
    queue.push(rootVertex)  //insira a raiz na fila
    while(queue.length){
        let firstVertex = queue[0] //tira o primeiro elemento e o retorna
        // console.log("firstVertex: " + firstVertex)
        // console.log( graph.edges.get(firstVertex))                
        graph.edges.get(firstVertex).forEach(vertex => {
            if(!visited.includes(vertex)){
                visited.push([firstVertex, vertex])
                visited.push(vertex) //marque o vertice
                queue.push(vertex)  //insire o vertice
                visitedVertexes.push(vertex)
            } else if (queue.includes(vertex)){ 
                visited.push([firstVertex, vertex])
            }
        })
        queue.shift()      
    }
}

function numCompConexas(graph){
    let rootQueue = new Set(graph.vertexes)
    let quantity = 0
    let rootVisited = [] 
    rootQueue.forEach(vertex =>{
        let visited = []
        if(!rootVisited.includes(vertex)){
        ++quantity
        bfs(graph, vertex, visited)
        visited.forEach(elem => rootVisited.push(elem))
        }
    })
    return quantity
}

module.exports = {
    parseFile,
    parseGraph,
    compareFileGraph,
    bfs,
    numCompConexas
}