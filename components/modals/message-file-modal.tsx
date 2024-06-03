"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qs from "query-string";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "../file-upload";
import axios from "axios";
import { useModal } from "@/components/hooks/use-modal-store";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required" }),
});

export const MessageFile = () => {
  const { isOpen, onOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "messageFile";
  const apiUrl = data?.apiUrl;
  const query = data?.query;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({ url: apiUrl || "", query });
      const res = axios.post(url, { ...values, content: values.fileUrl });
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handelClose = () => {
    form.reset();
    onClose();
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={handelClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Add an Attachment
            </DialogTitle>
            <DialogDescription>Send a file as a message</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button disabled={isLoading} variant="primary">
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};