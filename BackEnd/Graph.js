class Graph {
    constructor(vertexes) {
        this.numEdges = 0 //arestas
        this.vertexes = new Set() // vertices que nao se repetem
        this.edges = new Map() //lista de adjacencias
        vertexes.map(vertex => {
            this.edges.set(vertex, new Set())
        })
    }

    printAdjList() {
        var texto = ""
        this.edges.forEach((valor, chave) => {
            var valores = [...valor].join(', ')
            texto += `${chave} => ${valores} <br>`
        })
        return texto
    }

    printVerticesDegrees() {
        var result = "" //Sera printado no frontEnd

        var arrayVertexDegress = [...this.vertexes].map(elem => {
            return {
                index: elem,
                grau: this.vertexDegree(elem)
            }
        })

        arrayVertexDegress.forEach((vertex) => {
            result += `[${vertex.index}]: grau ${vertex.grau}. <br>`
        })
        return result
    }
    

    insertEdge(n1, n2) {
        if (!this.existEdge(n1, n2)) {
            console.log("foi inserido " + n1 + " =>" + n2)
            //adiciona aresta nos dois sentidos
            this.edges.get(n1).add(n2)
            this.edges.get(n2).add(n1)

            this.numEdges++

            this.vertexes.add(n1)
            this.vertexes.add(n2)
            return this //somente para poder encadear funcoes após usar esse metodo
        }
    }
    // Verifica se existe determinado vertice
    existEdge(n1, n2) {
        return this.edges.get(n1).has(n2)
    }

    vertexes() {
        return Array.from(this.edges.keys())
    }

    totalVertexes() {
        return this.vertexes.size
    }

    vertexDegree(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")
        // como vertexes eh um Set, ele nao aceita usar reduce,logo temos que transformar o set para array
        // no reduce o primeiro parametro é a funcao e o segundo sera o valor inicial do acumulador
        return [...this.vertexes].reduce((b, a) => b + (this.existEdge(vertex, a) ? 1 : 0), 0)
    }

    mediumDegree() {
        let medium = 0
        this.vertexes.forEach(vertex => medium += this.vertexDegree(vertex))
        return Math.floor(medium / this.vertexes.size)
    }

    graphDensity() {
        let numVertices = this.totalVertexes()
        let numArestas = this.numEdges
        return Math.floor(2 * numArestas / numVertices * (numVertices - 1))
    }

    // retorna os vizinhos de determinado vertice
    neighbours(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")
        return this.edges.get(vertex)

    }

    qtdNeighbours(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")
        return this.neighbours(vertex).size
    }

    neighboursConnectedPairs(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")

        let count = 0
        let neighbours = this.neighbours(vertex)
        neighbours.forEach(neighbour => {
            this.edges.get(neighbour)
            neighbours.forEach(subNeighbours => {
                if (this.existEdge(neighbour, subNeighbours))
                    count++
            })
        })
        return count / 2
    }

    groupingCoefficient(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")

        let numNeighbours = this.qtdNeighbours(vertex)
        let coef = 0
        if (numNeighbours > 1) {
            coef = ((2 * this.neighboursConnectedPairs(vertex)) / (numNeighbours * (numNeighbours - 1))).toFixed(2)
        }
        return parseFloat(coef)
    }

    averageGroupingCoefficient() {
        let totalCoeficient = 0
        this.vertexes.forEach(vertex => {
            totalCoeficient += this.groupingCoefficient(vertex)
        })
        return (parseFloat(totalCoeficient) / this.totalVertexes()).toFixed(2)
    }




    isExtremeVertice(vertex) {
        if (!this.vertexes.has(vertex))
            throw new Error("Vertice não existente no conjunto de vertices do grafo")

        return (this.vertexDegree(vertex) === 1)
    }

    extremesPercentage() {
        let totalExtremeVertices = 0
        this.vertexes.forEach(vertex => {
            if (this.isExtremeVertice(vertex))
                totalExtremeVertices++
        })
        return totalExtremeVertices / this.totalVertexes()
    }

}

module.exports = Graph