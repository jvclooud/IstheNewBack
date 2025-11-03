import { Request, Response, NextFunction } from "express";
import Auth from './auth.js'

interface AutenticacaoRequest extends Request {
    usuarioId?: string;
    role?: string;
}

function AdminAuth(req: AutenticacaoRequest, res: Response, next: NextFunction) {
    // Reaproveita o middleware Auth para validar token e popular req.role
    Auth(req, res, () => {
        if (req.role !== 'admin') {
            return res.status(403).json({
                mensagem: "Acesso negado. Apenas administradores podem acessar esta rota."
            })
        }
        next()
    })
}

export { AdminAuth }
export default AdminAuth
