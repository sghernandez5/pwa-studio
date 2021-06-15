import React from 'react';
import { shape, string, number } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon } from 'react-feather';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';

import defaultClasses from './addToCartButton.css';

const ShoppingBagIcon = <Icon size={20} src={ShoppingCartIcon} />;

const GalleryButton = props => {
    const talonProps = useAddToCartButton(props);
    const { isLoading, handleAddToCart } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        // Lets complete the render here to add a button
        // that will render the ShoppingBagIcon and when clicked
        // should use the handleAddToCart method from the talon
        // checkout galleryButton.ce.js to get an idea

        <div />
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
