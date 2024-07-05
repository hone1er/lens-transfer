"use client";
import { useEffect, useState } from "react";
import { erc721Abi } from "viem";
import {
  useAccount,
  useChainId,
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import EnsInputField from "./EnsInputField";
import { useEns } from "@/hooks/useEns";
import { polygon, type Profile } from "@lens-protocol/react-web";
import { TransferSelection } from "./LensProfileManager";
import { ToastAction } from "../ui/toast";
import { PERMISSIONLESS_CREATOR_ABI } from "@/abi/PermissionlessCreatorABI";
import { switchChain } from "@wagmi/core";

interface LensTransferProps extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean;
  profile: Profile;
  transferSelection: TransferSelection;
  setTransferSelection: (selection: TransferSelection) => void;
}

export const LensTransfer = ({
  disabled = false,
  profile,
  transferSelection,
  setTransferSelection,
}: LensTransferProps) => {
  const {
    rawTokenAddress,
    isValidToAddress,
    ensAddy,
    ensAvatar,
    handleToAddressInput,
  } = useEns();
  const [handleId, setHandleId] = useState<string | null>(null);
  const { address } = useAccount();

  const { toast } = useToast();
  const chainId = useChainId();
  const config = useConfig();

  const {
    data: profileHash,
    writeContractAsync: writeContractAsyncProfile,
    isPending: isPendingProfile,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractAsyncHandle,
    isPending: isPendingHandle,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    dataUpdatedAt,
  } = useWaitForTransactionReceipt({
    hash: profileHash,
  });

  useEffect(() => {
    setHandleId(profile?.handle?.id ?? null);
  }, [profile?.handle?.id]);

  console.log("🚀 ~ dataUpdatedAt:", Date.now() - dataUpdatedAt);

  const handleTransferProfileNFT = async () => {
    if (chainId !== polygon.chainId) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to the Polygon network",
        action: (
          <ToastAction
            className="place-self-start "
            onClick={async () =>
              await switchChain(config, { chainId: polygon.chainId })
            }
            altText="Switch Network"
          >
            Switch network
          </ToastAction>
        ),
      });
      return;
    }
    if (!isValidToAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address",
      });
      return;
    }
    try {
      await writeContractAsyncProfile(
        {
          abi: PERMISSIONLESS_CREATOR_ABI,
          address: process.env
            .NEXT_PUBLIC_LENS_PROFILE_CONTRACT as `0x${string}`,
          functionName: "safeTransferFrom",
          args: [
            address!,
            rawTokenAddress as `0x${string}`,
            profile.id as unknown as bigint,
          ],
        },
        {
          onSuccess: (result) => {
            toast({
              title: "View Transaction",
              description: "View the transaction on the blockchain explorer",
              action: (
                <ToastAction
                  onClick={() => {
                    window.open(`https://polyscan.com/tx/${result}`, "_blank");
                  }}
                  altText="View Transaction"
                >
                  View transaction
                </ToastAction>
              ),
            });
          },
        },
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          <p className="break-all">{(error as Error)?.message}</p> ?? "",
      });
    }
  };

  const handleTransferHandleOwnership = async () => {
    if (chainId !== polygon.chainId) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to the Polygon network",
        action: (
          <ToastAction
            className="place-self-start "
            onClick={async () =>
              await switchChain(config, { chainId: polygon.chainId })
            }
            altText="Switch Network"
          >
            Switch network
          </ToastAction>
        ),
      });
      return;
    }
    if (!isValidToAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address",
      });
      return;
    }

    try {
      await writeContractAsyncHandle(
        {
          abi: erc721Abi,
          address: process.env
            .NEXT_PUBLIC_LENS_HANDLE_CONTRACT as `0x${string}`,
          functionName: "safeTransferFrom",
          args: [
            address!,
            rawTokenAddress as `0x${string}`,
            handleId as unknown as bigint,
          ],
        },
        {
          onSuccess: (result) => {
            toast({
              title: "View Transaction",
              description: "View the transaction on the blockchain explorer",
              action: (
                <ToastAction
                  altText="View Transaction"
                  onClick={() => {
                    window.open(
                      `https://polyscan.com/tx/${result as string}`,
                      "_blank",
                    );
                  }}
                >
                  View Transaction
                </ToastAction>
              ),
            });
          },
        },
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          <p className="break-all">{(error as Error)?.message}</p> ?? "",
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-lg border p-7 shadow-md">
      <label className="text-lg font-semibold text-gray-800">
        Transfer Ownership to:
      </label>
      <EnsInputField
        disabled={disabled}
        rawTokenAddress={rawTokenAddress}
        isValidToAddress={isValidToAddress}
        ensAddy={ensAddy as string}
        ensAvatar={ensAvatar!}
        onChange={handleToAddressInput}
      />
      <div className="flex w-full flex-row gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={transferSelection === TransferSelection.Profile}
            onCheckedChange={() =>
              setTransferSelection(
                transferSelection === TransferSelection.Handle
                  ? TransferSelection.Profile
                  : TransferSelection.Handle,
              )
            }
          />
          <Label htmlFor="transfer-lens">Transfer Profile</Label>
        </div>
      </div>
      {transferSelection === TransferSelection.Handle ? (
        <Button
          disabled={isPendingHandle}
          onClick={handleTransferHandleOwnership}
          size="sm"
          variant="outline"
        >
          Transfer Handle
        </Button>
      ) : (
        <Button
          disabled={isPendingProfile || isConfirming}
          onClick={handleTransferProfileNFT}
          size="sm"
          variant="outline"
        >
          Transfer Profile
        </Button>
      )}
      {isConfirming && (
        <div>
          <p
            className="
          text-gray-500 dark:text-gray-400
          "
          >
            Waiting for confirmation...
          </p>
        </div>
      )}
    </div>
  );
};
