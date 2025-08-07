const zod = require('zod')

let CreateUserInput = zod.object({
    username: zod.string().max(20).min(5),
    password: zod.string().max(20).min(5)

})

let SigninInput = zod.object({
    username: zod.string().max(20).min(5),
    password : zod.string().max(20).min(5)
})

let TodoInput= zod.object({
    todo: zod.string()
})

module.exports ={
    CreateUserInput,
    SigninInput,
    TodoInput
}