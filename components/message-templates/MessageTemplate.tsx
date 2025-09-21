"use client";
import { upsertSMSTemplate } from "@/actions/message-template-actions";
import { useGetSMSTemplates } from "@/hooks/useMessageTemplate";
import { ISMSTemplateDto, ITemplate } from "@/models/message-template";
import { FocusEvent, Suspense } from "react";
import { toast } from "react-toastify";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import { PageHeaderCommon } from "../master-page/page-header";

export function MessageTemplate() {
  const { messageTemplatesData } = useGetSMSTemplates();

  const handleBulurEvent = async (event: FocusEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (messageTemplatesData) {
      const template = messageTemplatesData[
        name as keyof ISMSTemplateDto
      ]! as ITemplate;
      template.messageTemplate = value;
      await upsertSMSTemplate(template);
      toast.success("Changes are updated successfully!");
    }
  };

  return (
    <>
      <PageHeaderCommon />
      <Suspense fallback={<ThreeDotLoader />}>
        <form action="">
          <div className="d-flex flex-column gap-2 shadow-lg rounded my-2 px-5">
            <div className="m-3">
              <label className="form-label" htmlFor="new">
                Message to be Send to Customer when action is New Appointment
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="new"
                name="new"
                defaultValue={messageTemplatesData?.new?.messageTemplate}
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="show">
                Message to be Send to Customer when action is SHOW
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="show"
                name="show"
                defaultValue={messageTemplatesData?.show?.messageTemplate}
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="noShow">
                Message to be Send to Customer when action is NO-SHOW
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="noShow"
                name="noShow"
                defaultValue={messageTemplatesData?.noShow.messageTemplate}
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="reScheduled">
                Message to be Send to Customer when action is RESCHEDULED
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="reScheduled"
                name="reScheduled"
                defaultValue={
                  messageTemplatesData?.reScheduled?.messageTemplate
                }
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="vehicleSold">
                Message to be Send to Customer when vehicle is sold
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="vehicleSold"
                name="vehicleSold"
                defaultValue={
                  messageTemplatesData?.vehicleSold?.messageTemplate
                }
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="registerationDone">
                Message to be Send to Customer when vehicle registeration is
                done
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="registerationDone"
                name="registerationDone"
                defaultValue={
                  messageTemplatesData?.registerationDone?.messageTemplate
                }
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
            <div className="m-3">
              <label className="form-label" htmlFor="licensePlateDispath">
                Message to be Send to Customer when vehicle License Plate
                Delivered
              </label>
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="licensePlateDispath"
                name="licensePlateDispath"
                defaultValue={
                  messageTemplatesData?.licensePlateDispath?.messageTemplate
                }
                onBlur={handleBulurEvent}
                style={{ height: "18rem" }}
              ></textarea>
            </div>
          </div>
        </form>
      </Suspense>
    </>
  );
}
