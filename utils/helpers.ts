export const formatAddress = (address?: string,digits?:number,digits2?:number) => {
    if (!address) return "ABC";
    if (address.length <= 6) return address; // Return the original address if it's too short
    return `${address.substring(0, (digits?digits:5))}...${address.substring(
      address.length - (digits2?digits2:4)
    )}`;
  };