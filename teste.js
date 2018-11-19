
const API = require("./graphApi") 
API.parseGraph("./files/grafo-teste.txt")
    .then((graph) => {
        console.log(graph)
        
        API.bfs(graph, 6, [])
        console.log("Numero de vertices: "               + graph.totalVertexes())
        // console.log("Numero de componentes conexas: " +API.numCompConexas(graph))
        console.log("Grau do vertice "                   + graph.vertexDegree(2))
        console.log("Grau medio "                        + graph.mediumDegree())
        console.log("Densidade do grafo "                + graph.graphDensity())
        console.log("Coeficiente de agrupamento medio: " + graph.averageGroupingCoefficient())
        console.log("Vizinhos do vertice 5: ")

        graph.neighbours(5).forEach(item => {
            console.log(item)
        })

        console.log("Quantidade de vizinhos: "        + graph.qtdNeighbours(5))
        console.log("Pares conectados de vizinhos: "  + graph.neighboursConnectedPairs(5))
        console.log("Coeficiente de agrupamento v1: " + graph.groupingCoefficient(1))
        console.log("Coeficiente de agrupamento v2: " + graph.groupingCoefficient(2))
        console.log("Coeficiente de agrupamento v3: " + graph.groupingCoefficient(3))
        console.log("Coeficiente de agrupamento v4: " + graph.groupingCoefficient(4))
        console.log("Coeficiente de agrupamento v5: " + graph.groupingCoefficient(5))
        console.log("Coeficiente de agrupamento v6: " + graph.groupingCoefficient(6))
        console.log("Coeficiente medio: "             + graph.averageGroupingCoefficient())

        console.log("Vertice 5 é extremo: " + graph.isExtremeVertice(5))
        console.log("Porcentagem de extremo: " + parseFloat(graph.extremesPercentage().toFixed(2)))
       
    })