import { PushAPI } from "@pushprotocol/restapi";

export const createChannel = async (userObject: PushAPI, name:string, description:string,url:string) => {
  const response = await userObject.channel.create({
    name: name,
    description: description,
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
    url: url,
  });
  return response;
};

export const sendNotification = async (
  userObject: PushAPI,
  recepient: string,
  title: string,
  body: string
) => {
  const sendNotifRes = await userObject.channel.send([recepient], {
    notification: { title: title, body: body },
  });
  return sendNotifRes;
};

export const acceptRequest = async (userObject:PushAPI, recepient:string)=>{
  const data = await userObject.chat.accept(recepient)
  return data;
}

export const subscribeChannel = async (
  userObject: PushAPI,
  channel: string
) => {
  const subscription = await userObject.notification.subscribe(channel, {
    settings: [],
  });
};

export const getChannelInfo = async (userObject: PushAPI) => {
    const data = await userObject.channel.info();
    return data;
  };

export const getChatsList = async (userObject: PushAPI) => {
  const userChats = await userObject.chat.list("CHATS");
  return userChats;
};

export const updateUserInfo = async (userObject:PushAPI, imageUrl:string|undefined, name:string|undefined, description:string|undefined) => {
  const updateRequest = await userObject.profile.update({
    picture:imageUrl,
    name:name,
    desc:description,
  })
  return updateRequest;
}

export const getRequestsList = async (userObject: PushAPI) => {
  const userChats = await userObject.chat.list("REQUESTS");
  return userChats;
};

export const getChatHistory = async (userObject: PushAPI, address: string) => {
  const userChats = await userObject.chat.history(address);
  return userChats;
};

export const sendMessage = async (
  userObject: PushAPI,
  recepient: string,
  content: string
) => {
  const message = await userObject.chat.send(recepient, {
    type: "Text",
    content: content,
  });
  return message;
};
