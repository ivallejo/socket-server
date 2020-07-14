import {Router, Request, Response} from 'express'
import Server from '../class/server';
import { usuariosConectados } from '../sockets/socket';

export const router = Router()

router.get('/messages', ( req: Request, res: Response ) => {
    res.json({
        ok: true,
        message: 'Todo esta bien!'
    })
})

router.post('/messages', ( req: Request, res: Response ) => {
    
    const cuerpo = req.body.cuerpo
    const de = req.body.de

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload)

    res.json({
        ok: true,
        cuerpo,
        de,
    })
})

router.post('/messages/:id', ( req: Request, res: Response ) => {
    
    const cuerpo = req.body.cuerpo
    const de = req.body.de
    const id = req.params.id

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload)

    res.json({
        ok: true,
        cuerpo,
        de,
        id,
    })
})

router.get('/usuarios', ( req: Request, res: Response ) => {
    
    const server = Server.instance;

    server.io.clients( (err: any, clientes: String[]) => {
        if( err ) {
            return res.json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            clientes
        })
    })
})

router.get('/usuarios/detalle', ( req: Request, res: Response ) => {
    
    res.json({
        ok: true,
        clientes : usuariosConectados.getLista()
    })
    
    
})