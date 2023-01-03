import { Context } from "../context";
interface IsUserAuthed {
    next: any;
    ctx: Context;
}
export declare const isUserAuthed: ({ ctx, next }: IsUserAuthed) => Promise<any>;
export {};
