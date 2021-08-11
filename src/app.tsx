import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { HelmetProvider } from 'react-helmet-async';
import { RefreshContextProvider } from '@/contexts/RefreshContext';
import { getLibrary } from './utils/web3';
import BigNumber from 'bignumber.js';
// This config is required for number formatting
BigNumber.config({
    EXPONENTIAL_AT: 1000,
    DECIMAL_PLACES: 80,
});
export function rootContainer(container: any) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <HelmetProvider>
                <RefreshContextProvider>{container}</RefreshContextProvider>
            </HelmetProvider>
        </Web3ReactProvider>
    );
}
