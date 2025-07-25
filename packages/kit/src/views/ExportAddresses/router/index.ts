import type { IModalFlowNavigatorConfig } from '@onekeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@onekeyhq/shared/src/lazyLoad';
import { EModalExportAddressesRoutes } from '@onekeyhq/shared/src/routes/exportAddresses';
import type { IModalExportAddressesParamList } from '@onekeyhq/shared/src/routes/exportAddresses';

const ExportAddresses = LazyLoad(
  () => import('@onekeyhq/kit/src/views/ExportAddresses/pages/ExportAddresses'),
);

export const ExportAddressesModalRouter: IModalFlowNavigatorConfig<
  EModalExportAddressesRoutes,
  IModalExportAddressesParamList
>[] = [
  {
    name: EModalExportAddressesRoutes.ExportAddressesModal,
    component: ExportAddresses,
  },
];
