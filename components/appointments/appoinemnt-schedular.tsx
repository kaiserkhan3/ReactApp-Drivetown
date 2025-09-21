"use client";
import React, { Suspense, useEffect, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import classes from "./calendar.module.css";
import { useAppointmentCud, useGetAppointments } from "@/hooks/useAppointments";
import moment from "moment";
import { Appointment } from "./Appointment";
import { AppointmentDto } from "@/models/Appoinments";
import DialogModal from "../control-components/DialogModal";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateIsAppointmentVisibleFlag } from "@/app/store/modal-slice";
import { useGetSMSTemplates } from "@/hooks/useMessageTemplate";
import { replaceHashKeys } from "@/utilities/replace-hash-keys";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import { PageHeaderCommon } from "../master-page/page-header";

export default function AppointmentsScheduler() {
  const [currentEvents, setCurrentEvents] = useState([]);
  const { messageTemplatesData } = useGetSMSTemplates();
  const isAppointVisible = useStoreSelector(
    (state) => state.modal.isAppointmentVisble
  );
  const dispatch = useStoreDispatch();

  const [monthYear, setMonthYear] = useState<{
    month: number;
    year: number;
    monthName: string;
  }>({
    month: moment().month() === 0 ? 12 : moment().month(),
    year: moment().month() === 0 ? moment().year() - 1 : moment().year(),
    monthName: moment().subtract(1, "month").format("MMMM"),
  });
  const { upsertAppoinment, isSuccess, status } = useAppointmentCud(
    monthYear.month,
    monthYear.year
  );
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(
    undefined
  );

  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const { appointmentsData, refetch } = useGetAppointments(
    monthYear.month,
    monthYear.year
  );
  const [appoinments, setAppointments] = useState<
    {
      id: string;
      title: string;
      start: string;
      end: string;
      item: AppointmentDto;
    }[]
  >([]);

  const refetchAppointments = async () => {
    const data = await refetch();

    if (data.isSuccess) {
      const events = data.data?.map((item) => {
        return {
          id: item?.appointmentId!.toString(),
          title: item?.customerName!,
          start: moment(item?.appointmentDate!).format("YYYY-MM-DD"),
          end: moment(item?.appointmentDate!).format("YYYY-MM-DD"),
          item: item,
        };
      });
      setAppointments(() => {
        return [...events];
      });
    }
  };

  useEffect(() => {
    refetchAppointments();
  }, [appointmentsData]);

  function handleDateSelect(selectInfo: any) {
    setSelectedEvent(() => undefined);
    setSelectedDate(() => moment(selectInfo.startStr).format("YYYY-MM-DD"));
    dispatch(updateIsAppointmentVisibleFlag({ isAppointmentVisble: true }));
  }

  function handleEventClick(clickInfo: any) {
    setSelectedEvent(
      () => clickInfo.event._def.extendedProps.item.appointmentId
    );
    setSelectedDate(() => undefined);
    dispatch(updateIsAppointmentVisibleFlag({ isAppointmentVisble: true }));
  }

  function handleEvents(events: any) {
    setCurrentEvents(events!);
  }

  const handleDatesSet = (arg: any) => {
    setMonthYear((preState) => {
      return {
        ...preState,
        month:
          moment(arg.endStr).month() === 0 ? 12 : moment(arg.endStr).month(),
        year:
          moment(arg.endStr).month() === 0
            ? moment(arg.endStr).year() - 1
            : moment(arg.endStr).year(),
        monthName: moment(arg.endStr).subtract(1, "month").format("MMMM"),
      };
    });
  };

  function convertDateFormatYYYMMDD(value: string | Date) {
    return moment(value).format("YYYY-MM-DD");
  }

  const handleEventChange = (event: any) => {
    const oldItem = event.event._def.extendedProps.item;
    const item = {
      ...oldItem,
      action: "ReScheduled",
      notes: `Rescheduled From: ${convertDateFormatYYYMMDD(oldItem.appointmentDate)}  to ${convertDateFormatYYYMMDD(
        event.event._instance.range.end
      )}`,
      appointmentDate: convertDateFormatYYYMMDD(
        event.event._instance.range.end
      ),
      sendSMS: true,
      message: replaceHashKeys(
        messageTemplatesData?.reScheduled.messageTemplate!,
        oldItem.customerName,
        "Mike",
        oldItem.vehicleInfo,
        convertDateFormatYYYMMDD(event.event._instance.range.end)
      ),
    };

    upsertAppoinment(item);
  };

  return (
    <>
      {isAppointVisible && (
        <DialogModal top="2rem">
          <Appointment
            appointmentId={selectedEvent}
            selectedDate={selectedDate}
            month={monthYear.month}
            year={monthYear.year}
          />
        </DialogModal>
      )}
      <PageHeaderCommon />
      <div className={classes.demoapp}>
        <Suspense fallback={<ThreeDotLoader />}>
          <div className={`${classes.demoappmain} ${classes.fc}`}>
            {appoinments && (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                //initialEvents={appoinments} // alternatively, use the `events` setting to fetch from a feed
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                eventChange={handleEventChange}
                datesSet={handleDatesSet}
                events={appoinments}

                /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
              />
            )}
          </div>
        </Suspense>
        <Sidebar
          currentEvents={currentEvents}
          monthName={monthYear.monthName}
          handleClickEvent={handleEventClick}
        />
      </div>
    </>
  );
}

function getBackgroundColorByAction(eventInfo: any) {
  let backgroundColor = "rgb(55, 136, 216)";
  const action = eventInfo.event._def.extendedProps.item.action;
  switch (action) {
    case "ReScheduled":
      backgroundColor = "orange";
      break;
    case "Show":
      backgroundColor = "green";
      break;
    case "NoShow":
      backgroundColor = "red";
      break;
    default:
      backgroundColor = "rgb(55, 136, 216)";
      break;
  }
  return backgroundColor;
}

function renderEventContent(eventInfo: any) {
  const action = eventInfo.event._def.extendedProps.item.action;
  let backgroundColor = "";
  switch (action) {
    case "ReScheduled":
      backgroundColor = "orange";
      break;
    case "Show":
      backgroundColor = "green";
      break;
    case "NoShow":
      backgroundColor = "red";
      break;
    default:
      backgroundColor = "rgb(55, 136, 216)";
      break;
  }
  eventInfo.event._def.ui.backgroundColor = backgroundColor;
  return (
    <>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function Sidebar({
  currentEvents,
  monthName,
  handleClickEvent,
}: {
  currentEvents: any;
  monthName: string;
  handleClickEvent: (event: any) => void;
}) {
  return (
    <div className={classes.demoappsidebar}>
      <Legend />
      <div className={classes.demoappsidebarsection}>
        <h2>Instructions</h2>
        <ul>
          <li>
            Select dates and you will be prompted to create a new Appoinment
          </li>
          <li>Drag and drop to reschedule the Appointment</li>
          <li>
            Click an event to Update the Appoinment date in case unable to drag
            and drop
          </li>
        </ul>
      </div>

      <div className={classes.demoappsidebarsection}>
        <h2>
          {monthName} ({currentEvents.length})
        </h2>
        <ul>
          {currentEvents.map((event: any) => (
            <SidebarEvent
              key={event.id}
              event={event}
              handleClickEvent={handleClickEvent}
            />
          ))}
        </ul>
      </div>
      {/* <Appointment /> */}
    </div>
  );
}

function SidebarEvent({
  event,
  handleClickEvent,
}: {
  event: any;
  handleClickEvent: (event: any) => void;
}) {
  return (
    <li
      key={event.id}
      className="p-1 m-1"
      style={{
        backgroundColor: `${getBackgroundColorByAction({ event: event })}`,
        cursor: "pointer",
      }}
      onClick={() => handleClickEvent({ event: event })}
    >
      <b className="me-2">
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}

function Legend() {
  return (
    <div>
      <h4 className="m-2">Legend:</h4>
      <div className="d-flex justify-content-md-between m-2">
        <div
          className="p-2 rounded"
          style={{ backgroundColor: "rgb(55, 136, 216)" }}
        >
          Created
        </div>
        <div className="p-2 bg-success rounded">Show</div>
        <div className="p-2 bg-danger rounded">NoShow</div>
        <div className="p-2 bg-warning rounded">Rescheduled</div>
      </div>
    </div>
  );
}
