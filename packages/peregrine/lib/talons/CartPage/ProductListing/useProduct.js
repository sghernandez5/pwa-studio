import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '../../../util/deriveErrorMessage';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './product.gql';

/**
 * This talon contains logic for a product component used in a product listing component.
 * It performs effects and returns prop data for that component.
 *
 * This talon performs the following effects:
 *
 * - Manage the updating state of the cart while a product is being updated or removed
 *
 * @function
 *
 * @param {Object} props
 * @param {ProductItem} props.item Product item data
 * @param {ProductMutations} props.operations GraphQL mutations for a product in a cart
 * @param {function} props.setActiveEditItem Function for setting the actively editing item
 * @param {function} props.setIsCartUpdating Function for setting the updating state of the cart
 *
 * @return {ProductTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
 */

export const useProduct = props => {
    const { item, setActiveEditItem, setIsCartUpdating } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        addProductToWishlistMutation,
        removeItemMutation,
        updateItemQuantityMutation,
        getConfigurableThumbnailSource,
        removeProductFromWishlistMutation
    } = operations;

    const { data: configurableThumbnailSourceData } = useQuery(
        getConfigurableThumbnailSource,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData) {
            return configurableThumbnailSourceData.storeConfig
                .configurable_thumbnail_source;
        }
    }, [configurableThumbnailSourceData]);

    const flatProduct = flattenProduct(item, configurableThumbnailSource);

    const [
        removeItem,
        {
            called: removeItemCalled,
            error: removeItemError,
            loading: removeItemLoading
        }
    ] = useMutation(removeItemMutation);

    const [
        updateItemQuantity,
        {
            loading: updateItemLoading,
            error: updateError,
            called: updateItemCalled
        }
    ] = useMutation(updateItemQuantityMutation);

    const [
        addProductToWishlist,
        { error: addProductToWishlistError }
    ] = useMutation(addProductToWishlistMutation);

    const [
        removeProductFromWishlist,
        { error: removeProductFromWishlistError }
    ] = useMutation(removeProductFromWishlistMutation);

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [
        removeItemCalled,
        removeItemLoading,
        setIsCartUpdating,
        updateItemCalled,
        updateItemLoading
    ]);

    const [{ cartId }] = useCartContext();

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError &&
                deriveErrorMessage([
                    updateError,
                    removeItemError,
                    addProductToWishlistError,
                    removeProductFromWishlistError
                ])) ||
            ''
        );
    }, [
        displayError,
        addProductToWishlistError,
        removeProductFromWishlistError,
        removeItemError,
        updateError
    ]);

    const handleToggleFavorites = useCallback(async () => {
        const sku = item.product.sku;
        const quantity = item.quantity;
        const selected_options = item.configurable_options.map(
            option => option.configurable_product_option_value_uid
        );

        try {
            const { data: wishlistData } = await addProductToWishlist({
                variables: {
                    wishlistId: '0',
                    itemOptions: {
                        sku,
                        quantity,
                        selected_options
                    }
                }
            });
            console.log(wishlistData);

            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: item.id
                    }
                });
            } catch (err) {
                // remove item from cart has failed, should roll back the change
                // by removing the item from the wishlist
                console.log(wishlistData);

                /**
                 * sample wishlistData object
                 * 
                 * {
  "addProductsToWishlist": {
    "user_errors": [],
    "wishlist": {
      "id": "97",
      "items": {
        "items": [
          {
            "id": "242",
            "configurable_options": [
              {
                "id": 179,
                "value_id": 23,
                "option_label": "Color",
                "value_label": "Lily",
                "__typename": "SelectedConfigurableOption"
              },
              {
                "id": 182,
                "value_id": 27,
                "option_label": "Size",
                "value_label": "M",
                "__typename": "SelectedConfigurableOption"
              }
            ],
            "__typename": "ConfigurableWishlistItem",
            "product": {
              "sku": "VD02",
              "__typename": "ConfigurableProduct"
            }
          }
        ],
        "__typename": "WishlistItems"
      },
      "__typename": "Wishlist"
    },
    "__typename": "AddProductsToWishlistOutput"
  }
}

                 */

                await removeProductFromWishlist({
                    variables: {
                        wishlistId: '0',
                        wishlistItemsIds: ''
                    }
                });

                setDisplayError(true);
            }
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [
        addProductToWishlist,
        removeProductFromWishlist,
        removeItem,
        cartId,
        item
    ]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);

        // If there were errors from removing/updating the product, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [item, setActiveEditItem]);

    const handleRemoveFromCart = useCallback(async () => {
        try {
            await removeItem({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [cartId, item.id, removeItem]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.id,
                        quantity
                    }
                });
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [cartId, item.id, updateItemQuantity]
    );

    return {
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleToggleFavorites,
        handleUpdateItemQuantity,
        isEditable: !!flatProduct.options.length,
        product: flatProduct
    };
};

const flattenProduct = (item, configurableThumbnailSource) => {
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const configured_variant = configuredVariant(options, product);

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const {
        name,
        small_image,
        stock_status: stockStatus,
        url_key: urlKey,
        url_suffix: urlSuffix
    } = product;
    const { url: image } =
        configurableThumbnailSource === 'itself' && configured_variant
            ? configured_variant.small_image
            : small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for a product in a cart.
 * This is a type used by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductMutations
 *
 * @property {GraphQLAST} removeItemMutation Mutation for removing an item in a cart
 * @property {GraphQLAST} updateItemQuantityMutation Mutation for updating the item quantity in a cart
 *
 * @see [product.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/product.js}
 * to see the mutations used in Venia
 */

/**
 * Object type returned by the {@link useProduct} talon.
 * It provides prop data for rendering a product component on a cart page.
 *
 * @typedef {Object} ProductTalonProps
 *
 * @property {String} errorMessage Error message from an operation perfored on a cart product.
 * @property {function} handleEditItem Function to use for handling when a product is modified.
 * @property {function} handleRemoveFromCart Function to use for handling the removal of a cart product.
 * @property {function} handleToggleFavorites Function to use for handling favorites toggling on a cart product.
 * @property {function} handleUpdateItemQuantity Function to use for handling updates to the product quantity in a cart.
 * @property {boolean} isEditable True if a cart product is editable. False otherwise.
 * @property {ProductItem} product Cart product data
 */

/**
 * Data about a product item in the cart.
 * This type is used in the {@link ProductTalonProps} type returned by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductItem
 *
 * @property {String} currency The currency associated with the cart product
 * @property {String} image The url for the cart product image
 * @property {String} name The name of the product
 * @property {Array<Object>} options A list of configurable option objects
 * @property {number} quantity The quantity associated with the cart product
 * @property {number} unitPrice The product's unit price
 * @property {String} urlKey The product's url key
 * @property {String} urlSuffix The product's url suffix
 */
