export enum EInputType {
  TEXT = 'text',
  SELECT = 'select',
}

export enum EStyleType {
  OUTLINED = 'outlined',
  TONAL = 'tonal',
}

type TItem = {
  id: number;
  value: string;
};

export type TComponentProps = {
  type: EInputType;
  items?: TItem[];
  label: string;
  style?: EStyleType;
};

export const defalutProps = {
  items: () => [],
  style: EStyleType.OUTLINED,
};
