"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  PaperclipIcon,
  SendIcon,
  XIcon,
  DownloadIcon,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next/client";
import {
  getTicketDetail,
  sendTicketMessage,
} from "@/lib/fetchs";
import { fileUploader } from "@/lib/fetchs";
import { toast } from "sonner";
import { brand } from "@/brand";

function DashboardTicketDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const token = getCookie("token") || "";
  const ticketId = +(params.id as string) || 0;

  const [message, setMessage] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: ticketData, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketDetail({ token, id: ticketId }),
    enabled: !!token && ticketId > 0,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendTicketMessage,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success("پیام با موفقیت ارسال شد");
        setMessage("");
        queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        // Scroll to bottom after sending message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        toast.error("خطا در ارسال پیام");
      }
    },
    onError: () => {
      toast.error("خطا در ارسال پیام");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد");
      e.target.value = "";
      return;
    }

    if (!token) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      e.target.value = "";
      return;
    }

    setIsUploadingFile(true);
    try {
      const uploadResponse = await fileUploader({
        file,
        token: token as string,
      });

      if (uploadResponse.status === 200 && uploadResponse.result?.data) {
        const filePath =
          uploadResponse.result.data.orginalPath ||
          uploadResponse.result.data.path;
        setUploadedFileUrl(filePath);
        toast.success("فایل با موفقیت آپلود شد");
      } else {
        toast.error("خطا در آپلود فایل");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("خطا در آپلود فایل");
    } finally {
      setIsUploadingFile(false);
      e.target.value = "";
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() && !uploadedFileUrl) {
      toast.error("لطفا پیام یا فایل خود را وارد کنید");
      return;
    }

    sendMessageMutation.mutate({
      token,
      ticketId,
      message: message.trim() || "",
      ticketMessageDocuments: uploadedFileUrl
        ? [{ fileUrl: uploadedFileUrl }]
        : undefined,
    });

    // Clear uploaded file after sending
    setUploadedFileUrl(null);
  };

  const ticket = ticketData?.result?.data;
  const messages = ticket?.ticketMessages || [];

  // Scroll to bottom when messages change or page loads
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages.length, ticketData]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("fa");
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: number) => {
    return status === 1 ? "باز" : "بسته شده";
  };

  const getStatusClass = (status: number) => {
    return status === 1 ? "bg-green-600 not-dark:text-background" : "bg-background not-dark:text-background";
  };

  if (isLoading) {
    return (
      <>
        <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
          <h1 className="title">جزئیات تیکت</h1>
          <Link href={"/dashboard/support"}>
            <Button variant={"outline"} size={"icon"}>
              <ChevronLeftIcon />
            </Button>
          </Link>
        </div>
        <div className="text-center py-6">در حال بارگذاری...</div>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
          <h1 className="title">جزئیات تیکت</h1>
          <Link href={"/dashboard/support"}>
            <Button variant={"outline"} size={"icon"}>
              <ChevronLeftIcon />
            </Button>
          </Link>
        </div>
        <div className="text-center py-6">تیکت یافت نشد</div>
      </>
    );
  }

  return (
    <>
      <div className="card flex items-center space-y-0 justify-between gap-3 mb-6 lg:hidden">
        <h1 className="title">جزئیات تیکت</h1>
        <Link href={"/dashboard/support"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="card space-y-0 flex items-center gap-3">
        <Link className="max-lg:hidden" href={"/dashboard/support"}>
          <Button size={"icon"} variant={"ghost"}>
            <ArrowRightIcon />
          </Button>
        </Link>
        <h1 className="title">{ticket.subject}</h1>
        <span className={`mr-auto py-1 px-3 rounded-sm ${getStatusClass(ticket.status)}`}>
          {getStatusText(ticket.status)}
        </span>
      </div>

      <div className="h-[75vh] border-2 my-6 rounded-lg">
        <div className="h-[calc(100%-5rem)] overflow-y-auto pb-3">
          {messages.length === 0 ? (
            <div className="text-center py-6 opacity-50">
              هنوز پیامی ثبت نشده است
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg w-max max-w-11/12 overflow-hidden mt-3 max-sm:text-sm ${msg.isAdmin
                  ? "bg-foreground/10 ml-3 mr-auto"
                  : "bg-primary/10 mr-3 ml-auto"
                  }`}
              >
                <p>{msg.message}</p>
                {msg.ticketMessageDocuments &&
                  msg.ticketMessageDocuments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3">
                      {msg.ticketMessageDocuments.map((doc) => (
                        <a
                          download
                          key={doc.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={brand.apiBaseUrl + doc.fileUrl}
                          className="flex items-center gap-1.5 text-xs text-secondary hover:underline"
                        >
                          <DownloadIcon className="size-3.5" />
                          <span>دانلود فایل</span>
                        </a>
                      ))}
                    </div>
                  )}
                <div className="flex items-center justify-between gap-3 mt-2">
                  <span className="text-xs opacity-50">{msg.fullName}</span>
                  <span className="text-xs opacity-50" dir="ltr">
                    {formatDate(msg.createdOn)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        {ticket.status === 1 && (
          <div className="h-20 border-t-2 flex items-center gap-3 px-3">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="*/*"
            />
            <Button
              size={"icon"}
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || isUploadingFile}
            >
              <SendIcon />
            </Button>
            <InputGroup className="pe-3">
              <InputGroupInput
                type="text"
                placeholder={
                  uploadedFileUrl
                    ? "فایل آپلود شد. پیام خود را بنویسید..."
                    : "بنویسید..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <InputGroupButton
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                type="button"
              >
                {isUploadingFile ? (
                  <span className="text-xs">در حال آپلود...</span>
                ) : (
                  <PaperclipIcon />
                )}
              </InputGroupButton>
            </InputGroup>
            {uploadedFileUrl && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setUploadedFileUrl(null)}
                type="button"
                className="text-red-500"
              >
                <XIcon />
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardTicketDetailPage;
