"use client";
import { useEffect, useState } from "react";
import { erc721Abi, isAddress } from "viem";
import Image from "next/image";
import useEnsProfile from "@/hooks/useEnsProfile";
import truncateAddress from "@/utils/truncateAddress";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { type Profile } from "@lens-protocol/react-web";
import { useAccount, useWriteContract } from "wagmi";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { TransferSelection } from "./LensApp";
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
  const [isValidToAddress, setIsValidToAddress] = useState<boolean>(false);
  const [rawTokenAddress, setRawTokenAddress] = useState<string>("");
  const { ensAddress: ensAddy, ensAvatar } = useEnsProfile({
    ensName: rawTokenAddress,
  });

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
                {
                  name: "_from",
                  type: "address",
                },
                {
                  name: "_to",
                  type: "address",
                },
                {
                  name: "_tokenId",
                  type: "uint256",
                },
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
              title: "Success",
              description: "Transaction successful!",
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

  useEffect(() => {
    setHandleId(profile.handle?.id ?? null);
  }, [profile.handle?.id]);

  // Handle input change for recipient address
  const handleToAdressInput = (_to: string) => {
    const isValid = isAddress(_to);
    setIsValidToAddress(isValid);
    // Update raw token address and notify parent component
    setRawTokenAddress(_to);
  };

  return (
    <div className="flex h-full w-full max-w-96 flex-col gap-2 rounded-lg border   p-7 shadow-md">
      <label className="text-lg font-semibold text-gray-800">
        Transfer Ownership to:
      </label>
      <div
        className={`duration-400 relative flex min-w-80 flex-col gap-2 transition-all ${ensAddy ? "h-[106px] rounded-b-[8px]" : "h-[48px] rounded-b-[48px]"}`}
      >
        <Input
          type="text"
          placeholder="0x..."
          disabled={disabled}
          className={`relative z-40 min-h-10 w-full bg-white ${rawTokenAddress.length > 0 && isValidToAddress ? "border-green-500" : rawTokenAddress.length > 0 && !isValidToAddress ? "border-red-500" : "border-auto"} rounded-t-[8px]  px-4 py-2 transition-all duration-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          value={rawTokenAddress}
          name="address"
          onChange={(e) => handleToAdressInput(e.target.value)}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            setRawTokenAddress(ensAddy ?? "");
            setIsValidToAddress(true);
          }}
          className={`text-neutral-content relative bottom-3 z-10 flex w-full min-w-[140px] max-w-80 flex-row items-center justify-between rounded-b-[8px]  bg-slate-100 px-4 py-2 transition-all duration-500 hover:cursor-pointer md:px-4 ${
            ensAddy
              ? "max-w-full translate-y-0 opacity-100"
              : "pointer-events-none max-w-0 -translate-y-12 opacity-0"
          }`}
        >
          {ensAvatar ? (
            <div className="avatar ">
              <div className="w-8 rounded-full bg-slate-800">
                <Image
                  width={320}
                  height={320}
                  content="responsive"
                  src={ensAvatar ?? ""}
                  alt="avatar"
                  placeholder="blur"
                  blurDataURL="/assets/icons/ethereum.png"
                  className={`${ensAvatar ? "block" : "hidden"}  relative h-8 min-h-8 w-8 min-w-8 rounded-full object-cover`}
                />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-8 items-start rounded-full">
                <span className="relative bottom-0 text-lg">
                  {rawTokenAddress[0]}
                </span>
              </div>
            </div>
          )}
          <span>{truncateAddress(ensAddy ?? "")}</span>
        </button>
      </div>
      <div className="flex flex-row gap-2">
        {/* toggle */}
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
          onClick={() => handleTransferHandleOwnership()}
          size="sm"
        >
          Transfer Handle
        </Button>
      ) : (
        <Button
          disabled={isPendingProfile}
          onClick={async () => handleTransferOwnership()}
          size="sm"
        >
          Transfer Profile
        </Button>
      )}
    </div>
  );
};
