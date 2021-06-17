import React from 'react';
import { shape, string, number } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon } from 'react-feather';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';

/**
 * TODO
 *
 * Import the dialog component from '../Dialog'
 */
import { mergeClasses } from '../../classify';
import Icon from '../Icon';

import defaultClasses from './addToCartButton.css';

const ShoppingBagIcon = <Icon size={20} src={ShoppingCartIcon} />;

const GalleryButton = props => {
    const talonProps = useAddToCartButton(props);
    const {
        isOpen /* A boolean prop which if true means the dialog is open, and closed if false */,
        handleOpenDialog /* A function used to open the dialog */,
        handleCloseDialog /* A function used to close the dialog */,
        handleAddToCart /* A function used to add an item to the cart */
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    /*
    another way for line 31
    const buttonProps = {
        onClick: handleAddToCart,
        disabled: isLoading
    }
    */

    return (
<<<<<<< HEAD
        // Lets complete the render here to add a button
        // that will render the ShoppingBagIcon and when clicked
        // should use the handleAddToCart method from the talon
        // checkout galleryButton.ce.js to get an idea
        <button onClick={handleAddToCart} disabled={isLoading}>
            {ShoppingBagIcon}
        </button>
=======
        <div>
            {/**
             * TODO
             *
             * Render the dialog component. Render it with required props
             * to make it look and work like the screenshots describe.
             *
             * To know more about what props to use, checkout the "../Dialog/dialog.js"
             * file to get an idea.
             */}

            {/**
             * TODO
             *
             * Render the shopping bag button and when the user clicks on the button
             * open the dialog.
             */}
        </div>
>>>>>>> c5b7248e11937558e8dc8119d83abced8abb148e
    );
};

export default GalleryButton;

GalleryButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        url_key: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    })
};
