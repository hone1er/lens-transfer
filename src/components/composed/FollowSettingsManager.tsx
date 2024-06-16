"use client";
import React, { useEffect, useState } from "react";
import {
  type FollowPolicy,
  FollowPolicyType,
  SessionType,
  resolveFollowPolicy,
  useSession,
  useUpdateFollowPolicy,
  Amount,
  erc20,
  ChainType,
} from "@lens-protocol/react-web";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  followPolicy: z.enum(
    [
      FollowPolicyType.ANYONE,
      FollowPolicyType.CHARGE,
      FollowPolicyType.NO_ONE,
      FollowPolicyType.UNKNOWN,
    ],
    {
      required_error: "You need to select a follow policy.",
    },
  ),
});

export function FollowSettingsManager() {
  const { execute, loading, error } = useUpdateFollowPolicy();
  const { data: session, loading: loadingSession } = useSession();

  const [selectedPolicy, setSelectedPolicy] = useState(FollowPolicyType.ANYONE);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async () => {
    if (selectedPolicy !== FollowPolicyType.CHARGE) {
      await execute({
        followPolicy: {
          type: selectedPolicy as
            | FollowPolicyType.ANYONE
            | FollowPolicyType.NO_ONE,
        },
      });
    } else if (selectedPolicy === FollowPolicyType.CHARGE) {
      await execute({
        followPolicy: {
          type: selectedPolicy as FollowPolicyType.CHARGE,
          amount: Amount.erc20(
            erc20({
              name: "wrapped ether",
              decimals: 18,
              symbol: "WETH",
              address: "0x",
              chainType: ChainType.POLYGON,
            }),
            amount,
          ),
          recipient,
        },
      });
    }
  };

  const followPolicy =
    session?.authenticated &&
    session.type === SessionType.WithProfile &&
    resolveFollowPolicy(session?.profile);

  return (
    <div className="container relative mx-auto px-4 py-12 md:px-6 md:py-16 ">
      {/* coming soon layover */}
      {/* <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-gray-900 bg-opacity-50 font-bold text-white">
        <p>Follow Policy Manger is coming soon!</p>
      </div> */}
      <div className="z-0 mx-auto max-w-2xl ">
        <div className="rounded-lg bg-white p-6 shadow-lg  dark:bg-gray-900 md:p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold">Manage Follow Policy</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Control who can follow your social media account.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Current Follow Policy
              </h2>
              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {loadingSession
                    ? "...loading"
                    : (followPolicy as FollowPolicy)?.type}
                </p>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Change Follow Policy
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    defaultValue={selectedPolicy}
                    control={form.control}
                    name="followPolicy"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Change Follow Policy</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val: string) => {
                              setSelectedPolicy(val as FollowPolicyType);
                              field.onChange(val);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={FollowPolicyType.ANYONE}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Anyone can follow
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={FollowPolicyType.NO_ONE}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                No one can follow
                              </FormLabel>
                            </FormItem>
                            {/* <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={FollowPolicyType.CHARGE}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Charge to follow
                              </FormLabel>
                            </FormItem> */}
                          </RadioGroup>
                        </FormControl>
                        {selectedPolicy === FollowPolicyType.CHARGE && (
                          <div className="space-y-4">
                            <div className="flex w-full flex-col gap-4">
                              <FormItem>
                                <FormLabel
                                  htmlFor="recipient"
                                  className="mb-1 block text-sm font-medium"
                                >
                                  Recipient
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="recipient"
                                    type="text"
                                    value={recipient}
                                    onChange={(e) =>
                                      setRecipient(e.target.value)
                                    }
                                    placeholder="Enter recipient's username"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormDescription>
                                  The recipient will receive the payment
                                </FormDescription>
                              </FormItem>
                              <FormItem>
                                <FormLabel
                                  htmlFor="amount"
                                  className="mb-1 block text-sm font-medium"
                                >
                                  Amount
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormDescription>
                                  The amount to charge for follow
                                </FormDescription>
                              </FormItem>
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            {error && (
              <div className="text-red-500">
                <p>Error updating follow policy: {error.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
