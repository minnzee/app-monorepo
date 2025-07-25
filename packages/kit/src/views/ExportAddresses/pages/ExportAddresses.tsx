import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';

import type { IPageScreenProps } from '@onekeyhq/components';
import {
  Page,
  ScrollView,
  SizableText,
  Spinner,
  Stack,
  XStack,
  YStack,
} from '@onekeyhq/components';
import type { IAccountDeriveTypes } from '@onekeyhq/kit-bg/src/vaults/types';
import { presetNetworksMap } from '@onekeyhq/shared/src/config/presetNetworks';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import type {
  EModalExportAddressesRoutes,
  IModalExportAddressesParamList,
} from '@onekeyhq/shared/src/routes/exportAddresses';
import { EAccountSelectorSceneName } from '@onekeyhq/shared/types';
import type { IBatchCreateAccount } from '@onekeyhq/shared/types/account';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '../../../components/AccountSelector';
import { usePromiseResult } from '../../../hooks/usePromiseResult';
import { useActiveAccount } from '../../../states/jotai/contexts/accountSelector';

type IExportAddressData = IBatchCreateAccount[];
type IExportAddressesPageProps = IPageScreenProps<
  IModalExportAddressesParamList,
  EModalExportAddressesRoutes.ExportAddressesModal
>;

function ExportAddresses({ route }: IExportAddressesPageProps) {
  const intl = useIntl();
  const {
    walletId,
    networkId,
    deriveType = 'default',
    createNum = 20,
  } = route.params;
  const {
    activeAccount: { wallet },
  } = useActiveAccount({ num: 0 });

  const selectedWalletId = walletId || wallet?.id;
  const selectedNetworkId = networkId || presetNetworksMap.zksyncera?.id;
  const selectedDeriveType: IAccountDeriveTypes =
    (deriveType as IAccountDeriveTypes) || 'default';
  const selectedCreateNum = createNum;

  const { result: addressesData = [], isLoading } =
    usePromiseResult<IExportAddressData>(
      async () => {
        if (!selectedWalletId || !selectedNetworkId || !selectedDeriveType) {
          return [];
        }

        const indexes =
          await backgroundApiProxy.serviceBatchCreateAccount.buildIndexesByFromAndTo(
            {
              fromIndex: 0,
              toIndex: selectedCreateNum - 1,
            },
          );

        const result =
          await backgroundApiProxy.serviceBatchCreateAccount.previewBatchBuildAccounts(
            {
              walletId: selectedWalletId,
              networkId: selectedNetworkId,
              deriveType: selectedDeriveType,
              indexes,
              saveToCache: false,
            },
          );

        return result.accountsForCreate;
      },
      [
        selectedWalletId,
        selectedNetworkId,
        selectedDeriveType,
        selectedCreateNum,
      ],
      {
        initResult: [],
        watchLoading: true,
        debounced: 300,
      },
    );

  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.global_export_addresses,
        })}
      />
      <Page.Body p="$4">
        <ScrollView
          flex={1}
          p="$2.5"
          borderRadius="$2"
          borderCurve="continuous"
          bg="$bgSubdued"
          borderWidth={StyleSheet.hairlineWidth}
          borderColor="$borderStrong"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {isLoading ? (
            <YStack alignItems="center" justifyContent="center" flex={1}>
              <XStack alignItems="center" gap="$3">
                <Spinner size="small" />
              </XStack>
            </YStack>
          ) : (
            <YStack gap="$1" pb="$5">
              {addressesData.map((item, index) => {
                return (
                  <XStack key={index} alignItems="flex-start">
                    <Stack
                      width={32}
                      justifyContent="flex-start"
                      userSelect="none"
                    >
                      <SizableText
                        size="$bodyLgMedium"
                        color="$textDisabled"
                        numberOfLines={1}
                        userSelect="none"
                        style={{
                          userSelect: 'none',
                        }}
                      >
                        {index + 1}
                      </SizableText>
                    </Stack>
                    <Stack flex={1} mr="$0.5">
                      <SizableText
                        size="$bodyLg"
                        style={{
                          wordBreak: 'break-all',
                          userSelect: 'text',
                        }}
                      >
                        {item.address}
                      </SizableText>
                    </Stack>
                  </XStack>
                );
              })}
            </YStack>
          )}
        </ScrollView>
      </Page.Body>
    </Page>
  );
}

export default function ExportAddressesPage(props: IExportAddressesPageProps) {
  return (
    <AccountSelectorProviderMirror
      enabledNum={[0]}
      config={{
        sceneName: EAccountSelectorSceneName.home,
        sceneUrl: '',
      }}
    >
      <ExportAddresses {...props} />
    </AccountSelectorProviderMirror>
  );
}
