


/**
*Arquivo : server.js
*/


    // Configuraçao  Setup App:

    const jwt= require('jsonwebtoken');
    const JWT_PASSWORD =' passport'

    var express = require('express'); 
  
    var app=express();
    var bodyParser = require('body-parser');
    var mongoose=require('mongoose');
    var Usuario=require('./app/models/usuarios');


    const callback = function (res, err, data) {
        if (err) return res.json(err)
        return res.json(data)}


  //Conexao com banco   
mongoose.connect('mongodb+srv://testepolsec:bruno123@testepolsec-gnw48.azure.mongodb.net/test?retryWrites=true');


    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
  
 


    var port= process.env.port || 8000;



//======================================================



    var router= express.Router();
    


//Rota para gerar token.
    router.get('/getToken', (req, res) => {
        // Dados  dentro dessa chave
        const jwtData = {
            email: 'Bruno@.com.br',
            userName: 'Bruno Augusto'
        }
        // parâmetros para criar a chave
        const jwtParams = {
            algorithm: 'HS256', // tipo da criptografia da chave
            expiresIn: 60 * 60 * 24 // Tempo para essa chave expirar em segundos
        }
        // gerar a chave
        jwt.sign(jwtData, JWT_PASSWORD, jwtParams, (err, data) => {
            if (err) return res.json({ error: true, message: 'Falha ao gerar o token' })
            res.json({ error: false, token: data })
        })
    })
    
    //Rota para testar o Token decodificado.
    router.get('/decodeToken/:token', (req, res) => {
        const token = req.params.token
        jwt.verify(token, JWT_PASSWORD, (err, data) => {
            callback(res, err, data)
        })
    })
    
    






//Ultilizando o token para liberar as rotas
    router.use((req, res, next) => {
        const token = req.headers['authorization']
    
        if (!token) return res.json({ error: true, message: 'Nenhum token recebido.' })
    
        jwt.verify(token, JWT_PASSWORD, (err, data) => {
            if (err) return res.json(err) 
            next() 
        })
    
    })

  


   // ROTAS API:

//Cadastro Cliente

router.route('/usuarios')

    .post(function(req,res){

        var usuario=new Usuario();

        usuario.nome=req.body.nome;
        usuario.email=req.body.email;
        usuario.senha=req.body.senha;
 
       
        usuario.save(function(error){
            if(error){
                res.send('Erro ao cadastrar cliente'+error);
            }         

               {res.json({message:'Usuario Cadastrado com sucesso!'});
            }  
             callback(res, err, data) 
            

        });

    })
   /// Consulta De Clientes
    .get(function(req,res) {
      
        Usuario.find(function(error,usuarios){
        
            if(error)
            res.send('Error ao tentar selecionar todos usuarios...'+error);

                res.json(usuarios);
                callback(res, err, data) 
            });

});



// Rotas que irao terminar em /usuarios/:usuarios_id'(get,put e delete: Por ID):

//Rota de pesquisa
router.route('/usuarios/:usuario_id')

 .get(function(req,res){

    Usuario.findById(req.params.usuario_id,function(error,usuario){

        if(error)

            res.send('Id Do Usuario Nao encontrado...'+error);
            res.json(usuario);
        
    });
})  
    .put(function(req,res){
        Usuario.findById(req.params.usuario_id,function(error,usuario){
            if (error)  
            res.send("Id Do Cliente nao encontrado..."+error);
            
            usuario.nome=req.body.nome;
            usuario.email=req.body.email;
            usuario.senha=req.body.senha;
        
                usuario.save(function(error){
                    if(error)
                        res.send('error ao atualizar'+error);
                        res.json({message:'Dados atualizado com sucesso!'});


                });
        
        });


    })



    .delete(function(req,res){
        Usuario.remove({
            _id:req.params.usuario_id,
        },function(error){

            if (error)
            res.send('Usuario nao encontrado..'+error);
            res.json({message:'Usuario excluido com sucesso!'});
        } );



    });






    app.use('/api',router);


    app.listen(port);
    console.log("Iniciando app na porta "+port);


    ////////////////////////////////////////////////////////////////////////////////


    /// ROTA LOGIN


router.post('/login',function (req,res) {

const {email,senha}=req.body;
const usuario= Usuario.findOne({email}).select('+senha');


if(!usuario)
    return res.status(400).send({error: 'Usuario nao encontrado'});

if((!senha,usuario.senha))
return res.status(400).send({error: 'Senha Incorreta' });


res.send({Usuario:' Logado com sucesso'});

} )
    



