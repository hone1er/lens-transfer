import { useEffect, useState } from "react";
import useEnsProfile from "@/hooks/useEnsProfile";
import { isAddress } from "viem";

export const useEns = (initialAddress = "") => {
  const [rawTokenAddress, setRawTokenAddress] = useState(initialAddress);
  const [isValidToAddress, setIsValidToAddress] = useState(false);
  const { ensAddress: ensAddy, ensAvatar } = useEnsProfile({
    ensName: rawTokenAddress,
  });

  useEffect(() => {
    setIsValidToAddress(isAddress(rawTokenAddress));
  }, [rawTokenAddress]);

  const handleToAddressInput = (address: string) => {
    setRawTokenAddress(address);
    setIsValidToAddress(isAddress(address));
  };

  return {
    rawTokenAddress,
    isValidToAddress,
    ensAddy,
    ensAvatar,
    handleToAddressInput,
  };
};
