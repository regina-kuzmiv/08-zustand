import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NoteCreateProps } from "../api";

type NoteDraftStore = {
  draft: NoteCreateProps;
  setDraft: (note: NoteCreateProps) => void;
  clearDraft: () => void;
};

const initialDraft: NoteCreateProps = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);

// Під час створення Zustand-стору в TypeScript використовуйте подвійні дужки після create, інакше типи визначаться некоректно.
// Наприклад:
// create<AuthStore>()((set) => ({ ... }))
// Інтегруйте цей стор у компонент NoteForm. Щоразу при переході на маршрут /notes/action/create draft з стану Zustand повинен підставлятися в defaultValue відповідних полів форми.

// У процесі створення нотатки всі зміни мають зберігатися у draft в Zustand одразу при зміні полів. Для цього використайте подію onChange на полях форми і викликайте setDraft у сторі з актуальними даними.

// У Zustand store draft зберігається як об’єкт. Будьте уважні — під час оновлення необхідно зберігати попередні значення інших полів draft.

// При успішному сабміті форми та створенні нотатки на сервері:
// очистіть draft через метод clearDraft;
// інвалідуйте кеш за допомогою хука useQueryClient;
// перенаправте користувача на маршрут /notes/filter/all. Для навігації використайте router.push (з router.back ви не отримаєте нову нотатку на сторінці)

// При натисканні кнопки «Cancel» draft не має очищатися, щоб можна було повернутися до створення пізніше з попереднім прогресом. При цьому користувач має повернутися на попередній маршрут.
