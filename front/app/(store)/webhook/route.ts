import { Metadata } from "@/actions/createCheckoutSessions";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClients";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }
    if (!webhookSecret) {
        console.error("Stripe webhook secret is not configured");
        return NextResponse.json(
            { error: "Stripe webhook secret is not configured" },
            { status: 500 }  // Cambiado a 500 ya que es un error del servidor
        );
    }
    
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json(
            { error: `Webhook Error: ${err instanceof Error ? err.message : String(err)}` },
            { status: 400 }
        );
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
    
        try {
            const order = await createOrderInSanity(session);
            console.log("Order created in Sanity:", order._id);  // More specific logging
        } catch (err) {
            console.error("Error creating order in Sanity:", err);
            return NextResponse.json(
                { 
                    error: "Error creating order",
                    details: err instanceof Error ? err.message : "Unknown error"
                },
                { status: 500 }
            );
        }
    }
    return NextResponse.json(
        { success: true, message: "Order processed successfully" },
        { status: 200 }
    );
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
    const { id, amount_total, currency, metadata, payment_intent, customer, total_details } = session;
    const { orderNumber, customerName, customerEmail, clerkUserId } = metadata as Metadata;

    const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
        id,
        {
            expand: ["data.price.product"],
        }
    );
    
    const sanityProducts = lineItemsWithProduct.data.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
            _type: "reference",
            _ref: (item.price?.product as Stripe.Product)?.metadata?.sanityId,
        },
        price: item.price?.unit_amount || 0,
        quantity: item.quantity || 1,
    }));
    
    const order = await backendClient.create({
        _type: "order",
        orderNumber,
        stripeCheckoutSessionId: id,
        stripePaymentIntentId: payment_intent,
        customerName,
        stripeCustomerId: customer,
        clerkUserId,
        email: customerEmail,
        currency: currency,
        amountDiscount: total_details?.amount_discount 
            ? total_details.amount_discount / 100
            : 0,
        products: sanityProducts,
        totalPrice: amount_total 
            ? amount_total / 100
            : 0,
        status: "paid",
        orderDate: new Date().toISOString(),  
    });
    
    return order;
}
