import axios from 'axios';

export interface MercadoPagoItem {
    title: string;
    quantity: number;
    unitPrice: number;
}

class MercadoPagoClient {
    private apiUrl = 'https://api.mercadopago.com';
    private accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
    private frontendBaseUrl = process.env.FRONTEND_BASE_URL?.replace(/\/$/, '') || '';

    async createPreference(items: MercadoPagoItem[]) {
        if (!this.accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not configured');
        }
        if (!this.frontendBaseUrl) {
            throw new Error('FRONTEND_BASE_URL is not configured');
        }

        const response = await axios.post(
            `${this.apiUrl}/checkout/preferences`,
            {
                items: items.map((item) => ({
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    currency_id: 'MXN'
                })),
                back_urls: {
                    success: `${this.frontendBaseUrl}/checkout/success?provider=mercadopago`,
                    pending: `${this.frontendBaseUrl}/checkout/success?provider=mercadopago&status=pending`,
                    failure: `${this.frontendBaseUrl}/checkout/cancel?provider=mercadopago`
                },
                auto_return: 'approved'
            },
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    }

    async getPayment(paymentId: string) {
        if (!this.accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not configured');
        }

        const response = await axios.get(`${this.apiUrl}/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
        });

        return response.data;
    }
}

export default new MercadoPagoClient();