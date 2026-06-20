import {Request, Response, Router} from 'express';

const router = Router();

//Post: estudiantesID, materias (arreglo),periodoID
router.post('/', (req: Request, res: Response, next) => {
    const { estudianteID, materias, periodoID } = req.body;

    if (!estudianteID || !materias.length || !periodoID) {
        console.error('No existe el id del estudiante');
        res.status(400).json(
            { 
                error: 'Campos requeridoss:estudianteeid, materias, periodoid'
            }
        )
    }
    return res.status(201).json({
        version: 'v1',
        message: {
            estudianteID,materias,periodoID
        }

    })
})
export default router;
