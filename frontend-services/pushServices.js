export const createChannel = async (userObject) => {
  return (response = await userObject.channel.create({
    name: "Test Channel",
    description: "Test Description",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
    url: "https://push.org",
  }));
};

export const sendNotification = async (userObject) => {
  return (sendNotifRes = await userAlice.channel.send(["*"], {
    notification: { title: "test", body: "test" },
  }));
};

export const getChatsList = async (userObject) => {
  return (userChats = await userObject.chat.list("CHATS"));
};

export const sendMessage = async (userObject, recepient) => {
  return (message = await userObject.chat.send(recepient, {
    type: "Text",
    content: "Hello Bob!",
  }));
};
