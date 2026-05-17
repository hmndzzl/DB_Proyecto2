export interface CartItem {
    id_producto: number;
    nombre_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
}

export type CartAction =
    | { type: 'ADD_ITEM'; payload: { item: CartItem; maxStock: number } }
    | { type: 'REMOVE_ITEM'; payload: { id_producto: number } }
    | { type: 'CLEAR_CART' };

export const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { item, maxStock } = action.payload;
            const existingItemIndex = state.findIndex(i => i.id_producto === item.id_producto);

            if (existingItemIndex >= 0) {
                const existingItem = state[existingItemIndex];
                const nuevaCantidad = existingItem.cantidad + item.cantidad;
                
                if (nuevaCantidad > maxStock) {
                    throw new Error(`Stock insuficiente. Solo quedan ${maxStock} unidades en total.`);
                }

                const newState = [...state];
                newState[existingItemIndex] = {
                    ...existingItem,
                    cantidad: nuevaCantidad,
                    subtotal: nuevaCantidad * existingItem.precio_unitario
                };
                return newState;
            }

            if (item.cantidad > maxStock) {
                throw new Error(`Stock insuficiente. Solo quedan ${maxStock} unidades en total.`);
            }

            return [...state, item];
        }
        case 'REMOVE_ITEM':
            return state.filter(item => item.id_producto !== action.payload.id_producto);
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};
