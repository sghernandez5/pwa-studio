import { useCallback, useState } from 'react';

export const useAddToCartButton = props => {
    const { item } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDialog = useCallback(() => {
        setIsOpen(true);
    }, [item]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleAddToCart = useCallback(() => {
        console.log(`Opening dialog for ${item.name}`);

        // TODO Lets add a mutation to add the item to the cart

        setIsOpen(false);
    }, [setIsOpen]);

    return {
        isOpen,
        handleOpenDialog,
        handleCloseDialog,
        handleAddToCart
    };
};
