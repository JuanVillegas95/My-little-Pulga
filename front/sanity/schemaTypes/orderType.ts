import {defineArrayMember, defineField, defineType} from "sanity";
import {BasketIcon} from "@sanity/icons";

export const orderType = defineType({
    name: "order",
    title: "Order",
    type: "document",
    icon: BasketIcon,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stripeCheckoutSessionId",
            title: "Stripe Checkout Session ID",
            type: "string",
        }),
        defineField({
            name: "stripeCustomerId",
            title: "Stripe Customer ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "customerName",
            title: "Customer Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Customer Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "stripePaymentIntentId",
            title: "Stripe Payment Intent ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "products",
            title: "Products",
            type: "array",
            validation: (Rule) => Rule.required().min(1),
            of: [
                defineArrayMember({
                    type: "object",
                    fields: [
                        defineField({
                            name: "product",
                            title: "Product Bought",
                            type: "reference",
                            to: [{ type: "product" }],
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: "quantity",
                            title: "Quantity Purchased",
                            type: "number",
                            validation: (Rule) => Rule.required().min(1),
                        }),
                    ],
                    preview: {
                        select: {
                            product: "product.name",
                            quantity: "quantity",
                            image: "product.image",
                            price: "product.price",
                            currency: "product.currency",
                        },
                        prepare(selection) {
                            const {product, quantity, image, price, currency} = selection;
                            return {
                                title: product,
                                subtitle: `${quantity} x ${price} ${currency}`,
                                media: image,
                            };
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: "totalPrice",
            title: "Total Price",
            type: "number",
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: "currency",
            title: "Currency",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "amountDiscounted",
            title: "Amount Discounted",
            type: "number",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "status",
            title: "Order Status",
            type: "string",
            options: {
                list: [
                    {title: "Pending", value: "pending"},
                    {title: "Paid", value: "paid"},
                    {title: "Shipped", value: "shipped"},
                    {title: "Delivered", value: "delivered"},
                    {title: "Canceled", value: "canceled"},
                ],
            },
        }),
        defineField({
            name: "orderDate",
            title: "Order Date",
            type: "datetime",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "clerkUserId",
            title: "Clerk User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
    ],
    preview: {
        select: {
            name: "customerName",
            amount: "totalPrice",
            currency: "currency",
            orderId: "orderNumber",
            email: "email",
        },
        prepare(selection) {
            const orderIdSnippet = selection.orderId.slice(0, 5) + "..." + selection.orderId.slice(-5);
            return {
                title: `${selection.name} ${orderIdSnippet}`,
                subtitle: `${selection.amount} ${selection.currency}`,
                media: BasketIcon,
            };
        },
    },
});