import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import { stripe } from "../../service/stripe";
import Stripe from "stripe";
import { saveSubscription } from "./_lib/manegerSubscription";

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk == "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscriptions.created',
    'customer.subscriptions.updated',
    'customer.subscriptions.deleted'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == 'POST') {

        const buf = await buffer(req);

        const secret = req.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_SECRET);
        } catch { }

        const type = event.type;

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true,
                        )

                        break;
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;
                            await saveSubscription(
                                subscription.id,
                                subscription.customer.toString(),
                                type === 'customer.subscription.created'
                            );
                        break;


                    default: throw new Error('Unhandled event')
                }
            } catch (err) {
                return res.json({ error: 'Webhooks handler failed' })
            }

            return res.json({ message: 'ok' });

        } else {
            res.setHeader('Allow', 'POST')
            res.status(405).end('Method not allowed')
        }
    }
}