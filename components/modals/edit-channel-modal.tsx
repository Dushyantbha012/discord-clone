"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/components/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import qs from "query-string";
import { ChannelType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be `general`",
    }),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const router = useRouter();

  //@ts-ignore
  const { server, channel } = data;

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setInternalIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: { serverId: server?.id },
      });
      const res = await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setInternalIsLoading(false);
    }
  };

  const handelClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (data?.channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, data]);

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handelClose}>
        <DialogContent className="bg-white dark:bg-zinc-600 dark:text-white text-black p-0 overflow-hidden">
          {!internalIsLoading && (
            <>
              <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                  Edit Channel
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-8 px-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                            Channel Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-black/50"
                              placeholder="Enter Channel Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel Type</FormLabel>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ringh-offset-0 capitalize outline-none">
                                <SelectValue placeholder="Select a Channel Type"></SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(ChannelType).map((type) => {
                                return (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="capitalize"
                                  >
                                    {type.toLowerCase()}
                                  </SelectItem>
                                );
                              })}{" "}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="bg-gray-100 dark:bg-gray-600 px-6 py-4">
                    <Button disabled={isLoading} variant="primary">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
          {internalIsLoading && (
            <>
              <div className="flex items-center justify-center align-middle h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500 my-4" />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
