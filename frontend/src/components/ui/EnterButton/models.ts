export enum EColorType {
  BLUE = 'blue',
  GREY = 'grey',
}

export type TComponentProps = {
  disabled: boolean;
  colorStyle: EColorType;
};

export type TComponentEmits = {
  (e: 'click'): void;
};
