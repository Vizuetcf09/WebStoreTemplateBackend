import { Request, Response } from 'express';
import MercadoPagoService, { CheckoutValidationError, MercadoPagoCheckoutItem } from '../services/mercadoPagoService.js';

class MercadoPagoController {
    async createPreference(req: Request, res: Response) {
        try {
            const items = req.body?.items as MercadoPagoCheckoutItem[];
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requiere al menos un producto para iniciar el pago.'
                });
            }

            const preference = await MercadoPagoService.createPreference(items);
            return res.status(200).json({
                success: true,
                data: {
                    preferenceId: preference.id,
                    checkoutUrl: preference.init_point
                }
            });
        } catch (error) {
            if (error instanceof CheckoutValidationError) {
                return res.status(400).json({ success: false, message: error.message });
            }
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(500).json({ success: false, message });
        }
    }

    async getPayment(req: Request, res: Response) {
        const paymentId = req.params.paymentId;
        if (!paymentId || !/^\d+$/.test(paymentId)) {
            return res.status(400).json({ success: false, message: 'ID de pago inválido.' });
        }

        try {
            const payment = await MercadoPagoService.getPayment(paymentId);
            return res.status(200).json({
                success: true,
                data: { id: payment.id, status: payment.status }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            return res.status(500).json({ success: false, message });
        }
    }
}

export default new MercadoPagoController();