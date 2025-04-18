import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";


export const salesType = defineType({
    name: "sales",
    title: "Sales",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "title",
            title: "Sale Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Sale Description",
            type: "text",
        }),
        defineField({
            name: "discountAmount",
            title: "Discount Amount",
            type: "number",
            description: "Amount off in percent or fixed value",
        }),
        defineField({
            name: "couponCode",
            title: "Coupon Code",
            type: "string",
            description: "Coupon code for the sale",
        }),
        defineField({
            name: "validFrom",
            title: "Valid From",
            type: "datetime",
            description: "Date and time the sale starts",
        }),
        defineField({
            name: "validUntil",
            title: "Valid Until",
            type: "datetime",
            description: "Date and time the sale ends",
        }),
        defineField({
            name: "isActive",
            title: "Is Active",
            type: "boolean",
            description: "Whether the sale is currently active",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "title",
            description: "description",
            discountAmount: "discountAmount",
            couponCode: "couponCode",
            isActive: "isActive",
        },
        prepare(selection) {
            const {title, discountAmount, couponCode, isActive} = selection;
            const status = isActive ? "Active" : "Inactive";
            return {
                title: title,
                subtitle: `${discountAmount}% off - Code ${couponCode} - ${status}`,
            };
        },
    },
});

