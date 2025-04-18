export const COUPON_CODES = {
    BFRIDAY: "BFRIDAY",
    CHRISTMAS: "CHRISTMAS",
    VALENTINES: "VALENTINES",
    SUMMER: "SUMMER",
    WINTER: "WINTER",
} as const;

export type CouponCode = keyof typeof COUPON_CODES;
