import React, { useEffect } from 'react';
import { AlertCircle, Check, Info } from 'react-feather';
import { useToasts } from '@magento/peregrine';

import Icon from '../../Icon';

const CheckIcon = <Icon size={20} src={Check} />;
const ErrorIcon = <Icon size={20} src={AlertCircle} />;
const InfoIcon = <Icon size={20} src={Info} />;

export const useCommonToasts = props => {
    const { errorToastProps, loginToastProps, successToastProps } = props;

    /*useToasts A hook that provides access to the toast state and toast api.
    @kind — function
    @returns — An array containing objects for the toast state and its API: [../useToastContext#ToastState ToastState, API]
    */


    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (loginToastProps) {
            addToast({ ...loginToastProps, icon: InfoIcon });
        }
    }, [addToast, loginToastProps]);
    
    useEffect(() => {
        if (successToastProps) {
            addToast({ ...successToastProps, icon: CheckIcon });
        }
    }, [addToast, successToastProps]);
    useEffect(() => {
        if (errorToastProps) {
            addToast({ ...errorToastProps, icon: ErrorIcon });
        }
    }, [addToast, errorToastProps]);
};
