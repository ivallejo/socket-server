import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuarioLista } from '../class/usuarios-lista';
import { Usuario } from "../class/usuario";

export const usuariosConectados = new UsuarioLista()


export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
    const usuario = new Usuario(cliente.id)
    usuariosConectados.agregar( usuario )
    
}

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado')
        usuariosConectados.borrarUsuario( cliente.id )
        io.emit('usuarios-activos', usuariosConectados.getLista())
    })
}

export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string} ) => {
        console.log('Mensaje recibido', payload)
        io.emit('mensaje-nuevo', payload)
    })
}

export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', ( payload: { nombre: string}, callback: Function ) => {
        // console.log('Configurando usuario', payload.nombre)
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre)
        io.emit('usuarios-activos', usuariosConectados.getLista())
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        })
    })
}

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        io.emit('usuarios-activos', usuariosConectados.getLista())
    })
}
