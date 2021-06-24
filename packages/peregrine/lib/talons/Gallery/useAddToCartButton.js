import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

/**
 * TODO
 * 
 * Import useMutation from apollo. Check how its done in useAddToCartDialog.js
 */

import { useCartContext } from '../../context/cart';

import operations from './addToCart.gql';

export const useAddToCartButton = props => {
    const { item } = props;
    const [isOpen, setIsOpen] = useState(false);

    const [{ cartId }] = useCartContext();

    /**
     * TODO
     * 
     * use useMutation with operations.ADD_PRODUCT_TO_CART mutation
     * to get the function which will trigger the mutation call to the backend.
     */
    const [addToCart,{data}] = useMutation(operations.ADD_PRODUCT_TO_CART); //added

    const handleOpenDialog = useCallback(() => {
        setIsOpen(true);
    }, [item]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    /**
     * Helper function to return the variables you will have to
     * send to the mutation.
     * 
     * Will only work on simple products, for instance
     * https://magento-venia-concept-7bnnn.local.pwadev:8914/default/venia-accessories.html?page=1
     */
    const getMutationVariables = useCallback(() => {
        return {
            cartId,
            cartItem: {
                quantity: 1,
                selected_options: [],
                sku: item.sku
            }
        };
    }, [cartId, item]);

    const handleAddToCart = useCallback(async () => {
        const variables = getMutationVariables();

        try {
            /**
             * TODO
             * 
             * use the variables object and make the mutation call to
             * add an item to the cart. Checkout useAddToCartDialog.js
             * how it is done.
             * 
             * Here we are only talking about making the mutation call.
             */
            // make mutation call?
            await addToCart({
              variables
            })

            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    }, [setIsOpen, getMutationVariables]);

    return {
        isOpen,
        handleOpenDialog,
        handleCloseDialog,
        handleAddToCart
    };
};
