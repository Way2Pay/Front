import { atom } from "recoil";
import { PushAPI } from "@pushprotocol/restapi"
export const initialAuthState = {
  accessToken:null,
}
export const authState = atom({
  key: 'authState', // unique ID (with respect to other atoms/selectors)
  default:{...initialAuthState} as AuthAtomState, // default value (aka initial value)
});

  export type AuthAtomState={
    accessToken:string|null
    pushObject: PushAPI|null
  }