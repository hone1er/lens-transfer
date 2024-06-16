"use client";
import {
  useProfileManagers,
  SessionType,
  type Session,
  useUpdateProfileManagers,
  type ProfileId,
  polygon,
} from "@lens-protocol/react-web";
import React from "react";
import { Label } from "../ui/label";
import { useEns } from "@/hooks/useEns";
import EnsInputField from "./EnsInputField";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";
import truncateAddress from "@/utils/truncateAddress";
import { useChainId, useConfig } from "wagmi";
import { ToastAction } from "../ui/toast";
import { switchChain } from "@wagmi/core";

export function Delegation({
  session,
}: {
  readonly session: Session | undefined;
}) {
  const {
    rawTokenAddress,
    isValidToAddress,
    ensAddy,
    ensAvatar,
    handleToAddressInput,
  } = useEns();
  const { toast } = useToast();
  const chainId = useChainId();
  const config = useConfig();
  const { execute, loading } = useUpdateProfileManagers();

  const add = async () => {
    if (chainId !== polygon.chainId) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to the Polygon network",
        action: (
          <ToastAction
            onClick={async () =>
              await switchChain(config, { chainId: polygon.chainId })
            }
            altText="Switch Network"
          >
            Switch to Polygon Network
          </ToastAction>
        ),
      });
      return;
    }
    if (!isValidToAddress) return;
    const result = await execute({
      add: [rawTokenAddress],
    });

    if (result.isFailure()) {
      toast({
        title: "Error",
        description: result.error.message,
      });
    }
    if (result.isSuccess()) {
      handleToAddressInput("");

      toast({
        title: "Profile Manager Added",
        description: `The address ${rawTokenAddress} has been added to the profile managers`,
      });
    }
  };

  return (
    <div className="flex w-full max-w-96 flex-col gap-4 place-self-center rounded-lg border p-6 shadow-md md:max-w-full">
      {/* delegation section */}
      <h2 className="text-lg font-semibold">Profile Manager</h2>
      <Label className="text-md font-normal text-gray-800">
        Current Profile Managers:
      </Label>
      <ProfileManagers session={session} />
      {/* delegation input. Address to delegate to and send button */}
      <div className="flex flex-col gap-4">
        <EnsInputField
          disabled={false}
          rawTokenAddress={rawTokenAddress}
          isValidToAddress={isValidToAddress}
          ensAddy={ensAddy as string}
          ensAvatar={ensAvatar!}
          onChange={handleToAddressInput}
        />
        <Button
          onClick={() => add()}
          size="sm"
          disabled={!isValidToAddress || loading}
          className="rounded-lg  p-2 text-white"
        >
          {loading ? "..Adding" : "Add to Profile Managers"}
        </Button>
      </div>
    </div>
  );
}

function ProfileManagers({ session }: { session: Session | undefined }) {
  const chainId = useChainId();
  const config = useConfig();
  const { toast } = useToast();
  const { data, error, loading } = useProfileManagers({
    for:
      session && session.type === SessionType.WithProfile
        ? session.profile.id
        : ("" as ProfileId),
  });
  const { execute } = useUpdateProfileManagers();
  const [updatingAddress, setUpdatingAddress] = React.useState<
    string | undefined
  >();

  const remove = async (address: string) => {
    if (chainId !== polygon.chainId) {
      toast({
        title: "Unsupported Network",
        description: "Please switch to the Polygon network",
        action: (
          <ToastAction
            onClick={async () =>
              await switchChain(config, { chainId: polygon.chainId })
            }
            altText="Switch Network"
          >
            Switch to Polygon Network
          </ToastAction>
        ),
      });
      return;
    }
    setUpdatingAddress(address);
    try {
      const result = await execute({
        remove: [address],
      });

      if (result.isFailure()) {
        console.log(result.error.message);
      }
      if (result.isSuccess()) {
        toast({
          title: "Profile Manager Removed",
          description: `The address ${address} has been removed from the profile managers`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message ?? "",
      });
    } finally {
      setUpdatingAddress(undefined);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-4">
        {data.map(({ address, isLensManager }) => (
          <li key={address}>
            <div className="flex w-full justify-between">
              <p>
                {truncateAddress(address)} -{" "}
                {isLensManager ? "Lens Profile Manager" : "Other"}
              </p>
              <Button
                disabled={updatingAddress === address}
                onClick={() => remove(address)}
                size="icon"
                variant={"destructive"}
                className="rounded-lg p-2 text-white"
              >
                <TrashIcon
                  className={`${updatingAddress === address ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
