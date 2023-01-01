const getCities = `https://cabinet.taximaxim.ir/0000/Services/Public.svc/CitiesEx`;
/// require device name, device id, app version,
const sendVerifyCode = `https://cabinet.taximaxim.ir/0000/Services/Public.svc/api/v2/login/code/sms/send?device=samsung%2FSM-A525F%2F11&source=orderacar&udid=dbdd557d8431b68e&version=3.14.6o`;
const sendVerifyCodeBody = {
  locale: "en",
  phone: "989038338886",
  type: "sms",
  smstoken: "4BGtaT6y5cI",
  isDefault: "1",
  mcc: "432",
};

const verifyCode = `https://cabinet.taximaxim.ir/0000/Services/Public.svc/api/v2/login/code/Sms/confirm?device=samsung%2FSM-A525F%2F11&locale=en&source=orderacar&city=1615&udid=dbdd557d8431b68e&version=3.14.6o&density=xxhdpi&platform=CLAPP_ANDROID&rt=003452.718&sig=8a56c8fb2fd4ddd8f19d6cfcb78c16ec`
const verifyCodeBody = {
  phone: "989038338886",
  authKey: "3DF53EBB-1886-4192-AF90-69EF167A76EB",
  type: "Sms",
  code: "4213",
  udid: "dbdd557d8431b68e",
};
