declare const getCities = "https://cabinet.taximaxim.ir/0000/Services/Public.svc/CitiesEx";
declare const sendVerifyCode = "https://cabinet.taximaxim.ir/0000/Services/Public.svc/api/v2/login/code/sms/send?device=samsung%2FSM-A525F%2F11&source=orderacar&udid=dbdd557d8431b68e&version=3.14.6o";
declare const sendVerifyCodeBody: {
    locale: string;
    phone: string;
    type: string;
    smstoken: string;
    isDefault: string;
    mcc: string;
};
declare const verifyCode = "https://cabinet.taximaxim.ir/0000/Services/Public.svc/api/v2/login/code/Sms/confirm?device=samsung%2FSM-A525F%2F11&locale=en&source=orderacar&city=1615&udid=dbdd557d8431b68e&version=3.14.6o&density=xxhdpi&platform=CLAPP_ANDROID&rt=003452.718&sig=8a56c8fb2fd4ddd8f19d6cfcb78c16ec";
declare const verifyCodeBody: {
    phone: string;
    authKey: string;
    type: string;
    code: string;
    udid: string;
};
