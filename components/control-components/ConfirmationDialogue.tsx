type ConfirmationDialogueProps = {
  header?: string;
  body: string;
  btnNoText?: string;
  btnYesText?: string;
  onNoBtnClick: () => void;
  onYesBtnClick: () => void;
};

export function ConfirmationDialogue({
  header,
  body,
  btnNoText,
  btnYesText,
  onNoBtnClick,
  onYesBtnClick,
}: ConfirmationDialogueProps) {
  return (
    <div className="d-flex flex-column gap-2 align-content-center p-4">
      <section>
        <h4> {header || "Are you sure?"}</h4>
        <hr />
      </section>
      <div className="mt-3">{body || "Do you want to mark it as unsold?"}</div>
      <div className="d-flex justify-content-end gap-2 mt-3 me-3">
        <button className="btn btn-danger btn-hover" onClick={onNoBtnClick}>
          {btnNoText || "No"}
        </button>
        <button className="btn btn-primary btn-hover" onClick={onYesBtnClick}>
          {btnYesText || "YES"}
        </button>
      </div>
    </div>
  );
}
