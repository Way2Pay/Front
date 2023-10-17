
import { PushAPI } from "@pushprotocol/restapi"

export const createChannel = async (userObject:PushAPI)=>{
    const response = await userObject.channel.create({
        name: 'Test Channel',
        description: 'Test Description',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
        url: 'https://push.org',
      })
      return response;
}

export const sendNotification = async (userObject:PushAPI,recepient:string,title:string,body:string)=>{
    const sendNotifRes = await userObject.channel.send([recepient], {
        notification: { title: 'test', body: 'test' },
      })
      return sendNotifRes
}

export const getChatsList = async(userObject:PushAPI)=>{
    const userChats = await userObject.chat.list("CHATS");
    return userChats;
}

export const sendMessage = async (userObject:PushAPI,recepient:string)=>{
    
    const message = await userObject.chat.send(recepient, {
        type: 'Text',
        content: 'Hello Bob!',
      });
      return message;
}