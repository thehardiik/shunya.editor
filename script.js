
const codex = document.getElementsByClassName('codex')
const terminalx = document.getElementsByClassName('terminalx')
const submit = document.getElementsByClassName('submit')

submit[0].addEventListener("click" , () => {
    compiler(codex[0].value)
})





function lexer(input){
    const tokens = []
    let cursor = 0;

    while(cursor < input.length){
        let char = input[cursor]
        
        if(char == ' ' || char == '\n'){
            cursor++;
            continue;
        }

        if(char <= 'z' && char >= 'a'){
            let word = ''

            while(cursor < input.length && input[cursor] != ' ' && input[cursor] != '\n' ){
                word += input[cursor]
                cursor++
            }

            if(word == 'matter' || word == 'observe'){
                tokens.push({
                    content: word,
                    type: "Keyword"
                })
            }else{
                tokens.push({
                    content: word,
                    type: "Variable"
                })
            }
            
            cursor++
            continue;
        }

        if(char >= '0' && char <= '9'){
            let num = ''

            while(cursor < input.length && input[cursor] != ' ' && input[cursor] != '\n' ){
                num += input[cursor]
                cursor++
            }

            tokens.push({
                content: parseInt(num),
                type: "Number"
            })
            
            
            cursor++
            continue;
        }

        if(char == '=' || char == '+' || char == '-' || char == '*' || char == '/'){
            tokens.push({
                content: char,
                type: "Assignment"
            })
            cursor++
            continue;
        }
    }



    return tokens;
}


function parser(tokens){
    const ast = {
        type: "Program",
        body: []
    }

    while(tokens.length > 0){
        let token = tokens.shift()

        if(token.type === 'Keyword' && token.content === 'matter'){
            let declaration = {
                type: "Declaration",
                name: tokens.shift().content,
                value: null
            }

            if(tokens[0].type === 'Assignment' && tokens[0].content === '='){
                tokens.shift()

                let expression = ''

                while(tokens.length > 0 && tokens[0].type != "Keyword"){
                    expression += tokens.shift().content
                }

                declaration.value = expression
            } 

            ast.body.push(declaration)
        }

        if(token.type === 'Keyword' && token.content === 'observe'){
            ast.body.push({
                type: "Print",
                expression: tokens.shift().content
            })
        }
    }

    return ast
}

function codeGenerator(ast){
    if(ast.type === 'Program' ){
        // Apply CodeGenerator Function recursively on each elements of body array
        return ast.body.map(codeGenerator).join("\n")
    }

    if(ast.type === 'Declaration' ){
        const expression = "const " + ast.name + " " + "= " + ast.value
        return expression
    }

    if(ast.type === 'Print' ){
        const expression = `console.log(${ast.expression})`
        return expression
    }
    
}

function runner(code) {
    eval(code)
   
}

function compiler(input){
    const tokens = lexer(input)
    const ast = parser(tokens)
    const executableCode = codeGenerator(ast)
    terminalx[0].value = executableCode
    runner(executableCode)
}



