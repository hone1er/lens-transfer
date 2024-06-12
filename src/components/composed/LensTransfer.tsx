"use client";
import { useEffect, useState } from "react";
import { erc721Abi } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import EnsInputField from "./EnsInputField";
import { useEns } from "@/hooks/useEns";
import { type Profile } from "@lens-protocol/react-web";
import { TransferSelection } from "./LensApp";
import { ToastAction } from "../ui/toast";

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

  const {
    writeContractAsync: writeContractAsyncProfile,
    isPending: isPendingProfile,
    isSuccess: isSuccessProfile,
  } = useWriteContract();

  const {
    writeContractAsync: writeContractAsyncHandle,
    isPending: isPendingHandle,
  } = useWriteContract();

  useEffect(() => {
    setHandleId(profile.handle?.id ?? null);
  }, [profile.handle?.id]);

  const handleTransferOwnership = async () => {
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
          abi: [
            ...erc721Abi,
            {
              constant: false,
              inputs: [
                { name: "_from", type: "address" },
                { name: "_to", type: "address" },
                { name: "_tokenId", type: "uint256" },
              ],
              name: "transferFromKeepingDelegates",
              outputs: [],
              payable: false,
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          address: process.env
            .NEXT_PUBLIC_LENS_PROFILE_CONTRACT as `0x${string}`,
          functionName: "transferFromKeepingDelegates",
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
        description: (error as Error)?.message ?? "",
      });
    }
  };

  const handleTransferHandleOwnership = async () => {
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
        description: (error as Error)?.message ?? "",
      });
    }
  };

  return (
    <div className="flex h-full w-full max-w-96 flex-col gap-2 rounded-lg border p-7 shadow-md">
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
      <div className="flex flex-row gap-2">
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
      {isSuccessProfile || transferSelection === TransferSelection.Handle ? (
        <Button
          disabled={isPendingHandle}
          onClick={handleTransferHandleOwnership}
          size="sm"
        >
          Transfer Handle
        </Button>
      ) : (
        <Button
          disabled={isPendingProfile}
          onClick={handleTransferOwnership}
          size="sm"
        >
          Transfer Profile
        </Button>
      )}
    </div>
  );
};
