import ThreeDotLoader from "@/components/loading-control/Three-dots-loader/ThreeDotsLoader";
import { MessageTemplate } from "@/components/message-templates/MessageTemplate";
import { Suspense } from "react";

export default function SMSTemplates() {
  return (
    <Suspense fallback={<ThreeDotLoader />}>
      <MessageTemplate />
    </Suspense>
  );
}
