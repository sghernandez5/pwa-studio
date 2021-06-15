import { useCallback, useState } from 'react';

export const useAddToCartButton = props => {
    const { item } = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = useCallback(() => {
        setIsLoading(true);

        console.log(`Adding ${item.name} to Cart`);

        // TODO Lets add a mutation to add the item to the cart

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [item]);

    return {
        isLoading,
        handleAddToCart
    };
};
