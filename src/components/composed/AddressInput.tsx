"use client";
import { useEffect, useState } from "react";
import { erc721Abi, isAddress } from "viem";
import Image from "next/image";
import useEnsProfile from "@/hooks/useEnsProfile";
import truncateAddress from "@/utils/truncateAddress";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  type Profile,
  SessionType,
  useSession,
} from "@lens-protocol/react-web";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useToast } from "../ui/use-toast";

interface AddressInputProps extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean;
  profile: Profile;
}

export const AddressInput = ({
  disabled = false,
  profile,
}: AddressInputProps) => {
  const [isValidToAddress, setIsValidToAddress] = useState<boolean>(false);
  const [rawTokenAddress, setRawTokenAddress] = useState<string>("");
  const { ensAddress: ensAddy, ensAvatar } = useEnsProfile({
    ensName: rawTokenAddress,
  });

  const [handleId, setHandleId] = useState<string | null>(null);

  const { address } = useAccount();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profileTxHash, setProfileTxHash] = useState<string | null>(null);
  const [handleTxHash, setHandleTxHash] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const profileTxReceipt = useWaitForTransactionReceipt({
    hash: profileTxHash as `0x${string}`,
  });
  const handleTxReceipt = useWaitForTransactionReceipt({
    hash: handleTxHash as `0x${string}`,
  });
  const [writingContract, setWritingContract] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();

  const handleTransferOwnership = async () => {
    setWritingContract(true);
    if (!isValidToAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address",
      });
      setWritingContract(false);
      return;
    }

    try {
      await writeContractAsync(
        {
          abi: erc721Abi,
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
          onSettled: (result) => {
            setProfileTxHash(result as string);
          },
        },
      );
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message ?? "",
      });
    } finally {
      setWritingContract(false);
    }
  };

  const handleTransferHandleOwnership = async () => {
    setWritingContract(true);
    if (!isValidToAddress) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid address",
      });
      setWritingContract(false);
      return;
    }

    try {
      await writeContractAsync(
        {
          abi: erc721Abi,
          address: process.env
            .NEXT_PUBLIC_LENS_HANDLE_CONTRACT as `0x${string}`,
          functionName: "safeTransferFrom",
          args: [
            address!,
            rawTokenAddress as `0x${string}`,
            profile.id as unknown as bigint,
          ],
        },
        {
          onSuccess: (result) => {
            setHandleTxHash(result as string);
          },
        },
      );
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message ?? "",
      });
    } finally {
      setWritingContract(false);
    }
  };

  useEffect(() => {
    if (profileTxReceipt?.status === "success") {
      toast({
        title: "Profile Ownership Transferred",
        description: "Ownership has been transferred successfully",
      });
    }
  }, [profileTxReceipt, toast]);

  useEffect(() => {
    if (handleTxReceipt?.status === "success") {
      toast({
        title: "Handle Ownership Transferred",
        description: "Ownership has been transferred successfully",
      });
    }
  }, [handleTxReceipt, toast]);

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
      {profileTxReceipt.status === "success" ? (
        <Button
          disabled={writingContract}
          onClick={() => handleTransferHandleOwnership()}
          size="sm"
        >
          Transfer Handle
        </Button>
      ) : (
        <Button
          disabled={writingContract}
          onClick={() => handleTransferOwnership()}
          size="sm"
        >
          Transfer Profile
        </Button>
      )}
    </div>
  );
};