"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useModal } from "@/components/hooks/use-modal-store";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().min(1, { message: "Server image is required" }),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "createServer";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  if (isModalOpen) console.log("modal open");
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setInternalIsLoading(true);

      const res = await axios.post("/api/servers", values);
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
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handelClose}>
        <DialogContent className="bg-white dark:bg-zinc-600 dark:text-white text-black p-0 overflow-hidden">
          {internalIsLoading && (
            <>
              <div className="flex items-center justify-center align-middle h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500 my-4" />
              </div>
            </>
          )}

          {!internalIsLoading && (
            <>
              <DialogHeader className="pt-8 px-6">
                <DialogTitle className="text-2xl text-center font-bold">
                  Customize your server
                </DialogTitle>
                <DialogDescription>
                  Give your server a personality with a name and an image. [You
                  can always change it later]
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="space-y-8 px-6">
                    <div className="flex items-center justify-center text-center">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FileUpload
                                endpoint="serverImage"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormDescription>
                      <div className="w-full text-center">
                        Click UPLOAD button to upload image
                      </div>
                    </FormDescription>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                            Server Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 placeholder:text-black/50"
                              placeholder="Enter Server Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter className="bg-gray-100 dark:bg-gray-600 px-6 py-4">
                    <Button disabled={isLoading} variant="primary">
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
