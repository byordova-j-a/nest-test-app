export type TComponentProps = {
  currentUser: { id: number; login: string; tabel: string } | null;
};

export type TComponentEmits = {
  (e: 'add-account'): void;
};
