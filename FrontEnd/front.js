const BTNREQUI = document.getElementById('btnRequi')
// const BTNREQUI = $('#btnRequi')
const INPUTELEMENT = document.getElementById('caminhosDosGrafos')
// const INPUTELEMENT = $('#caminhoGrafo')
const LOADER = document.getElementById('loader')
// const LOADER = $('#loader')
const BTNPRINT = document.getElementById('btnPrint')

const HEADER = document.getElementById('header')


// LISTENINGS DO INPUT
BTNREQUI.addEventListener('click', FazerRequisicao)

// INPUTELEMENT.addEventListener('keyup', function (e) {
//     var key = e.which || e.keyCode
//     if (key == 13) {
//         FazerRequisicao()
//     }
// })


function FazerRequisicao() {
    var caminhoGrafo = INPUTELEMENT.value //retirar os espaços do inicio e final
    if (caminhoGrafo) {
        //se o input for valido, mostrar o loader
        LOADER.style.display = "block"
        fetch("http://localhost/" + encodeURIComponent(caminhoGrafo))
            .then(d => d.json())
            .then(r => {
                if (!r.success)
                    throw new Error(r.error)
                console.log(r)
                mostrarInfosDoGrafo(r)
                //após mostrar as informações, esconder o loader
                LOADER.style.display = "none"
            })
            .catch(e => {
                swal({
                    type: 'error',
                    title: 'Opss...',
                    text: "ERRO: " + e.message
                })
                LOADER.style.display = "none"

            })
    } else {
        swal({
            type: 'error',
            title: 'Oops...',
            text: 'Digite alguma coisa na caixa de texto!',
        })
        INPUTELEMENT.focus()

    }

}

function printarpagina() {
    HEADER.style.display = "none"
    requestAnimationFrame(() => {
        window.print()
        HEADER.style.display = "block"
    })

}

function mostrarInfosDoGrafo(r) {
    BTNPRINT.style.display = "block"
    var resp = document.getElementById('respostas')
    resp.innerHTML = `
        <header>
            GRAFO DO ARQUIVO ${r.grafo.arquivo}
        </header>

        <div>
            O grafo possui ${r.grafo.numEdges} arestas.
        </div>

        <div>
            O grafo possui ${r.grafo.totalVertexes} vértices.
        </div>

        <div>
            A lista de adjacências do grafo é: <br> ${r.grafo.printAdjList} 
        </div>

        <div>
            Os graus dos vértices são: <br> ${r.grafo.vertexDegrees}
        </div>

        <div>
            O grau médio do grafo é ${r.grafo.mediumDegree}.
        </div>

        <div>
            A densidade do grafo é ${r.grafo.graphDensity}.
        </div>

        <div>
            O Coeficiente de agrupamento médio é ${r.grafo.avGroupCoef}.
        </div>

        <div>
            O número de componentes conexas é ${r.grafo.numCompConexas}.
        </div>

        <div>
            A Excentricidade efetiva média é ${r.grafo.avEfecEcce}.
        </div>

         <div>
            O Diâmetro efetivo é ${r.grafo.efecctiveDiameter}.
        </div>

        <div>
            O Raio efetivo é ${r.grafo.efecctiveRadius}.
        </div>

        <div>
            A Centralidade média é ${r.grafo.averageCentrality}.
        </div>

        <div>
            O Percentual de vértices centrais é ${r.grafo.centralVerticesPercentage}%.
        </div>
  `

}