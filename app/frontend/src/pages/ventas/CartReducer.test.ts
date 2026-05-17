import { describe, it, expect } from 'vitest';
import { cartReducer, type CartItem, type CartAction } from './CartReducer';

describe('cartReducer', () => {
    it('debería agregar un nuevo producto al carrito vacío', () => {
        const initialState: CartItem[] = [];
        const newItem: CartItem = {
            id_producto: 1,
            nombre_producto: 'Teclado Mecánico',
            precio_unitario: 500,
            cantidad: 2,
            subtotal: 1000
        };

        const action: CartAction = {
            type: 'ADD_ITEM',
            payload: { item: newItem, maxStock: 10 }
        };

        const newState = cartReducer(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0]).toEqual(newItem);
    });

    it('debería sumar la cantidad si el producto ya existe', () => {
        const initialState: CartItem[] = [{
            id_producto: 1,
            nombre_producto: 'Teclado Mecánico',
            precio_unitario: 500,
            cantidad: 2,
            subtotal: 1000
        }];

        const newItem: CartItem = {
            id_producto: 1,
            nombre_producto: 'Teclado Mecánico',
            precio_unitario: 500,
            cantidad: 1,
            subtotal: 500
        };

        const action: CartAction = {
            type: 'ADD_ITEM',
            payload: { item: newItem, maxStock: 10 }
        };

        const newState = cartReducer(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].cantidad).toBe(3);
        expect(newState[0].subtotal).toBe(1500);
    });

    it('debería remover un producto del carrito', () => {
        const initialState: CartItem[] = [
            {
                id_producto: 1,
                nombre_producto: 'Teclado Mecánico',
                precio_unitario: 500,
                cantidad: 2,
                subtotal: 1000
            },
            {
                id_producto: 2,
                nombre_producto: 'Mouse',
                precio_unitario: 100,
                cantidad: 1,
                subtotal: 100
            }
        ];

        const action: CartAction = {
            type: 'REMOVE_ITEM',
            payload: { id_producto: 1 }
        };

        const newState = cartReducer(initialState, action);

        expect(newState).toHaveLength(1);
        expect(newState[0].id_producto).toBe(2);
    });

    it('debería limpiar el carrito completo', () => {
        const initialState: CartItem[] = [
            {
                id_producto: 1,
                nombre_producto: 'Teclado Mecánico',
                precio_unitario: 500,
                cantidad: 2,
                subtotal: 1000
            }
        ];

        const action: CartAction = {
            type: 'CLEAR_CART'
        };

        const newState = cartReducer(initialState, action);

        expect(newState).toHaveLength(0);
    });
});
