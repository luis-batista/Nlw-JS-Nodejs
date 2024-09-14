const {select, input, checkbox} = require('@inquirer/prompts') 
const fs = require("fs").promises

let mensagem = "Bem vindo ao app de metas"

let metas

async function carregarMetas() {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (erro) {
        metas = []
    }
}

async function salvarMetas() {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}


async function listarMetas() {
    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagem = "Nenhuma meta seledionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) =>{
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = "Meta(s) marcadas como concluída(s)"
}

async function cadastrarMeta() {
    const meta = await input({message: "Digite a meta: "})

    if(meta.length == 0){
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    metas.push(
        {
            value: meta, 
            checked: false
        }
    )

    mensagem = "Meta cadastrada com sucesso!"

}


async function metasRealizadas() {

    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const realizadas = metas.filter((meta) =>{
        return meta.checked
    })

    if(realizadas.length == 0){
        mensagem = "Não existe metas realizadas"
        return
    }

    await select({
        message: "Metas realizadas:" + " " + realizadas.length,
        choices: [...realizadas]
    })
}

async function metasAbertas() {

    if (metas.length == 0) {
        mensagem = "Não existem meta(s) aberta(s)!"
        return
    }

    const abertas = metas.filter((meta) => {
        return !meta.checked
    })

    if(abertas.length == 0) {
        mensagem = "Não existem metas abertas"
        return
    }

    await select({
        message: "Metas Abertas:" + " " + abertas.length,
        choices: [...abertas]
    })
}

async function deletarMetas() {

    if (metas.length == 0) {
        mensagem = "Não existem metas para deletar!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false}
    })

    const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    if(itensADeletar.length == 0) {
        mensagem = "Nenhum item a deletar"
        return
    }

    itensADeletar.forEach((item) => {
       metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "Meta(s) Deletada(s) com sucesso!"
    
}

function mostrarMensagem() {
    console.clear()

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

async function start() {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu>",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name:"Sair",
                    value: "sair"
                }
            ]
        })


        switch(opcao) {
            case 'cadastrar':
                await cadastrarMeta()
                break
            case 'listar':
                await listarMetas()
                break
            case 'realizadas':
                await metasRealizadas()
                break
            case 'abertas':
                await metasAbertas()
                break
            case 'deletar':
                await deletarMetas()
                break
            case 'sair':
                console.log("Até a próxima!")
                return 

        }

    }
}
start()