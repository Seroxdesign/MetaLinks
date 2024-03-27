import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.string(),
});

const DonateCrypto = ({
  ethereumAddress,
}: {
  ethereumAddress: `0x${string}`;
}) => {
  const { data: hash, sendTransaction, isPending } = useSendTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { amount } = values;
      console.log(typeof amount);

      sendTransaction({
        to: ethereumAddress,
        value: parseEther(amount.toString()),
      });
    } catch (err) {
      console.log("er", err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md w-full flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-sm">
                Enter amount to donate to {ethereumAddress}
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="outline"
          className="rounded-full px-8 text-md"
          type="submit"
        >
          Donate
        </Button>
      </form>
    </Form>
  );
};

export default DonateCrypto;
