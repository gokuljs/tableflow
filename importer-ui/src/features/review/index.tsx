import { FormEvent, useEffect } from "react";
import { Button, Errors, Table } from "@tableflow/ui-library";
import usePostUpload from "../../api/usePostUpload";
import useReviewTable from "./hooks/useReviewTable";
import { ReviewProps } from "./types";
import style from "./style/Review.module.scss";

export default function Review({ upload, template, onSuccess, onCancel, skipHeaderRowSelection }: ReviewProps) {
  if (upload?.template) {
    template = upload.template;
  }
  const { rows, formValues } = useReviewTable(upload?.upload_columns, template?.template_columns);

  const { mutate, error, isSuccess, isLoading } = usePostUpload(upload?.id || "");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const columns = Object.keys(formValues).reduce((acc, key) => {
      const { template, use } = formValues[key];
      return { ...acc, ...(use ? { [key]: template } : {}) };
    }, {});

    mutate(columns);
  };

  useEffect(() => {
    if (isSuccess && !error && !isLoading && upload) {
      onSuccess(upload.id);
    }
  }, [isSuccess]);

  if (!rows || !rows?.length) return null;

  return (
    <div className={style.content}>
      <form onSubmit={onSubmit}>
        {upload ? (
          <div className={style.tableWrapper}>
            <Table data={rows} background="dark" columnWidths={["20%", "30%", "30%", "20%"]} columnAlignments={["", "", "", "center"]} fixHeader />
          </div>
        ) : (
          <>Loading...</>
        )}

        <div className={style.actions}>
          <Button type="button" variants={["secondary"]} onClick={onCancel}>
            {skipHeaderRowSelection ? "Cancel" : "Back"}
          </Button>
          <Button variants={["primary"]} disabled={isLoading}>
            Submit
          </Button>
        </div>

        {!isLoading && !!error && (
          <div className={style.errorContainer}>
            <Errors error={error} />
          </div>
        )}

        {isSuccess && <p>Success!</p>}
      </form>
    </div>
  );
}
