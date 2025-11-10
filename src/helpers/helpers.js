

// export default function calculateTotal(items){
//     return items.reduce((total , item) =>{
//         const price = item.discountPrice ?? item.price;
//         return total + price * item.quantity;
//     }, 0)
// }


export default  function calculateTotal(items){
    let total = 0;
    for(const item of items){
        if (item.discountPrice) {
            total += item.discountPrice * item.quantity;
        } else {
            total += item.price * item.quantity;
        };
    };
    return total;
};

