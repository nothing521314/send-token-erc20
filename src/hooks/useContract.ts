import { AddressZero } from "@ethersproject/constants";
import { Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import ERC20_ABI from "../constants/abi/erc20.json";
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { chainId, account, library } = useWeb3React();

  return useMemo(() => {
    if (!library) return null;
    if (!addressOrAddressMap || !ABI || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [
    library,
    addressOrAddressMap,
    ABI,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

export const useTokenContract = (
  tokenAddress?: string,
  withSignerIfPossible?: boolean
) => {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
};

function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: any,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid "address" parameter "${address}".`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}
