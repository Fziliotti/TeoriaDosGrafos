
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

function bfs(graph, rootVertex, visited){
    let queue = []
    visited.push(rootVertex) //marque a raiz
    queue.push(rootVertex)  //insira a raiz na fila
    while(queue.length){
        let firstVertex = queue[0] //tira o primeiro elemento e o retorna
        console.log("firstVertex: " + firstVertex)
        console.log( graph.edges.get(firstVertex))                
        graph.edges.get(firstVertex).forEach(vertex => {
            if(!visited.includes(vertex)){
                visited.push([firstVertex, vertex])
                visited.push(vertex) //marque o vertice
                queue.push(vertex)  //insire o vertice
            } else if (queue.includes(vertex)){ 
                visited.push([firstVertex, vertex])
            }
        })
        queue.shift()      
    }
}

function numCompConexas(graph){
    let rootQueue = new Set()
    graph.vertexes.forEach(elem => rootQueue.add(elem))

    let quantity = 1
    let rootVisited = [[]]  
    rootQueue.forEach(vertex =>{
        let visited = []
        bfs(graph, vertex, visited)
        rootVisited.push(visited)
    })

    // console.log(rootVisited)
    rootVisited.forEach(bfsVisited =>{
       let copyBfsVisited = bfsVisited
       rootVisited.forEach(anotherBfsVisited => {
            copyBfsVisited.filter(value => -1 !== anotherBfsVisited.indexOf(value))
            if(copyBfsVisited.lenght == 0) quantity++
            copyBfsVisited = bfsVisited
        })
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