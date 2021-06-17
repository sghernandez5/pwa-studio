import React from 'react';
import { shape, string } from 'prop-types';
import { Heart } from 'react-feather';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './galleryButton.css';
import { useCommonToasts } from './useCommonToasts';

const HeartIcon = <Icon size={20} src={Heart} />;

const GalleryButton = props => {
    const talonProps = useGalleryButton(props);

    // Is this equivalent to const talonProps = {...} 
    // js destructuring 
    const {
        buttonProps,
        errorToastProps,
        isSelected,
        loginToastProps,
        successToastProps
    } = talonProps;

    // talonProps has access to buttonProps, isSelected.. Classes?
    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
    //check if it was  success or not prompt button

    const classes = mergeClasses(defaultClasses, props.classes);
    //
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        // ... is called object spread
        <button className={buttonClass} {...buttonProps}>
            {HeartIcon}
        </button>
    );
};

export default GalleryButton;

GalleryButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    })
};
