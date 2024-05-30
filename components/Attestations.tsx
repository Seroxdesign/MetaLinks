"use client";

import { getTimeDifference } from "@/lib/get-time-diiference";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEAS } from "@/lib/hooks/useEAS";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TAttestations } from "@/lib/zod-utils";
import Loader from "@/components/ui/loader";
import { z } from "zod";

const attestationFormSchema = z.object({
  attestation: z.string().min(2, {
    message: "Attestation must be at least 2 characters.",
  }),
});

const AttestationItem = ({ timeCreated, attestationVal, attestor }: any) => {
  const timeDifference = getTimeDifference(timeCreated);
  return (
    <div className="flex w-full bg-[#0e0e0e] flex-col px-6 py-4 justify-center rounded-2xl border-l border-t border-[rgba(255,255,255,0.1)] drop-shadow-md">
      <p className="font-semibold text-lg mb-4">{attestationVal}</p>
      <p className="font-light text-xs">By {attestor}</p>
      <p className="font-light text-xs">{timeDifference}</p>
    </div>
  );
};

export const Attestations = ({ address }: { address: string }) => {
  const { attest, getAttestationsForRecipient, isLoading } = useEAS();
  const [attestation, setAttestion] = useState<string>("");
  const [attestations, setAttestations] = useState<TAttestations>([]);
  const [isAttesting, setIsAttesting] = useState(false);

  useEffect(() => {
    const getAttestationData = async () => {
      const attestationData = await getAttestationsForRecipient(address);
      if (attestationData) {
        setAttestations(attestationData);
      }
    };
    getAttestationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isAttesting]);

  const form = useForm<z.infer<typeof attestationFormSchema>>({
    resolver: zodResolver(attestationFormSchema),
    defaultValues: {
      attestation: "",
    },
  });

  async function handleAttest(data: z.infer<typeof attestationFormSchema>) {
    try {
      const { attestation } = data;
      setIsAttesting(true);
      await attest(attestation, address);
      form.reset();
    } catch (err) {
    } finally {
      setIsAttesting(false);
    }
  }

  return isLoading ? (
    <p className="text-center">Loading...</p>
  ) : (
    <div className="max-w-xl flex flex-col items-center mx-auto">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center py-3 justify-center font-semibold text-white p-1 w-full hover:scale-105 transition-all bg-purple rounded-xl my-3 max-w-md">
            Attest
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] bg-transparent">
          <DialogHeader>
            <DialogTitle>Create Attestation</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAttest)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="attestation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="Write something..."
                        className="w-full p-3 rounded-md min-h-24 bg-zinc-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAttesting && <Loader />}

              <DialogFooter>
                <Button disabled={isAttesting} type="submit">
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-3 w-full">
        {attestations?.map((att, i) => {
          const attestor = att[3].value;
          const timeCreated = att[1].value.value;

          const attestationVal = att[0].value;
          return (
            <AttestationItem
              key={i}
              timeCreated={timeCreated}
              attestor={attestor}
              attestationVal={attestationVal.value}
            />
          );
        })}
      </div>
    </div>
  );
};
