import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { HelmetProvider } from 'react-helmet-async';
import { getLibrary } from './utils/web3';

export function rootContainer(container: any) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <HelmetProvider>{container}</HelmetProvider>
    </Web3ReactProvider>
  );
}
