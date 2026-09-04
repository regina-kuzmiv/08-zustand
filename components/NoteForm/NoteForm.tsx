import * as yup from "yup";
import { useId } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import css from "./NoteForm.module.css";

type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface NoteFormValuesProps {
  title: string;
  content: string;
  tag: Tag;
}

interface NoteFormProps {
  onSubmit: ({ title, content, tag }: NoteFormValuesProps) => void;
}

const NoteFormSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: yup.string().max(500, "Note is too long"),
  tag: yup
    .string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });


  const formAction = (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as Tag;
    onSubmit({ title, content, tag });
  }
    return (
      <form action={formAction} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <input
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <textarea
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <select id={`${fieldId}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className={css.actions}>
          {/* <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button> */}
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </form>
      // </Formik>
    );
  };
}
