import {Optional} from "./misc.interface";

export const removeZeroPaddings = (s: string): string => {
    if(!s?.trim()) {
        return '';
    }
    let str = s.replace(/^0+/, '');
    if(str.startsWith('.')) {
        str = '0' + str;
    }
    return str.trim();
}

export const toNumber = (s: string): Optional<number> => {
    try {
        return JSON.parse(s);
    } catch (e){
        return undefined;
    }
}

