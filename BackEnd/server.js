// Importação de libs e arquivos externos
const http = require("http");
const graphApi = require("./GraphApi");
const graphUtils = require("./GraphUtils");
const PORTA = 80;
// HEADER da Requisição
const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

// configuração do servidor que será levantado na porta 80
const app = http.createServer(onConnection);
app.listen(PORTA);
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
    path = "../" + path; //voltar uma pasta 
    try {
        let graph = await graphApi.parseGraph(path); // grafo espera o retorno do parseGraph
        let objGrafo = {...graph};
        objGrafo.vertexes = [...objGrafo.vertexes]; // transforma o Set em Array
        
        // gambiarra abaixo
        objGrafo._edges = objGrafo.edges;
        objGrafo.edges = new Object();
        [...objGrafo._edges.keys()].forEach(k => objGrafo.edges[k] = [...objGrafo._edges.get(k)]);
        delete objGrafo._edges;

        // ATRIBUTOS DO OBJETO RETORNADO COMO RESPOSTA
        objGrafo.arquivo = path.substring(9);
        objGrafo.totalVertexes = await graph.totalVertexes();
        objGrafo.vertexes = await graph.listaVertexes();
        objGrafo.mediumDegree = await graph.mediumDegree();
        objGrafo.graphDensity = await graph.graphDensity();

        // metodos do graphUtils
        objGrafo.avGroupCoef = await graphUtils.averageGroupingCoefficient(graph);
        objGrafo.printAdjList = await graphUtils.printAdjList(graph);
        objGrafo.vertexDegrees =  await graphUtils.printVerticesDegrees(graph);
        objGrafo.numCompConexas = await graphUtils.numCompConexas(graph);

        objGrafo.averageEFEC = await graphUtils.averageEffectiveEccentricity(graph);
        objGrafo.effectiveDiameter = await graphUtils.effectiveDiameter(graph);
        objGrafo.effectiveRadius = await graphUtils.effectiveRadius(graph);
        objGrafo.averageCentrality = await graphUtils.averageCentrality(graph);
        objGrafo.centralVerticesPercentage = await graphUtils.centralVerticesPercentage(graph);


        //OBJETO RESPOSTA DA REQUISICAO
        objGrafo = {
            success: true,
            grafo: objGrafo
        };

        objGrafo = JSON.stringify(objGrafo);
        res.writeHead(200, HEADERS);
        res.end(objGrafo); // a respota contem um objeto com os campos success e o grafo construido

    } catch (err) {
        console.log("Erro no servidor: " + err);
    }

}