import Image from "next/image";

import notFoundImg from "@/public/images/404.svg";

function NotFoundPage() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
      <Image
        width={750}
        height={750}
        alt="not found"
        src={notFoundImg}
        className="max-w-full aspect-square p-6 dark:brightness-150"
      />
    </div>
  );
}

export default NotFoundPage;
