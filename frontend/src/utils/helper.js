
export const totalHandler = (products) => {
    let total;
    if (products) {
        total = products.reduce((sum, p) => {
            return sum + (p.quantity * p.newPrice)
        }, 0);
    }
    return total;
}






