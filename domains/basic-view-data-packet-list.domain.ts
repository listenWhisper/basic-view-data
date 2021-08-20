import {BasicViewDataPacket} from './basic-view-data-packet.domain';

export class BasicViewDataPacketList<T extends BasicViewDataPacket> extends BasicViewDataPacket{
    public _Items: T[];
    constructor(option: Partial<BasicViewDataPacketList<T>> = {}) {
        super();
        this._Items = [];
    }

    get items(): T[]{
        return this._Items
    }

    set items(data: T[]){
        this._Items = data;
    }

    get count(): number{
        return this.items.length;
    }

    public getItem(index: number): T{
        return this._Items[index];
    }

    public setItem(item: T, index: number): BasicViewDataPacketList<T>{
        this._Items[index] = item;
        return this;
    }

    get first(): T{
       return this.getItem(0);
    }

    get last(): T{
        return this.getItem(this.count -1);
    }

    public append(item: T | BasicViewDataPacketList<T> | T[]){
        if(!item){
            return this;
        }
        if(item instanceof BasicViewDataPacketList){
            return this.append(item._Items);
        } else if (item instanceof Array){
            this._Items.push(...item);
        }else{
            this._Items.push(item);
        }
        this.resetIndex();
        return this;
    }

    public resetIndex(startIndex: number = 0): void {
        for (let i = startIndex; i < this.count; i++) {
            this._Items[i].indexOfList = i;
        }
    }

}
