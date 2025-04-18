export function formatCurrency(amount: number, currencyCode: string = "MXN") {
    try{
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currencyCode.toUpperCase(),
        }).format(amount)
    } catch (error) {
        console.error("Error formatting currency:",currencyCode, error);
        return `${currencyCode.toUpperCase()}, ${amount.toFixed(2)}`
    }
}
