const {select} = require('@inquirer/prompts') 

async function start() {

    while(true){

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
                    name:"Sair",
                    value: "sair"
                }
            ]
        })


        switch(opcao) {
            case 'cadastrar':
                console.log('cadastre aqui')
                break
            case 'listar':
                console.log('liste aqui')
                break
            case 'sair':
                return

        }

    }
}
start()