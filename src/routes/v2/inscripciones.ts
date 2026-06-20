import {Request, Response, Router} from 'express';

const router = Router();

const METODO_PAGO = ['efectivo', 'transferencia', 'debito', 'credito'];
//Post: estudiantesID, materias (arreglo),periodoID
router.post('/', (req: Request, res: Response, next) => {
    const { estudianteID, materias, periodoID, metodo_pago } = req.body;

    if (!estudianteID || !materias.length || !periodoID || !metodo_pago) {
        console.error('No existe el id del estudiante');
        res.status(400).json(
            { 
                error: 'Campos requeridoss:estudianteeid, materias, periodoid'
            }
        )
    }
    if (!METODO_PAGO.includes(metodo_pago)) {
        console.error('Metodo de pago no es valido');
        res.status(400).json({
            error: 'El metodo de pago insertado no es valido debe ser efectivo, transferencia, debito o credito'
        });
    }
    return res.status(201).json({
        version: 'v2',
        message: {
            estudianteID,materias,periodoID,metodo_pago
        }

    })
})
export default router;
