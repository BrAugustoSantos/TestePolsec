// Classe Usuarios



var mongoose= require ('mongoose');
var Schema = mongoose.Schema;


var UsuariosSchema=new Schema ({

    nome: {
        type:String,
        require:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },

    senha:{
        type:String,
        required:true,
        
        },


});

module.exports=mongoose.model('usuarios',UsuariosSchema);