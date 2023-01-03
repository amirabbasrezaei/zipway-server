import { z } from "zod";
export declare const sendSMSSchema: z.ZodObject<{
    body: z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        from: string;
        to: string;
    }, {
        text: string;
        from: string;
        to: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        text: string;
        from: string;
        to: string;
    };
}, {
    body: {
        text: string;
        from: string;
        to: string;
    };
}>;
interface SendSMSPayload {
    recId: string;
    status: string;
}
export type SendSMSSchema = z.infer<typeof sendSMSSchema>;
export declare function sendSMSCodeController({ body, }: SendSMSSchema): Promise<SendSMSPayload>;
interface checkSMSRecievedPayload {
    results: string[];
    resultsAsCode: number[];
    status: string[];
    isSuccuss: boolean;
}
export declare function checkSMSRecieved({ SMSIds, }: {
    SMSIds: number[];
}): Promise<checkSMSRecievedPayload>;
export {};
