export enum EModalExportAddressesRoutes {
  ExportAddressesModal = 'ExportAddressesModal',
}

export type IModalExportAddressesParamList = {
  [EModalExportAddressesRoutes.ExportAddressesModal]: {
    walletId?: string;
    networkId?: string;
    deriveType?: string;
    createNum?: number;
  };
};
