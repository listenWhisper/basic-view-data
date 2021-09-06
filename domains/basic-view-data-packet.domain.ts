import {UtilTools} from '../share';
export class BasicViewDataPacket{
  private readonly __property: BasicViewDataPacketProperty;

  constructor() {
    this.__property = new BasicViewDataPacketProperty();
  }

  get uuid(): string{
    return this.__property.uuid;
  }

  get isActive(): boolean {
    return this.__property.isActive;
  }

  set isActive(value: boolean) {
    this.__property.isActive = value;
  }

  get isChecked(): boolean {
    return this.__property.isChecked;
  }

  set isChecked(value: boolean) {
    this.__property.isChecked = value;
  }

  get isSelected(): boolean {
    return this.__property.isSelected;
  }

  set isSelected(value: boolean) {
    this.__property.isSelected = value;
  }

  get isLoading(): boolean {
    return this.__property.isLoading;
  }

  set isLoading(value: boolean) {
    this.__property.isLoading = value;
  }

  get isLoaded(): boolean {
    return this.__property.isLoaded;
  }

  set isLoaded(value: boolean) {
    this.__property.isLoaded = value;
  }

  get isShow(): boolean {
    return this.__property.isShow;
  }

  set isShow(value: boolean) {
    this.__property.isShow = value;
  }

  get isVisited(): boolean {
    return this.__property.isVisited;
  }

  set isVisited(value: boolean) {
    this.__property.isVisited = value;
  }

  get indexOfList(): number {
    return this.__property.indexOfList;
  }

  set indexOfList(index: number) {
    this.__property.indexOfList = index;
  }
}

export class BasicViewDataPacketProperty {
  readonly uuid: string;
  isActive: boolean;
  isChecked: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isVisited: boolean;
  isShow: boolean;
  isSelected: boolean;
  indexOfList: number;

  constructor() {
    this.uuid = UtilTools.uuid();
    this.isActive = false;
    this.isChecked = false;
    this.isLoading = false;
    this.isVisited = false;
    this.isShow = true;
    this.isSelected = false;
    this.isLoaded = false;
    this.indexOfList = -1;
  }
}
