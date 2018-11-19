// Importação de libs e arquivos externos
const http = require("http");
const graphApi = require("./graphApi");
const PORTA = 80;
// HEADER da Requisição
const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

// configuração do servidor que será levantado na porta 80
const app = http.createServer(onConnection);
app.listen(PORTA); //
app.on("listening", () => console.log("Escutando na porta " + PORTA));

// callback  que vai ler o grafo de maneira assincrona e retorna o grafo 
function onConnection(req, res) {
    leGrafo(req, res)
        .catch(e => {
            res.writeHead(500, HEADERS);
            res.end(JSON.stringify({
                success: false,
                error: e.message
            }));
        });
}

async function leGrafo(req, res) {
    let path = req.url; //pega url da requisicao
    path = path.substring(1); // tira a Barra '/'
    path = decodeURIComponent(path); //decodifica a URI, tirando os caracteres especiais

    let graph = await graphApi.parseGraph(path); // grafo espera o retorno do parseGraph

    let objGrafo = {...graph};
    objGrafo.vertexes = [...objGrafo.vertexes]; // transforma o Set em Array
    objGrafo._edges = objGrafo.edges;

    objGrafo.edges = new Object();
    [...objGrafo._edges.keys()].forEach(k => objGrafo.edges[k] = [...objGrafo._edges.get(k)]);
    delete objGrafo._edges;

    // ATRIBUTOS DO OBJETO RETORNADO COMO RESPOSTA
    objGrafo.arquivo = path.substring(6);
    objGrafo.totalVertexes = graph.totalVertexes();
    objGrafo.vertexDegree = graph.vertexDegree(2);
    objGrafo.mediumDegree = graph.mediumDegree();
    objGrafo.graphDensity =  graph.graphDensity();
    objGrafo.avGroupCoef = graph.averageGroupingCoefficient();
    objGrafo.neighbours = graph.qtdNeighbours(5);
  

    //OBJETO RESPOSTA DA REQUISICAO
    objGrafo = {
        success: true, 
        grafo: objGrafo
    };

    objGrafo = JSON.stringify(objGrafo);
    res.writeHead(200, HEADERS);
    res.end(objGrafo);
}