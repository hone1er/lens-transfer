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
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useToast } from "../ui/use-toast";

import { useChainId, useConfig } from "wagmi";
import { ToastAction } from "../ui/toast";
import { switchChain } from "@wagmi/core";
import truncateAddress from "@/utils/truncateAddress";

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
    <div className="flex w-full  flex-col gap-4 place-self-center rounded-lg border p-6 shadow-md md:max-w-full">
      {/* delegation section */}
      <h2 className="text-lg font-semibold">Profile Manager</h2>

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
  const { execute: executeAdd, loading: loadingAdd } =
    useUpdateProfileManagers();

  const { execute } = useUpdateProfileManagers();
  const [updatingAddress, setUpdatingAddress] = React.useState<
    string | undefined
  >();

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

    const result = await executeAdd({
      add: [lensManager],
    });

    if (result.isFailure()) {
      toast({
        title: "Error",
        description: result.error.message,
      });
    }
    if (result.isSuccess()) {
      toast({
        title: "Profile Manager Added",
        description: `The Lens Manager has been added to the profile managers. You can now do signless transactions.`,
      });
    }
  };

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
  const lensManager = "0x261f569aF27EE068f7C1b26141f3570d2Ed90548";
  const isSignless = data.find(({ address }) => address === lensManager);
  return (
    <>
      <div className="flex w-full justify-between rounded-lg border p-4 shadow-md">
        {isSignless ? (
          <>
            <p className="p-2">Disable signless transactions</p>
            <Button
              onClick={() => remove(lensManager)}
              size="icon"
              variant={"destructive"}
              className="rounded-lg p-2 text-white"
            >
              <PencilIcon
                className={`${updatingAddress === lensManager ? "animate-spin" : ""}`}
              />
            </Button>
          </>
        ) : (
          <>
            <p className="p-2">Enable signless transactions</p>
            <Button
              onClick={() => add()}
              size="icon"
              disabled={loadingAdd}
              variant={"ghost"}
              className="rounded-lg p-2 text-white"
            >
              <PlusIcon
                className={`${updatingAddress === lensManager ? "animate-spin" : ""}`}
              />
            </Button>
          </>
        )}
      </div>
      <Label className="text-md font-normal text-gray-800">
        Current Profile Managers:
      </Label>
      <div className="flex flex-col gap-4">
        <ul className="space-y-4">
          {data.map(({ address, isLensManager }) => {
            if (isLensManager) return null;
            return (
              <li key={address}>
                <div className="flex w-full items-center justify-between rounded-lg p-4 shadow-md">
                  <p>{truncateAddress(address)}</p>
                  <Button
                    disabled={updatingAddress === address}
                    onClick={() => remove(address)}
                    size="icon"
                    variant={"outline"}
                    className="rounded-lg border border-red-500 p-2 text-red-500"
                  >
                    <TrashIcon
                      className={`${updatingAddress === address ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
