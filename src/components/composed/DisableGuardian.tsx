"use client";
import React from "react";
import { useWriteContract } from "wagmi";
import { Button } from "../ui/button";
import { SessionType, useSession } from "@lens-protocol/react-web";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
const DisableGuardian = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);
  const { writeContractAsync, isPending } = useWriteContract();
  const { toast } = useToast();
  const handleWriteContract = async () => {
    setLoading(true);
    try {
      await writeContractAsync(
        {
          abi: [
            {
              constant: false,
              inputs: [],
              name: "DANGER__disableTokenGuardian",
              outputs: [],
              payable: false,
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
          functionName: "DANGER__disableTokenGuardian",
        },
        {
          onError: (error) => {
            toast({
              title: "Error",
              description: error.message,
            });
          },
          onSuccess: (result) => {
            toast({
              title: "Guardian Disabled",
              description:
                "Your guardian has been disabled. You will have to wait 7 days for the cooldown period to end before you can transfer your profile.",
              action: (
                <ToastAction
                  altText="View Transaction"
                  onClick={() => {
                    window.open(`https://polyscan.io/tx/${result}`, "_blank");
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={
        loading ||
        (session?.type === SessionType.WithProfile &&
          !session?.profile.guardian?.protected &&
          session?.profile?.guardian !== null) ||
        isDisabled ||
        isPending
      }
      onClick={async () => {
        await handleWriteContract();
      }}
    >
      Disable Guardian
    </Button>
  );
};

export default DisableGuardian;
