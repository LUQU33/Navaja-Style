//Pasamos de "$48.000" a 48000
export function priceToNumber(price) {
    return Number(String(price).replace(/\D/g, ""));
}

//pasamos de 48000 a "$48.000"
export function formatPrice(number) {
    return "$" + number.toLocalString("es-AR");
}

//Cuando conectemos el back pricetonumber se descarta