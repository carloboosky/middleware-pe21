import { Request, Response, Router } from 'express';

const router = Router();

const METODO_PAGO = ['efectivo', 'transferencia', 'debito', 'credito'];

// POST: estudianteID, materias, periodoID, metodo_pago
router.post('/', (req: Request, res: Response) => {
  const { estudianteID, materias, periodoID, metodo_pago } = req.body;

  if (!estudianteID || !materias?.length || !periodoID || !metodo_pago) {
    return res.status(400).json({
      error: 'Campos requeridos: estudianteID, materias, periodoID, metodo_pago'
    });
  }

  if (!METODO_PAGO.includes(metodo_pago)) {
    return res.status(400).json({
      error: 'El metodo de pago insertado no es valido debe ser efectivo, transferencia, debito o credito'
    });
  }

  return res.status(201).json({
    version: 'v2',
    message: {
      estudianteID,
      materias,
      periodoID,
      metodo_pago
    }
  });
});

export default router;