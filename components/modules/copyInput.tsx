"use client";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { InputGroup, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { ComponentProps, useState, useEffect } from "react";
import { toast } from "sonner";

function CopyInput({ copyValue, ...p }: ComponentProps<typeof InputGroup> & { copyValue: string }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setIsCopied(true);
      toast.success(`متن ${copyValue} کپی شد`);
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = copyValue;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setIsCopied(true);
        toast.success(`متن ${copyValue} کپی شد`);
      } catch {
        toast.error("خطا در کپی کردن متن");
      }
    }
  };

  return (
    <InputGroup dir="ltr" {...p}>
      <InputGroupButton className="group" size={"icon-sm"} onClick={handleCopy}>
        {isCopied ? <CopyCheckIcon className="group-hover:text-primary" /> : <CopyIcon className="group-hover:text-primary" />}
      </InputGroupButton>
      <InputGroupInput
        type="text"
        defaultValue={copyValue}
        readOnly
      />
    </InputGroup>
  )
}

export default CopyInput