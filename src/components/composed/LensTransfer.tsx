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

const PERMISSIONLESS_CREATOR_ABI = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "lensHub", type: "address" },
      { internalType: "address", name: "lensHandles", type: "address" },
      { internalType: "address", name: "tokenHandleRegistry", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "HandleAlreadyExists", type: "error" },
  { inputs: [], name: "HandleLengthNotAllowed", type: "error" },
  { inputs: [], name: "InsufficientCredits", type: "error" },
  { inputs: [], name: "InvalidFunds", type: "error" },
  { inputs: [], name: "NotAllowed", type: "error" },
  { inputs: [], name: "OnlyCreditProviders", type: "error" },
  { inputs: [], name: "OnlyOwner", type: "error" },
  { inputs: [], name: "OnlyOwnerOrHub", type: "error" },
  { inputs: [], name: "ProfileAlreadyLinked", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creditAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "remainingCredits",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CreditBalanceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creditProvider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isCreditProvider",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "CreditProviderStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "handleId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "handle",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "HandleCreatedUsingCredits",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "HandleCreationPriceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "newMinLength",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "HandleLengthMinChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "profileId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProfileCreatedUsingCredits",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProfileCreationPriceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "targetAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isUntrusted",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "TrustStatusChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "LENS_HANDLES",
    outputs: [
      { internalType: "contract ILensHandles", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LENS_HUB",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OWNER",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_HANDLE_REGISTRY",
    outputs: [
      {
        internalType: "contract ITokenHandleRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "creditProvider", type: "address" },
    ],
    name: "addCreditProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "handle", type: "string" },
    ],
    name: "createHandle",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "handle", type: "string" },
    ],
    name: "createHandleUsingCredits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct Types.CreateProfileParams",
        name: "createProfileParams",
        type: "tuple",
      },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]",
      },
    ],
    name: "createProfile",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct Types.CreateProfileParams",
        name: "createProfileParams",
        type: "tuple",
      },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]",
      },
    ],
    name: "createProfileUsingCredits",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct Types.CreateProfileParams",
        name: "createProfileParams",
        type: "tuple",
      },
      { internalType: "string", name: "handle", type: "string" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]",
      },
    ],
    name: "createProfileWithHandle",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "address", name: "followModule", type: "address" },
          {
            internalType: "bytes",
            name: "followModuleInitData",
            type: "bytes",
          },
        ],
        internalType: "struct Types.CreateProfileParams",
        name: "createProfileParams",
        type: "tuple",
      },
      { internalType: "string", name: "handle", type: "string" },
      {
        internalType: "address[]",
        name: "delegatedExecutors",
        type: "address[]",
      },
    ],
    name: "createProfileWithHandleUsingCredits",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "decreaseCredits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "targetAddress", type: "address" },
    ],
    name: "getCreditBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHandleCreationPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHandleLengthMin",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProfileCreationPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "profileId", type: "uint256" }],
    name: "getProfileCreatorUsingCredits",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProfileWithHandleCreationPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "increaseCredits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "targetAddress", type: "address" },
    ],
    name: "isCreditProvider",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "targetAddress", type: "address" },
    ],
    name: "isUntrusted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "creditProvider", type: "address" },
    ],
    name: "removeCreditProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint128", name: "newPrice", type: "uint128" }],
    name: "setHandleCreationPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "newMinLength", type: "uint8" }],
    name: "setHandleLengthMin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint128", name: "newPrice", type: "uint128" }],
    name: "setProfileCreationPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "targetAddress", type: "address" },
      { internalType: "bool", name: "setAsUntrusted", type: "bool" },
    ],
    name: "setTrustStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "transferFromKeepingDelegates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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
    setHandleId(profile?.handle?.id ?? null);
  }, [profile?.handle?.id]);

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
          abi: PERMISSIONLESS_CREATOR_ABI,
          address: process.env
            .NEXT_PUBLIC_LENS_PERMISSIONLESS_CREATOR_CONTRACT as `0x${string}`,
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
        description:
          <p className="break-all">{(error as Error)?.message}</p> ?? "",
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
        description:
          <p className="break-all">{(error as Error)?.message}</p> ?? "",
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
