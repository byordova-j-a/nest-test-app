export type TComponentProps = {
  login?: string;
  tabel?: string;
};

export type TComponentEmits = {
  (e: 'add-account'): void;
  (e: 'authorization', value: boolean): void;
};
